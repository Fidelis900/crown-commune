import { ChatChannel, User } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RankBadge } from "./RankBadge";
import { 
  Crown, 
  Shield, 
  Users, 
  Sword, 
  Scroll, 
  Settings,
  LogOut,
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  currentUser: User;
  channels: ChatChannel[];
  activeChannelId: string;
  onChannelSelect: (channelId: string) => void;
  onLogout: () => void;
}

export function Sidebar({ 
  currentUser, 
  channels, 
  activeChannelId, 
  onChannelSelect,
  onLogout 
}: SidebarProps) {
  const publicChannels = channels.filter(c => c.type === 'public');
  const vipChannels = channels.filter(c => c.type === 'vip');
  const exclusiveChannels = channels.filter(c => c.type === 'exclusive');

  const getChannelIcon = (channel: ChatChannel) => {
    switch (channel.type) {
      case 'exclusive':
        return Crown;
      case 'vip':
        return Shield;
      default:
        return Users;
    }
  };

  return (
    <div className="w-80 h-full bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* User Profile */}
      <div className="p-6 border-b border-sidebar-border bg-throne-gradient">
        <div className="space-y-4">
          <div className="text-center">
            <h1 className="font-display font-bold text-2xl text-primary mb-2">
              Kingdom Chat
            </h1>
            <Crown className="w-8 h-8 text-primary mx-auto" />
          </div>
          
          <div className="space-y-3">
            <div className="text-center">
              <h2 className="font-display font-semibold text-lg">
                {currentUser.username}
              </h2>
            </div>
            
            <RankBadge user={currentUser} showXp className="w-full" />
            
            {currentUser.isVip && (
              <div className="vip-exclusive p-3 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-display font-medium">VIP Status</span>
                  <Crown className="w-4 h-4 text-primary" />
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Decrees: {currentUser.decreeCount}/{currentUser.maxDecrees}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Public Channels */}
        <div className="space-y-2">
          <h3 className="font-display font-semibold text-sm text-muted-foreground uppercase tracking-wider px-2">
            Public Realms
          </h3>
          {publicChannels.map((channel) => {
            const Icon = getChannelIcon(channel);
            const isActive = channel.id === activeChannelId;
            
            return (
              <Button
                key={channel.id}
                variant={isActive ? "secondary" : "ghost"}
                className="w-full justify-start gap-3 h-auto p-3"
                onClick={() => onChannelSelect(channel.id)}
              >
                <Icon className="w-4 h-4" />
                <div className="flex-1 text-left">
                  <div className="font-medium">{channel.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {channel.memberCount} members
                  </div>
                </div>
              </Button>
            );
          })}
        </div>

        {/* VIP Channels */}
        {currentUser.isVip && vipChannels.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-display font-semibold text-sm text-primary uppercase tracking-wider px-2 flex items-center gap-2">
              <Crown className="w-3 h-3" />
              VIP Chambers
            </h3>
            {vipChannels.map((channel) => {
              const Icon = getChannelIcon(channel);
              const isActive = channel.id === activeChannelId;
              
              return (
                <Button
                  key={channel.id}
                  variant={isActive ? "vip" : "ghost"}
                  className="w-full justify-start gap-3 h-auto p-3 vip-exclusive"
                  onClick={() => onChannelSelect(channel.id)}
                >
                  <Icon className="w-4 h-4" />
                  <div className="flex-1 text-left">
                    <div className="font-medium">{channel.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {channel.memberCount} nobles
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs bg-primary/10 border-primary/50">
                    VIP
                  </Badge>
                </Button>
              );
            })}
          </div>
        )}

        {/* Exclusive Channels */}
        {currentUser.rank.level >= 7 && exclusiveChannels.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-display font-semibold text-sm text-primary uppercase tracking-wider px-2 flex items-center gap-2">
              <Crown className="w-3 h-3" />
              Royal Chambers
            </h3>
            {exclusiveChannels.map((channel) => {
              const Icon = getChannelIcon(channel);
              const isActive = channel.id === activeChannelId;
              
              return (
                <Button
                  key={channel.id}
                  variant={isActive ? "royal" : "ghost"}
                  className="w-full justify-start gap-3 h-auto p-3"
                  onClick={() => onChannelSelect(channel.id)}
                >
                  <Icon className="w-4 h-4" />
                  <div className="flex-1 text-left">
                    <div className="font-medium">{channel.name}</div>
                    <div className="text-xs text-muted-foreground">
                      Elite access only
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-sidebar-border space-y-2">
        <Button variant="ghost" className="w-full justify-start gap-3" size="sm">
          <Scroll className="w-4 h-4" />
          Petitions
        </Button>
        
        <Button variant="ghost" className="w-full justify-start gap-3" size="sm">
          <Settings className="w-4 h-4" />
          Settings
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full justify-start gap-3" 
          size="sm"
          onClick={onLogout}
        >
          <LogOut className="w-4 h-4" />
          Leave Kingdom
        </Button>
      </div>
    </div>
  );
}