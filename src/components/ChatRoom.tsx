import { useState, useRef, useEffect } from "react";
import { ChatChannel, Message, User } from "@/types";
import { ChatMessage } from "./ChatMessage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Send, Crown, Users, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatRoomProps {
  channel: ChatChannel;
  currentUser: User;
  messages: Message[];
  onSendMessage: (content: string, isDecree?: boolean) => void;
}

export function ChatRoom({ channel, currentUser, messages, onSendMessage }: ChatRoomProps) {
  const [messageContent, setMessageContent] = useState("");
  const [isDecreeMode, setIsDecreeMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const canSendDecree = currentUser.isVip && currentUser.decreeCount < currentUser.maxDecrees;
  const isVipChannel = channel.type === 'vip' || channel.type === 'exclusive';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!messageContent.trim()) return;
    
    onSendMessage(messageContent, isDecreeMode);
    setMessageContent("");
    setIsDecreeMode(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Channel Header */}
      <div className={cn(
        "p-4 border-b border-border bg-card",
        isVipChannel && "vip-exclusive"
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isVipChannel ? (
              <Crown className="w-5 h-5 text-primary" />
            ) : (
              <Shield className="w-5 h-5 text-muted-foreground" />
            )}
            <div>
              <h2 className="font-display font-bold text-lg">{channel.name}</h2>
              <p className="text-sm text-muted-foreground">{channel.description}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {isVipChannel && (
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/50">
                VIP Exclusive
              </Badge>
            )}
            <Badge variant="secondary" className="gap-1">
              <Users className="w-3 h-3" />
              {channel.memberCount}
            </Badge>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-border bg-card">
        {isDecreeMode && (
          <div className="mb-3 p-3 rounded-lg vip-exclusive border border-primary/50">
            <div className="flex items-center gap-2 text-primary font-display font-semibold text-sm">
              <Crown className="w-4 h-4" />
              Royal Decree Mode Active
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              This message will be pinned and highlighted. Uses: {currentUser.decreeCount + 1}/{currentUser.maxDecrees}
            </p>
          </div>
        )}

        <div className="flex gap-2">
          <div className="flex-1">
            {isDecreeMode ? (
              <Textarea
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Issue your royal decree..."
                className="min-h-[80px] font-display"
              />
            ) : (
              <Input
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={`Send a message to ${channel.name}...`}
                className="flex-1"
              />
            )}
          </div>
          
          <div className="flex gap-2">
            {canSendDecree && (
              <Button
                variant={isDecreeMode ? "decree" : "outline"}
                size="icon"
                onClick={() => setIsDecreeMode(!isDecreeMode)}
                title="Royal Decree"
              >
                <Crown className="w-4 h-4" />
              </Button>
            )}
            
            <Button
              onClick={handleSendMessage}
              disabled={!messageContent.trim()}
              variant={isDecreeMode ? "decree" : "default"}
              size="icon"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {canSendDecree && (
          <div className="mt-2 text-xs text-muted-foreground">
            Royal Decrees remaining: {currentUser.maxDecrees - currentUser.decreeCount}
          </div>
        )}
      </div>
    </div>
  );
}