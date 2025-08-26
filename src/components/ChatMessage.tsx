import { Message } from "@/types";
import { RankBadge } from "./RankBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Crown, Pin } from "lucide-react";
import { cn } from "@/lib/utils";
import coatOfArms from "@/assets/coat-of-arms.png";

interface ChatMessageProps {
  message: Message;
  className?: string;
}

export function ChatMessage({ message, className }: ChatMessageProps) {
  const isVip = message.author.isVip;
  const isDecree = message.isDecree;
  const isPinned = message.isPinned;

  return (
    <div className={cn(
      "flex gap-3 p-4 rounded-lg transition-all hover:bg-muted/50",
      isDecree && "vip-exclusive border border-primary/50 shadow-royal",
      isPinned && "bg-accent/20 border-l-4 border-primary",
      className
    )}>
      <Avatar className={cn("w-10 h-10", isVip && "ring-2 ring-primary/50")}>
        <AvatarImage src={message.author.avatar || coatOfArms} />
        <AvatarFallback className="font-display">
          {message.author.username.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>

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
          </span>
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
          <p className="mb-0">{message.content}</p>
        </div>
      </div>
    </div>
  );
}