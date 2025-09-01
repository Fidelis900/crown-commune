import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Scroll, 
  Sword, 
  Crown, 
  Users, 
  Clock, 
  Trophy, 
  Star,
  Target,
  MapPin,
  Coins
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const mockQuests = [
  {
    id: "1",
    title: "Patrol the Northern Border",
    description: "Secure the northern territories and report any suspicious activity to the Captain of Guards.",
    difficulty: "Medium",
    xpReward: 250,
    goldReward: 100,
    duration: "2-3 hours",
    type: "patrol",
    status: "available",
    participants: 2,
    maxParticipants: 5,
    location: "Northern Borderlands"
  },
  {
    id: "2",
    title: "Escort Royal Merchant Caravan",
    description: "Protect the royal merchant caravan on their journey to the neighboring kingdom.",
    difficulty: "Hard",
    xpReward: 500,
    goldReward: 300,
    duration: "1 day",
    type: "escort",
    status: "in-progress",
    participants: 4,
    maxParticipants: 6,
    location: "Trade Route Alpha"
  },
  {
    id: "3",
    title: "Investigate Missing Livestock",
    description: "Several farmers have reported missing livestock. Find out what's causing these disappearances.",
    difficulty: "Easy",
    xpReward: 150,
    goldReward: 50,
    duration: "1-2 hours",
    type: "investigation",
    status: "available",
    participants: 1,
    maxParticipants: 3,
    location: "Farming District"
  },
  {
    id: "4",
    title: "Royal Tournament Preparation",
    description: "Help organize and prepare the upcoming royal tournament. Various tasks available.",
    difficulty: "Easy",
    xpReward: 200,
    goldReward: 75,
    duration: "3-4 hours",
    type: "event",
    status: "available",
    participants: 8,
    maxParticipants: 15,
    location: "Tournament Grounds"
  },
  {
    id: "5",
    title: "Ancient Ruin Exploration",
    description: "Explore newly discovered ancient ruins and document any artifacts found.",
    difficulty: "Hard",
    xpReward: 600,
    goldReward: 400,
    duration: "2-3 days",
    type: "exploration",
    status: "completed",
    participants: 3,
    maxParticipants: 4,
    location: "Eastern Ruins"
  }
];

const difficultyColors = {
  "Easy": "bg-green-100 text-green-800",
  "Medium": "bg-yellow-100 text-yellow-800",
  "Hard": "bg-red-100 text-red-800"
};

const statusColors = {
  "available": "bg-blue-100 text-blue-800",
  "in-progress": "bg-orange-100 text-orange-800",
  "completed": "bg-green-100 text-green-800"
};

const typeIcons = {
  patrol: Target,
  escort: Users,
  investigation: Scroll,
  event: Trophy,
  exploration: MapPin
};

export function QuestBoard() {
  const [selectedTab, setSelectedTab] = useState("available");
  const [selectedQuest, setSelectedQuest] = useState<any>(null);
  const { toast } = useToast();

  const getQuestsByStatus = (status: string) => {
    if (status === "available") return mockQuests.filter(q => q.status === "available");
    if (status === "active") return mockQuests.filter(q => q.status === "in-progress");
    if (status === "completed") return mockQuests.filter(q => q.status === "completed");
    return mockQuests;
  };

  const handleJoinQuest = (questId: string) => {
    toast({
      title: "Quest Joined",
      description: "You have successfully joined the quest. Check your active quests tab.",
    });
  };

  const handleViewDetails = (quest: any) => {
    setSelectedQuest(quest);
  };

  const getTypeIcon = (type: string) => {
    return typeIcons[type as keyof typeof typeIcons] || Scroll;
  };

  return (
    <div className="h-full bg-background">
      <div className="h-full overflow-y-auto">
        {/* Header */}
        <div className="bg-throne-gradient border-b border-border p-6">
          <div className="flex items-center gap-3">
            <Scroll className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-2xl font-display font-bold text-primary">Quest Board</h1>
              <p className="text-muted-foreground">Accept quests to earn XP, gold, and glory for the kingdom</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="available" className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                Available Quests
              </TabsTrigger>
              <TabsTrigger value="active" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Active Quests
              </TabsTrigger>
              <TabsTrigger value="completed" className="flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                Completed
              </TabsTrigger>
            </TabsList>

            {["available", "active", "completed"].map(status => (
              <TabsContent key={status} value={status} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  {getQuestsByStatus(status).map(quest => {
                    const TypeIcon = getTypeIcon(quest.type);
                    const participationProgress = (quest.participants / quest.maxParticipants) * 100;
                    
                    return (
                      <Card key={quest.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <TypeIcon className="w-5 h-5 text-primary" />
                              <CardTitle className="text-lg">{quest.title}</CardTitle>
                            </div>
                            <div className="flex gap-2">
                              <Badge className={difficultyColors[quest.difficulty as keyof typeof difficultyColors]}>
                                {quest.difficulty}
                              </Badge>
                              <Badge className={statusColors[quest.status as keyof typeof statusColors]}>
                                {quest.status}
                              </Badge>
                            </div>
                          </div>
                          <CardDescription className="line-clamp-2">
                            {quest.description}
                          </CardDescription>
                        </CardHeader>
                        
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Star className="w-4 h-4 text-yellow-500" />
                              <span>{quest.xpReward} XP</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Coins className="w-4 h-4 text-yellow-600" />
                              <span>{quest.goldReward} Gold</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-blue-500" />
                              <span>{quest.duration}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-green-500" />
                              <span className="truncate">{quest.location}</span>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Participants</span>
                              <span>{quest.participants}/{quest.maxParticipants}</span>
                            </div>
                            <Progress value={participationProgress} className="h-2" />
                          </div>
                          
                          <div className="flex gap-2">
                            {quest.status === "available" && (
                              <Button 
                                size="sm" 
                                className="flex-1"
                                onClick={() => handleJoinQuest(quest.id)}
                                disabled={quest.participants >= quest.maxParticipants}
                              >
                                <Sword className="w-3 h-3 mr-2" />
                                {quest.participants >= quest.maxParticipants ? "Quest Full" : "Join Quest"}
                              </Button>
                            )}
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleViewDetails(quest)}
                            >
                              View Details
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
                
                {getQuestsByStatus(status).length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Scroll className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg mb-2">No {status} quests</p>
                    <p>Check back later for new opportunities.</p>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>

      {/* Quest Details Dialog */}
      {selectedQuest && (
        <Dialog open={!!selectedQuest} onOpenChange={() => setSelectedQuest(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {(() => {
                  const TypeIcon = getTypeIcon(selectedQuest.type);
                  return <TypeIcon className="w-5 h-5 text-primary" />;
                })()}
                {selectedQuest.title}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <p className="text-muted-foreground">{selectedQuest.description}</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="font-medium">Rewards</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <Star className="w-3 h-3 text-yellow-500" />
                      {selectedQuest.xpReward} XP
                    </div>
                    <div className="flex items-center gap-2">
                      <Coins className="w-3 h-3 text-yellow-600" />
                      {selectedQuest.goldReward} Gold
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="font-medium">Details</p>
                  <div className="space-y-1 text-sm">
                    <div>Duration: {selectedQuest.duration}</div>
                    <div>Location: {selectedQuest.location}</div>
                    <div>Difficulty: {selectedQuest.difficulty}</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="font-medium">Participants ({selectedQuest.participants}/{selectedQuest.maxParticipants})</p>
                <Progress value={(selectedQuest.participants / selectedQuest.maxParticipants) * 100} className="h-2" />
              </div>
              
              {selectedQuest.status === "available" && (
                <Button 
                  className="w-full" 
                  onClick={() => {
                    handleJoinQuest(selectedQuest.id);
                    setSelectedQuest(null);
                  }}
                  disabled={selectedQuest.participants >= selectedQuest.maxParticipants}
                >
                  <Sword className="w-4 h-4 mr-2" />
                  Join Quest
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}