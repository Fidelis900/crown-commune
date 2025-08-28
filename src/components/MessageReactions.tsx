import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, Smile } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReactionSummary {
  emoji: string;
  count: number;
  users: string[];
  hasUserReacted: boolean;
}

interface MessageReactionsProps {
  messageId: string;
  reactions: ReactionSummary[];
  onToggleReaction: (messageId: string, emoji: string) => void;
  className?: string;
}

const QUICK_EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '😡', '🎉', '👏'];

export function MessageReactions({ 
  messageId, 
  reactions, 
  onToggleReaction, 
  className 
}: MessageReactionsProps) {
  if (reactions.length === 0) {
    return (
      <div className={cn("flex items-center gap-1", className)}>
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              <Smile className="w-3 h-3 mr-1" />
              React
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2" side="top">
            <div className="flex gap-1">
              {QUICK_EMOJIS.map((emoji) => (
                <Button
                  key={emoji}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-base hover:bg-accent"
                  onClick={() => onToggleReaction(messageId, emoji)}
                >
                  {emoji}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-1 flex-wrap", className)}>
      {reactions.map((reaction) => (
        <Badge
          key={reaction.emoji}
          variant={reaction.hasUserReacted ? "default" : "secondary"}
          className={cn(
            "h-6 px-2 cursor-pointer hover:bg-accent transition-colors",
            reaction.hasUserReacted && "bg-primary/20 hover:bg-primary/30"
          )}
          onClick={() => onToggleReaction(messageId, reaction.emoji)}
        >
          <span className="mr-1">{reaction.emoji}</span>
          <span className="text-xs">{reaction.count}</span>
        </Badge>
      ))}
      
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
          >
            <Plus className="w-3 h-3" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2" side="top">
          <div className="flex gap-1">
            {QUICK_EMOJIS.map((emoji) => (
              <Button
                key={emoji}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-base hover:bg-accent"
                onClick={() => onToggleReaction(messageId, emoji)}
              >
                {emoji}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}