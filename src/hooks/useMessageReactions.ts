import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Reaction {
  id: string;
  message_id: string;
  user_id: string;
  emoji: string;
  created_at: string;
}

interface ReactionSummary {
  emoji: string;
  count: number;
  users: string[];
  hasUserReacted: boolean;
}

export const useMessageReactions = (messageIds: string[], userId: string | undefined) => {
  const [reactions, setReactions] = useState<Record<string, ReactionSummary[]>>({});

  useEffect(() => {
    if (messageIds.length === 0) return;

    const fetchReactions = async () => {
      const { data, error } = await supabase
        .from('message_reactions')
        .select('*')
        .in('message_id', messageIds);

      if (error) {
        console.error('Error fetching reactions:', error);
        return;
      }

      // Group reactions by message and emoji
      const groupedReactions: Record<string, ReactionSummary[]> = {};
      
      messageIds.forEach(messageId => {
        const messageReactions = data?.filter(r => r.message_id === messageId) || [];
        const emojiGroups: Record<string, Reaction[]> = {};

        messageReactions.forEach(reaction => {
          if (!emojiGroups[reaction.emoji]) {
            emojiGroups[reaction.emoji] = [];
          }
          emojiGroups[reaction.emoji].push(reaction);
        });

        groupedReactions[messageId] = Object.entries(emojiGroups).map(([emoji, reactions]) => ({
          emoji,
          count: reactions.length,
          users: reactions.map(r => r.user_id),
          hasUserReacted: reactions.some(r => r.user_id === userId)
        }));
      });

      setReactions(groupedReactions);
    };

    fetchReactions();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('message_reactions')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'message_reactions',
          filter: `message_id=in.(${messageIds.join(',')})`
        }, 
        () => {
          fetchReactions(); // Refetch on any change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [messageIds.join(','), userId]);

  const addReaction = async (messageId: string, emoji: string) => {
    if (!userId) {
      toast.error('You must be logged in to react to messages');
      return;
    }

    try {
      const { error } = await supabase
        .from('message_reactions')
        .insert({
          message_id: messageId,
          user_id: userId,
          emoji
        });

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast.error('You have already reacted with this emoji');
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error('Error adding reaction:', error);
      toast.error('Failed to add reaction');
    }
  };

  const removeReaction = async (messageId: string, emoji: string) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('message_reactions')
        .delete()
        .eq('message_id', messageId)
        .eq('user_id', userId)
        .eq('emoji', emoji);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error removing reaction:', error);
      toast.error('Failed to remove reaction');
    }
  };

  const toggleReaction = async (messageId: string, emoji: string) => {
    const messageReactions = reactions[messageId] || [];
    const emojiReaction = messageReactions.find(r => r.emoji === emoji);
    
    if (emojiReaction?.hasUserReacted) {
      await removeReaction(messageId, emoji);
    } else {
      await addReaction(messageId, emoji);
    }
  };

  return {
    reactions,
    addReaction,
    removeReaction,
    toggleReaction
  };
};