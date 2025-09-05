import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { RANKS } from "@/types";
import { toast } from "sonner";
import { usePresence } from "./usePresence";
import { useTypingIndicator } from "./useTypingIndicator";
import { useMessageReactions } from "./useMessageReactions";

interface Profile {
  id: string;
  user_id: string;
  username: string;
  rank: string;
  xp: number;
  is_vip: boolean;
  remaining_decrees: number;
  created_at: string;
  updated_at: string;
}

interface Channel {
  id: string;
  name: string;
  description: string;
  type: string;
  min_rank_level: number;
  created_at: string;
}

interface Message {
  id: string;
  channel_id: string;
  user_id: string;
  content: string;
  is_decree: boolean;
  created_at: string;
  edited_at?: string;
  is_deleted?: boolean;
  reply_to_id?: string;
  profiles?: {
    username: string;
    rank: string;
    is_vip: boolean;
  };
}

export const useRealChat = (userId: string | undefined) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeChannelId, setActiveChannelId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  
  // Enhanced features
  const { presenceList, onlineUsers, setUserStatus } = usePresence(userId);
  const { typingUsers, startTyping, stopTyping } = useTypingIndicator(activeChannelId, userId);
  const messageIds = messages.map(m => m.id);
  const { reactions, toggleReaction } = useMessageReactions(messageIds, userId);

  // Fetch user profile
  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile');
      } else {
        setProfile(data);
      }
    };

    fetchProfile();
  }, [userId]);

  // Fetch channels
  useEffect(() => {
    const fetchChannels = async () => {
      const { data, error } = await supabase
        .from('channels')
        .select('*')
        .order('min_rank_level', { ascending: true });

      if (error) {
        console.error('Error fetching channels:', error);
        toast.error('Failed to load channels');
      } else {
        setChannels(data || []);
        if (data && data.length > 0) {
          setActiveChannelId(data[0].id);
        }
      }
      setLoading(false);
    };

    fetchChannels();
  }, []);

  // Fetch messages for active channel with optimizations
  useEffect(() => {
    if (!activeChannelId) return;

    const fetchMessages = async () => {
      // Fetch only recent messages (last 50) with joined profiles for better performance
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select(`
          id,
          channel_id,
          user_id,
          content,
          is_decree,
          created_at,
          edited_at,
          is_deleted,
          reply_to_id,
          profiles:user_id (
            user_id,
            username,
            rank,
            is_vip
          )
        `)
        .eq('channel_id', activeChannelId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (messagesError) {
        console.error('Error fetching messages:', messagesError);
        toast.error('Failed to load messages');
        return;
      }

      // Reverse to show oldest first and map profiles correctly
      const messagesWithProfiles = (messagesData || []).reverse().map(message => ({
        ...message,
        profiles: message.profiles as any
      }));

      setMessages(messagesWithProfiles);
    };

    fetchMessages();

    // Subscribe to real-time updates with optimized profile handling
    const channel = supabase
      .channel(`messages_${activeChannelId}`)
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
          filter: `channel_id=eq.${activeChannelId}`
        }, 
        async (payload) => {
          // Try to get profile from cache first (existing messages)
          const existingProfile = messages.find(m => m.user_id === payload.new.user_id)?.profiles;
          
          if (existingProfile) {
            // Use cached profile for better performance
            const messageWithProfile: Message = {
              id: payload.new.id,
              channel_id: payload.new.channel_id,
              user_id: payload.new.user_id,
              content: payload.new.content,
              is_decree: payload.new.is_decree,
              created_at: payload.new.created_at,
              profiles: existingProfile
            };
            setMessages(prev => [...prev, messageWithProfile]);
          } else {
            // Fetch profile only if not in cache
            const { data: profileData } = await supabase
              .from('profiles')
              .select('user_id, username, rank, is_vip')
              .eq('user_id', payload.new.user_id)
              .single();

            const messageWithProfile: Message = {
              id: payload.new.id,
              channel_id: payload.new.channel_id,
              user_id: payload.new.user_id,
              content: payload.new.content,
              is_decree: payload.new.is_decree,
              created_at: payload.new.created_at,
              profiles: profileData || undefined
            };
            setMessages(prev => [...prev, messageWithProfile]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeChannelId]);

  const editMessage = async (messageId: string, newContent: string) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('messages')
        .update({ 
          content: newContent,
          edited_at: new Date().toISOString()
        })
        .eq('id', messageId)
        .eq('user_id', userId); // Only allow editing own messages

      if (error) {
        console.error('Error editing message:', error);
        toast.error('Failed to edit message');
      } else {
        toast.success('Message edited');
      }
    } catch (error) {
      console.error('Error editing message:', error);
      toast.error('Failed to edit message');
    }
  };

  const deleteMessage = async (messageId: string) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_deleted: true })
        .eq('id', messageId)
        .eq('user_id', userId); // Only allow deleting own messages

      if (error) {
        console.error('Error deleting message:', error);
        toast.error('Failed to delete message');
      } else {
        toast.success('Message deleted');
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Failed to delete message');
    }
  };

  const sendMessage = async (content: string, isDecree = false) => {
    if (!userId || !profile || !activeChannelId) return;

    // Check if user can send decree
    if (isDecree && (!profile.is_vip || profile.remaining_decrees <= 0)) {
      toast.error("You don't have any royal decrees remaining!");
      return;
    }

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          channel_id: activeChannelId,
          user_id: userId,
          content,
          is_decree: isDecree
        });

      if (error) {
        console.error('Error sending message:', error);
        toast.error('Failed to send message');
        return;
      }

      // Update decree count if it was a decree
      if (isDecree) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ remaining_decrees: profile.remaining_decrees - 1 })
          .eq('user_id', userId);

        if (updateError) {
          console.error('Error updating decrees:', updateError);
        } else {
          setProfile(prev => prev ? { ...prev, remaining_decrees: prev.remaining_decrees - 1 } : null);
          toast.success("Royal decree sent!");
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const selectChannel = (channelId: string) => {
    const channel = channels.find(c => c.id === channelId);
    if (!channel || !profile) return;

    const userRankLevel = RANKS[profile.rank as keyof typeof RANKS]?.level || 0;
    if (userRankLevel >= channel.min_rank_level) {
      setActiveChannelId(channelId);
      setMessages([]); // Clear messages when switching channels
    } else {
      toast.error("You need a higher rank to access this channel!");
    }
  };

  const accessibleChannels = channels.filter(channel => {
    if (!profile) return false;
    const userRankLevel = RANKS[profile.rank as keyof typeof RANKS]?.level || 0;
    return userRankLevel >= channel.min_rank_level;
  });

  const activeChannel = channels.find(c => c.id === activeChannelId);

  return {
    profile,
    channels: accessibleChannels,
    messages,
    activeChannel,
    activeChannelId,
    loading,
    sendMessage,
    selectChannel,
    editMessage,
    deleteMessage,
    // Enhanced features
    presenceList,
    onlineUsers,
    setUserStatus,
    typingUsers,
    startTyping,
    stopTyping,
    reactions,
    toggleReaction
  };
};