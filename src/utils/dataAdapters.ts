import { User, ChatChannel, Message as ComponentMessage } from "@/types";
import { RANKS } from "@/types";

// Database types
interface DbProfile {
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

interface DbChannel {
  id: string;
  name: string;
  description: string;
  type: string;
  min_rank_level: number;
  created_at: string;
}

interface DbMessage {
  id: string;
  channel_id: string;
  user_id: string;
  content: string;
  is_decree: boolean;
  created_at: string;
  profiles?: {
    username: string;
    rank: string;
    is_vip: boolean;
  };
}

export const profileToUser = (profile: DbProfile): User => {
  const rank = RANKS[profile.rank as keyof typeof RANKS] || RANKS.Peasant;
  
  return {
    id: profile.user_id,
    username: profile.username,
    rank,
    xp: profile.xp,
    isVip: profile.is_vip,
    decreeCount: profile.remaining_decrees,
    maxDecrees: 3,
    joinedAt: new Date(profile.created_at)
  };
};

export const channelToChatChannel = (channel: DbChannel): ChatChannel => {
  const getChannelType = (dbType: string, minRankLevel: number): 'public' | 'vip' | 'exclusive' => {
    if (minRankLevel >= 5) return 'exclusive';
    if (minRankLevel >= 3) return 'vip';
    return 'public';
  };

  return {
    id: channel.id,
    name: channel.name,
    description: channel.description || "",
    type: getChannelType(channel.type, channel.min_rank_level),
    minRankLevel: channel.min_rank_level,
    memberCount: 50 // Mock member count for now
  };
};

export const messageToComponentMessage = (message: DbMessage): ComponentMessage => {
  const rank = message.profiles?.rank ? 
    RANKS[message.profiles.rank as keyof typeof RANKS] || RANKS.Peasant : 
    RANKS.Peasant;

  return {
    id: message.id,
    authorId: message.user_id,
    author: {
      id: message.user_id,
      username: message.profiles?.username || "Unknown User",
      rank,
      xp: 0, // Not available in message query
      isVip: message.profiles?.is_vip || false,
      decreeCount: 3, // Not available in message query
      maxDecrees: 3,
      joinedAt: new Date()
    },
    content: message.content,
    timestamp: new Date(message.created_at),
    channelId: message.channel_id,
    isDecree: message.is_decree,
    isPinned: false // Not implemented yet
  };
};