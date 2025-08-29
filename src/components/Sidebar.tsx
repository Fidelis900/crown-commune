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
  Plus,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";

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
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const handleChannelSelect = (channelId: string) => {
    onChannelSelect(channelId);
    if (isMobile) {
      setIsOpen(false);
    }
  };
  // Categorize channels by purpose and access level
  const publicChannels = channels.filter(c => c.type === 'public' && c.minRankLevel <= 2);
  const knightChannels = channels.filter(c => c.minRankLevel >= 3 && c.minRankLevel <= 4);
  const vipChannels = channels.filter(c => c.type === 'vip' && c.minRankLevel >= 5 && c.minRankLevel <= 6);
  const exclusiveChannels = channels.filter(c => c.type === 'exclusive' && c.minRankLevel >= 7);
  const specialChannels = channels.filter(c => ['official', 'support', 'events', 'archive', 'diplomatic'].includes(c.type));

  const getChannelIcon = (channel: ChatChannel) => {
    // Icon based on channel name and type
    if (channel.name.includes('War') || channel.name.includes('Training')) return Sword;
    if (channel.name.includes('Treasury') || channel.name.includes('Trading')) return Shield;
    if (channel.name.includes('Royal') || channel.name.includes('Crown') || channel.name.includes('Throne')) return Crown;
    if (channel.name.includes('Council') || channel.name.includes('Assembly')) return Scroll;
    if (channel.name.includes('Announce') || channel.name.includes('Support')) return Settings;
    
    // Default by type
    switch (channel.type) {
      case 'exclusive':
        return Crown;
      case 'vip':
        return Shield;
      default:
        return Users;
    }
  };

  const sidebarContent = (
    <div className={cn(
      "h-full bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300",
      isCollapsed ? "w-16" : "w-80"
    )}>
      {/* Header with toggle */}
      <div className="p-4 border-b border-sidebar-border bg-throne-gradient flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <Crown className="w-6 h-6 text-primary" />
            <h1 className="font-display font-bold text-lg text-primary">Kingdom Chat</h1>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-primary hover:bg-primary/10"
        >
          {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
      </div>
      
      {/* User Profile */}
      {!isCollapsed && (
        <div className="p-4 border-b border-sidebar-border bg-throne-gradient">
          <div className="space-y-3">
            <div className="text-center">
              <h2 className="font-display font-semibold text-base">
                {currentUser.username}
              </h2>
            </div>
            
            <RankBadge user={currentUser} showXp className="w-full" />
            
            {currentUser.isVip && (
              <div className="vip-exclusive p-2 rounded-lg">
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
      )}
      
      {/* Collapsed user indicator */}
      {isCollapsed && (
        <div className="p-2 border-b border-sidebar-border bg-throne-gradient">
          <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
            <span className="text-primary font-bold text-sm">
              {currentUser.username.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className={cn(
        "flex-1 overflow-y-auto space-y-4",
        isCollapsed ? "p-2" : "p-4"
      )}>
        {/* Special Channels */}
        {specialChannels.length > 0 && (
          <div className="space-y-2">
            {!isCollapsed && (
              <h3 className="font-display font-semibold text-sm text-muted-foreground uppercase tracking-wider px-2">
                Kingdom
              </h3>
            )}
            {specialChannels.map((channel) => {
              const Icon = getChannelIcon(channel);
              const isActive = channel.id === activeChannelId;
              
              return (
                <Button
                  key={channel.id}
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full gap-3 h-auto",
                    isCollapsed ? "p-2 justify-center" : "p-3 justify-start"
                  )}
                  onClick={() => handleChannelSelect(channel.id)}
                  title={isCollapsed ? channel.name : undefined}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {!isCollapsed && (
                    <div className="flex-1 text-left">
                      <div className="font-medium">{channel.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {channel.description}
                      </div>
                    </div>
                  )}
                </Button>
              );
            })}
          </div>
        )}

        {/* Public Channels */}
        {publicChannels.length > 0 && (
          <div className="space-y-2">
            {!isCollapsed && (
              <h3 className="font-display font-semibold text-sm text-muted-foreground uppercase tracking-wider px-2">
                Public Realms
              </h3>
            )}
            {publicChannels.map((channel) => {
              const Icon = getChannelIcon(channel);
              const isActive = channel.id === activeChannelId;
              
              return (
                <Button
                  key={channel.id}
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full gap-3 h-auto",
                    isCollapsed ? "p-2 justify-center" : "p-3 justify-start"
                  )}
                  onClick={() => handleChannelSelect(channel.id)}
                  title={isCollapsed ? channel.name : undefined}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {!isCollapsed && (
                    <div className="flex-1 text-left">
                      <div className="font-medium">{channel.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {channel.memberCount} members
                      </div>
                    </div>
                  )}
                </Button>
              );
            })}
          </div>
        )}

        {/* Knight Channels */}
        {currentUser.rank.level >= 3 && knightChannels.length > 0 && (
          <div className="space-y-2">
            {!isCollapsed && (
              <h3 className="font-display font-semibold text-sm text-muted-foreground uppercase tracking-wider px-2 flex items-center gap-2">
                <Sword className="w-3 h-3" />
                Knight Halls
              </h3>
            )}
            {knightChannels.map((channel) => {
              const Icon = getChannelIcon(channel);
              const isActive = channel.id === activeChannelId;
              
              return (
                <Button
                  key={channel.id}
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full gap-3 h-auto",
                    isCollapsed ? "p-2 justify-center" : "p-3 justify-start"
                  )}
                  onClick={() => handleChannelSelect(channel.id)}
                  title={isCollapsed ? channel.name : undefined}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {!isCollapsed && (
                    <div className="flex-1 text-left">
                      <div className="font-medium">{channel.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {channel.description}
                      </div>
                    </div>
                  )}
                  {!isCollapsed && (
                    <Badge variant="outline" className="text-xs bg-secondary/10 border-secondary/50">
                      Knight+
                    </Badge>
                  )}
                </Button>
              );
            })}
          </div>
        )}

        {/* VIP Channels */}
        {currentUser.isVip && vipChannels.length > 0 && (
          <div className="space-y-2">
            {!isCollapsed && (
              <h3 className="font-display font-semibold text-sm text-primary uppercase tracking-wider px-2 flex items-center gap-2">
                <Crown className="w-3 h-3" />
                VIP Chambers
              </h3>
            )}
            {vipChannels.map((channel) => {
              const Icon = getChannelIcon(channel);
              const isActive = channel.id === activeChannelId;
              
              return (
                <Button
                  key={channel.id}
                  variant={isActive ? "vip" : "ghost"}
                  className={cn(
                    "w-full gap-3 h-auto vip-exclusive",
                    isCollapsed ? "p-2 justify-center" : "p-3 justify-start"
                  )}
                  onClick={() => handleChannelSelect(channel.id)}
                  title={isCollapsed ? channel.name : undefined}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {!isCollapsed && (
                    <div className="flex-1 text-left">
                      <div className="font-medium">{channel.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {channel.description}
                      </div>
                    </div>
                  )}
                  {!isCollapsed && (
                    <Badge variant="outline" className="text-xs bg-primary/10 border-primary/50">
                      VIP
                    </Badge>
                  )}
                </Button>
              );
            })}
          </div>
        )}

        {/* Exclusive Channels */}
        {currentUser.rank.level >= 7 && exclusiveChannels.length > 0 && (
          <div className="space-y-2">
            {!isCollapsed && (
              <h3 className="font-display font-semibold text-sm text-primary uppercase tracking-wider px-2 flex items-center gap-2">
                <Crown className="w-3 h-3" />
                Royal Chambers
              </h3>
            )}
            {exclusiveChannels.map((channel) => {
              const Icon = getChannelIcon(channel);
              const isActive = channel.id === activeChannelId;
              
              return (
                <Button
                  key={channel.id}
                  variant={isActive ? "royal" : "ghost"}
                  className={cn(
                    "w-full gap-3 h-auto",
                    isCollapsed ? "p-2 justify-center" : "p-3 justify-start"
                  )}
                  onClick={() => handleChannelSelect(channel.id)}
                  title={isCollapsed ? channel.name : undefined}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {!isCollapsed && (
                    <div className="flex-1 text-left">
                      <div className="font-medium">{channel.name}</div>
                      <div className="text-xs text-muted-foreground">
                        Elite access only
                      </div>
                    </div>
                  )}
                  {!isCollapsed && (
                    <Badge variant="outline" className="text-xs bg-primary/10 border-primary/50">
                      Royal
                    </Badge>
                  )}
                </Button>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className={cn(
        "border-t border-sidebar-border space-y-2",
        isCollapsed ? "p-2" : "p-4"
      )}>
        <Button 
          variant="ghost" 
          className={cn(
            "w-full gap-3",
            isCollapsed ? "justify-center p-2" : "justify-start"
          )}
          size="sm"
          title={isCollapsed ? "Petitions" : undefined}
        >
          <Scroll className="w-4 h-4" />
          {!isCollapsed && "Petitions"}
        </Button>
        
        <Button 
          variant="ghost" 
          className={cn(
            "w-full gap-3",
            isCollapsed ? "justify-center p-2" : "justify-start"
          )}
          size="sm"
          title={isCollapsed ? "Settings" : undefined}
        >
          <Settings className="w-4 h-4" />
          {!isCollapsed && "Settings"}
        </Button>
        
        <Button 
          variant="outline" 
          className={cn(
            "w-full gap-3",
            isCollapsed ? "justify-center p-2" : "justify-start"
          )}
          size="sm"
          onClick={onLogout}
          title={isCollapsed ? "Leave Kingdom" : undefined}
        >
          <LogOut className="w-4 h-4" />
          {!isCollapsed && "Leave Kingdom"}
        </Button>
      </div>
    </div>
  );
  
  if (isMobile) {
    return (
      <>
        {/* Mobile trigger button */}
        <Button
          variant="outline"
          size="icon"
          className="fixed top-4 left-4 z-50 md:hidden"
          onClick={() => setIsOpen(true)}
        >
          <Menu className="h-4 w-4" />
        </Button>
        
        {/* Mobile overlay */}
        {isOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div 
              className="absolute inset-0 bg-black/50" 
              onClick={() => setIsOpen(false)}
            />
            <div className="relative w-80 h-full bg-sidebar">
              {/* Close button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-10"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
              {sidebarContent}
            </div>
          </div>
        )}
      </>
    );
  }
  
  return (
    <div className={cn(
      "hidden md:block transition-all duration-300",
      isCollapsed ? "w-16" : "w-80"
    )}>
      {sidebarContent}
    </div>
  );
}