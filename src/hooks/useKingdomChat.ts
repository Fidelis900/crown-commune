import { useState, useCallback, useEffect } from 'react';
import { User, Message, ChatChannel, RANKS } from '@/types';
import coatOfArms from '@/assets/coat-of-arms.png';

// Mock data for demonstration
const createMockUser = (username: string, rankName: string, xp: number): User => {
  const rank = RANKS[rankName.toLowerCase()];
  return {
    id: Math.random().toString(36),
    username,
    rank,
    xp,
    avatar: coatOfArms,
    isVip: rank.isVip,
    decreeCount: Math.floor(Math.random() * 3),
    maxDecrees: rank.isVip ? (rank.level === 5 ? 3 : rank.level === 6 ? 5 : rank.level === 7 ? 7 : 10) : 0,
    joinedAt: new Date()
  };
};

const mockUsers: User[] = [
  createMockUser("KingArthur", "king", 75000),
  createMockUser("PrincessElara", "prince", 35000),
  createMockUser("DukeMorgan", "duke", 20000),
  createMockUser("CountVladimir", "earl", 6000),
  createMockUser("SirGalahad", "knight", 2000),
  createMockUser("CivilianJohn", "citizen", 800),
  createMockUser("PeasantTom", "peasant", 200)
];

const mockChannels: ChatChannel[] = [
  {
    id: 'great-hall',
    name: 'The Great Hall',
    description: 'General chat for all citizens of the kingdom',
    type: 'public',
    minRankLevel: 1,
    memberCount: 1247
  },
  {
    id: 'marketplace',
    name: 'The Marketplace',
    description: 'Trade, commerce, and economic discussions',
    type: 'public',
    minRankLevel: 1,
    memberCount: 856
  },
  {
    id: 'tavern',
    name: 'The Tavern',
    description: 'Casual conversations and entertainment',
    type: 'public',
    minRankLevel: 1,
    memberCount: 642
  },
  {
    id: 'royal-court',
    name: 'The Royal Court',
    description: 'High-level discussions and kingdom matters',
    type: 'vip',
    minRankLevel: 5,
    memberCount: 89
  },
  {
    id: 'noble-assembly',
    name: 'Noble Assembly',
    description: 'Private discussions among the nobility',
    type: 'vip',
    minRankLevel: 5,
    memberCount: 67
  },
  {
    id: 'royal-chambers',
    name: 'Royal Chambers',
    description: 'Ultra-exclusive discussions for the highest ranks',
    type: 'exclusive',
    minRankLevel: 7,
    memberCount: 12
  }
];

const createMockMessage = (author: User, content: string, isDecree = false): Message => ({
  id: Math.random().toString(36),
  content,
  authorId: author.id,
  author,
  channelId: 'great-hall',
  timestamp: new Date(Date.now() - Math.random() * 3600000),
  isDecree,
  isPinned: isDecree
});

const mockMessages: Message[] = [
  createMockMessage(mockUsers[0], "Welcome to the Kingdom! May your journey through the ranks be prosperous and honorable.", true),
  createMockMessage(mockUsers[1], "The autumn festival preparations are underway. All nobles are invited to contribute ideas."),
  createMockMessage(mockUsers[2], "Has anyone seen the reports from the border settlements? We need to discuss trade routes."),
  createMockMessage(mockUsers[3], "Greetings fellow citizens! I've recently achieved Earl status and am eager to contribute to our kingdom."),
  createMockMessage(mockUsers[4], "The training grounds are open for all knights. Let us hone our skills together."),
  createMockMessage(mockUsers[5], "Does anyone know when the next merchant caravan arrives? I have goods to trade."),
  createMockMessage(mockUsers[6], "Thank you all for welcoming me to the kingdom. I hope to serve faithfully.")
];

export function useKingdomChat() {
  const [currentUser, setCurrentUser] = useState<User>(mockUsers[3]); // Start as Earl
  const [activeChannelId, setActiveChannelId] = useState('great-hall');
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [channels] = useState<ChatChannel[]>(mockChannels);

  // Filter channels based on user's rank
  const accessibleChannels = channels.filter(channel => 
    currentUser.rank.level >= channel.minRankLevel
  );

  const activeChannel = accessibleChannels.find(c => c.id === activeChannelId) || accessibleChannels[0];

  const sendMessage = useCallback((content: string, isDecree = false) => {
    if (isDecree && currentUser.decreeCount >= currentUser.maxDecrees) {
      return; // Can't send decree if limit reached
    }

    const newMessage = createMockMessage(currentUser, content, isDecree);
    newMessage.channelId = activeChannelId;
    
    setMessages(prev => [...prev, newMessage]);

    if (isDecree) {
      setCurrentUser(prev => ({
        ...prev,
        decreeCount: prev.decreeCount + 1
      }));
    }
  }, [currentUser, activeChannelId]);

  const channelMessages = messages
    .filter(msg => msg.channelId === activeChannelId)
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  const selectChannel = useCallback((channelId: string) => {
    const channel = accessibleChannels.find(c => c.id === channelId);
    if (channel) {
      setActiveChannelId(channelId);
    }
  }, [accessibleChannels]);

  const logout = useCallback(() => {
    // Reset to a basic user for demo
    setCurrentUser(mockUsers[6]);
    setActiveChannelId('great-hall');
  }, []);

  // Simulate XP gain from daily activities (not from messaging)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentUser(prev => {
        const newXp = prev.xp + Math.floor(Math.random() * 2); // Random small XP gain
        const currentRankKey = Object.keys(RANKS).find(key => RANKS[key].name === prev.rank.name);
        
        if (currentRankKey) {
          const currentRank = RANKS[currentRankKey];
          if (newXp >= currentRank.maxXp && currentRank.maxXp !== Infinity) {
            // Check for rank up
            const nextRankKey = Object.keys(RANKS).find(key => RANKS[key].level === currentRank.level + 1);
            if (nextRankKey) {
              const nextRank = RANKS[nextRankKey];
              return {
                ...prev,
                xp: newXp,
                rank: nextRank,
                isVip: nextRank.isVip,
                maxDecrees: nextRank.isVip ? (nextRank.level === 5 ? 3 : nextRank.level === 6 ? 5 : nextRank.level === 7 ? 7 : 10) : 0
              };
            }
          }
        }
        
        return { ...prev, xp: newXp };
      });
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return {
    currentUser,
    activeChannel,
    channels: accessibleChannels,
    messages: channelMessages,
    sendMessage,
    selectChannel,
    logout
  };
}