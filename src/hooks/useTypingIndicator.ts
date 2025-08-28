import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

interface TypingUser {
  user_id: string;
  username: string;
}

export const useTypingIndicator = (channelId: string, userId: string | undefined) => {
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!channelId) return;

    // Subscribe to typing indicators for this channel
    const channel = supabase
      .channel('typing_indicators')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'typing_indicators',
          filter: `channel_id=eq.${channelId}`
        }, 
        async (payload) => {
          // Fetch user profile for the typing user
          const { data: profile } = await supabase
            .from('profiles')
            .select('username')
            .eq('user_id', payload.new.user_id)
            .single();

          if (profile && payload.new.user_id !== userId) {
            setTypingUsers(prev => {
              const exists = prev.find(u => u.user_id === payload.new.user_id);
              if (!exists) {
                return [...prev, { 
                  user_id: payload.new.user_id, 
                  username: profile.username 
                }];
              }
              return prev;
            });
          }
        }
      )
      .on('postgres_changes', 
        { 
          event: 'DELETE', 
          schema: 'public', 
          table: 'typing_indicators',
          filter: `channel_id=eq.${channelId}`
        }, 
        (payload) => {
          setTypingUsers(prev => prev.filter(u => u.user_id !== payload.old.user_id));
        }
      )
      .subscribe();

    // Clean up old typing indicators every 10 seconds
    const cleanup = setInterval(async () => {
      await supabase.rpc('cleanup_typing_indicators');
    }, 10000);

    return () => {
      clearInterval(cleanup);
      supabase.removeChannel(channel);
    };
  }, [channelId, userId]);

  const startTyping = async () => {
    if (!userId || !channelId) return;

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Upsert typing indicator
    await supabase
      .from('typing_indicators')
      .upsert({ 
        channel_id: channelId, 
        user_id: userId,
        updated_at: new Date().toISOString()
      });

    // Auto-remove after 5 seconds of inactivity
    typingTimeoutRef.current = setTimeout(async () => {
      await stopTyping();
    }, 5000);
  };

  const stopTyping = async () => {
    if (!userId || !channelId) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    await supabase
      .from('typing_indicators')
      .delete()
      .eq('channel_id', channelId)
      .eq('user_id', userId);
  };

  return {
    typingUsers,
    startTyping,
    stopTyping
  };
};