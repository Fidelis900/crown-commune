import { Message } from "@/types";
import { RankBadge } from "./RankBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageReactions } from "./MessageReactions";
import { UserPresenceIndicator } from "./UserPresenceIndicator";
import { Crown, Pin, Edit, Trash, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import coatOfArms from "@/assets/coat-of-arms.png";

interface ChatMessageProps {
  message: Message;
  currentUserId?: string;
  reactions?: Array<{
    emoji: string;
    count: number;
    users: string[];
    hasUserReacted: boolean;
  }>;
  isUserOnline?: boolean;
  onEdit?: (messageId: string, newContent: string) => void;
  onDelete?: (messageId: string) => void;
  onToggleReaction?: (messageId: string, emoji: string) => void;
  className?: string;
}

export function ChatMessage({ 
  message, 
  currentUserId,
  reactions = [],
  isUserOnline = false,
  onEdit,
  onDelete,
  onToggleReaction,
  className 
}: ChatMessageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  
  const isVip = message.author.isVip;
  const isDecree = message.isDecree;
  const isPinned = message.isPinned;
  const isOwn = currentUserId === message.author.id;
  const isDeleted = message.isDeleted;

  const handleSaveEdit = () => {
    if (onEdit && editContent.trim() !== message.content) {
      onEdit(message.id, editContent.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditContent(message.content);
    setIsEditing(false);
  };

  if (isDeleted) {
    return (
      <div className={cn("flex gap-3 p-4 rounded-lg opacity-50", className)}>
        <div className="text-sm text-muted-foreground italic">
          This message was deleted
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "flex gap-3 p-4 rounded-lg transition-all hover:bg-muted/50 group",
      isDecree && "vip-exclusive border border-primary/50 shadow-royal",
      isPinned && "bg-accent/20 border-l-4 border-primary",
      className
    )}>
      <div className="relative">
        <Avatar className={cn("w-10 h-10", isVip && "ring-2 ring-primary/50")}>
          <AvatarImage src={message.author.avatar || coatOfArms} />
          <AvatarFallback className="font-display">
            {message.author.username.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <UserPresenceIndicator 
          status={isUserOnline ? 'online' : 'offline'}
          className="absolute -bottom-1 -right-1"
        />
      </div>

      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={cn(
            "font-display font-semibold",
            isVip && "text-primary"
          )}>
            {message.author.username}
          </span>
          
          <RankBadge user={message.author} />
          
          {isDecree && (
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/50">
              <Crown className="w-3 h-3 mr-1" />
              Royal Decree
            </Badge>
          )}
          
          {isPinned && (
            <Badge variant="outline" className="bg-accent/10">
              <Pin className="w-3 h-3 mr-1" />
              Pinned
            </Badge>
          )}
          
          <span className="text-xs text-muted-foreground ml-auto">
            {message.timestamp.toLocaleTimeString()}
            {message.editedAt && (
              <span className="ml-1 italic">(edited)</span>
            )}
          </span>

          {/* Message actions - only show on hover and for own messages */}
          {isOwn && !isEditing && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
              {onEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="w-3 h-3" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                  onClick={() => onDelete(message.id)}
                >
                  <Trash className="w-3 h-3" />
                </Button>
              )}
            </div>
          )}
        </div>

        <div className={cn(
          "prose prose-sm max-w-none",
          isDecree && "font-display text-primary font-semibold",
          "prose-invert prose-headings:text-foreground prose-p:text-foreground"
        )}>
          {isDecree && (
            <div className="text-primary/80 text-xs uppercase tracking-wider mb-2 font-display">
              By Royal Decree
            </div>
          )}
          
          {isEditing ? (
            <div className="flex gap-2 items-center">
              <Input
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSaveEdit();
                  }
                  if (e.key === 'Escape') {
                    handleCancelEdit();
                  }
                }}
                autoFocus
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSaveEdit}
                className="h-8 w-8 p-0 text-green-600 hover:text-green-600"
              >
                <Check className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancelEdit}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <p className="mb-0">{message.content}</p>
          )}
        </div>

        {/* Message Reactions */}
        {onToggleReaction && (
          <MessageReactions
            messageId={message.id}
            reactions={reactions}
            onToggleReaction={onToggleReaction}
            className="mt-2"
          />
        )}
      </div>
    </div>
  );
}