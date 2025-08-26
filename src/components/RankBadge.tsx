import { User, RANKS } from "@/types";
import { Crown, Shield, Sword, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RankBadgeProps {
  user: User;
  showXp?: boolean;
  className?: string;
}

const getRankIcon = (rankName: string) => {
  switch (rankName.toLowerCase()) {
    case 'king':
      return Crown;
    case 'prince':
    case 'duke':
    case 'marquis':
      return Star;
    case 'earl':
    case 'baron':
      return Shield;
    default:
      return Sword;
  }
};

export function RankBadge({ user, showXp = false, className }: RankBadgeProps) {
  const rank = RANKS[user.rank.name.toLowerCase()];
  const Icon = getRankIcon(user.rank.name);
  const progressPercent = ((user.xp - rank.minXp) / (rank.maxXp - rank.minXp)) * 100;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-display font-semibold text-xs",
        rank.isVip ? "vip-exclusive royal-glow" : "bg-muted",
        rank.isVip && "rank-glow"
      )}>
        <Icon className={cn("w-4 h-4", `text-${rank.color}`)} />
        <span className={cn(`text-${rank.color}`)}>{rank.name}</span>
        {rank.isVip && (
          <Crown className="w-3 h-3 text-primary ml-1" />
        )}
      </div>
      
      {showXp && (
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{user.xp} XP</span>
            <span>Next: {rank.maxXp === Infinity ? 'MAX' : rank.maxXp}</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full transition-all duration-500 rounded-full",
                rank.isVip ? "bg-primary" : "bg-secondary"
              )}
              style={{ width: `${Math.min(progressPercent, 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}