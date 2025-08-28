import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface UserPresence {
  user_id: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  last_seen: string;
  username?: string;
}

export const usePresence = (userId: string | undefined) => {
  const [presenceList, setPresenceList] = useState<UserPresence[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!userId) return;

    // Update user presence to online
    const updatePresence = async () => {
      await supabase.rpc('update_user_presence', { new_status: 'online' });
    };

    updatePresence();

    // Set up real-time presence tracking
    const channel = supabase.channel('user_presence');

    // Track current user
    channel.on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState();
      const users = Object.keys(state).map(key => ({
        user_id: key,
        ...state[key][0]
      }));
      setOnlineUsers(new Set(users.map(u => u.user_id)));
    });

    channel.on('presence', { event: 'join' }, ({ key, newPresences }) => {
      setOnlineUsers(prev => new Set([...prev, key]));
    });

    channel.on('presence', { event: 'leave' }, ({ key }) => {
      setOnlineUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(key);
        return newSet;
      });
    });

    // Subscribe and track presence
    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({
          user_id: userId,
          status: 'online',
          timestamp: new Date().toISOString()
        });
      }
    });

    // Fetch all presence data
    const fetchPresence = async () => {
      const { data, error } = await supabase
        .from('user_presence')
        .select(`
          user_id,
          status,
          last_seen,
          profiles:user_id (username)
        `);

      if (!error && data) {
        const presence = data.map(p => ({
          user_id: p.user_id,
          status: p.status as 'online' | 'away' | 'busy' | 'offline',
          last_seen: p.last_seen,
          username: (p.profiles as any)?.username
        }));
        setPresenceList(presence);
      }
    };

    fetchPresence();

    // Update presence every 30 seconds
    const interval = setInterval(updatePresence, 30000);

    // Set offline when leaving
    const handleBeforeUnload = async () => {
      await supabase.rpc('update_user_presence', { new_status: 'offline' });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      supabase.removeChannel(channel);
      handleBeforeUnload();
    };
  }, [userId]);

  const setUserStatus = async (status: 'online' | 'away' | 'busy' | 'offline') => {
    if (!userId) return;
    await supabase.rpc('update_user_presence', { new_status: status });
  };

  return {
    presenceList,
    onlineUsers,
    setUserStatus
  };
};