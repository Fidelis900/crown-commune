export interface User {
  id: string;
  username: string;
  rank: Rank;
  xp: number;
  avatar?: string;
  coatOfArms?: string;
  isVip: boolean;
  decreeCount: number;
  maxDecrees: number;
  joinedAt: Date;
}

export interface Rank {
  name: string;
  level: number;
  minXp: number;
  maxXp: number;
  color: string;
  isVip: boolean;
  privileges: string[];
}

export interface Message {
  id: string;
  content: string;
  authorId: string;
  author: User;
  channelId: string;
  timestamp: Date;
  isDecree?: boolean;
  isPinned?: boolean;
}

export interface ChatChannel {
  id: string;
  name: string;
  description: string;
  type: 'public' | 'vip' | 'exclusive';
  minRankLevel: number;
  memberCount: number;
}

export interface Petition {
  id: string;
  fromUserId: string;
  toUserId: string;
  subject: string;
  content: string;
  status: 'pending' | 'approved' | 'denied';
  createdAt: Date;
  respondedAt?: Date;
  response?: string;
}

export const RANKS: Record<string, Rank> = {
  peasant: {
    name: "Peasant",
    level: 1,
    minXp: 0,
    maxXp: 500,
    color: "rank-peasant",
    isVip: false,
    privileges: ["Basic Chat Access"]
  },
  citizen: {
    name: "Citizen",
    level: 2,
    minXp: 501,
    maxXp: 1200,
    color: "rank-citizen",
    isVip: false,
    privileges: ["Basic Chat Access", "Join Factions"]
  },
  knight: {
    name: "Knight",
    level: 3,
    minXp: 1201,
    maxXp: 2500,
    color: "rank-knight",
    isVip: false,
    privileges: ["Basic Chat Access", "Join Factions", "Create Petitions"]
  },
  baron: {
    name: "Baron",
    level: 4,
    minXp: 2501,
    maxXp: 4500,
    color: "rank-baron",
    isVip: false,
    privileges: ["Basic Chat Access", "Join Factions", "Create Petitions", "Message Intermediary"]
  },
  earl: {
    name: "Earl",
    level: 5,
    minXp: 4501,
    maxXp: 8000,
    color: "rank-earl",
    isVip: true,
    privileges: ["VIP Chat Access", "Profile Customization", "Royal Decrees (3/month)", "Court Records"]
  },
  marquis: {
    name: "Marquis",
    level: 6,
    minXp: 8001,
    maxXp: 15000,
    color: "rank-marquis",
    isVip: true,
    privileges: ["VIP Chat Access", "Profile Customization", "Royal Decrees (5/month)", "Host Events", "Voting Rights"]
  },
  duke: {
    name: "Duke",
    level: 7,
    minXp: 15001,
    maxXp: 25000,
    color: "rank-duke",
    isVip: true,
    privileges: ["VIP Chat Access", "Profile Customization", "Royal Decrees (7/month)", "Host Events", "Voting Rights", "Royal Chambers Access"]
  },
  prince: {
    name: "Prince",
    level: 8,
    minXp: 25001,
    maxXp: 50000,
    color: "rank-prince",
    isVip: true,
    privileges: ["All VIP Privileges", "Royal Decrees (10/month)", "Kingdom Influence"]
  },
  king: {
    name: "King",
    level: 9,
    minXp: 50001,
    maxXp: Infinity,
    color: "rank-king",
    isVip: true,
    privileges: ["Ultimate Authority", "Unlimited Decrees", "System Administration"]
  }
};