import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface UserPresenceIndicatorProps {
  status: 'online' | 'away' | 'busy' | 'offline';
  className?: string;
  showText?: boolean;
}

export function UserPresenceIndicator({ 
  status, 
  className, 
  showText = false 
}: UserPresenceIndicatorProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      case 'busy':
        return 'bg-red-500';
      case 'offline':
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'online':
        return 'Online';
      case 'away':
        return 'Away';
      case 'busy':
        return 'Busy';
      case 'offline':
      default:
        return 'Offline';
    }
  };

  if (showText) {
    return (
      <Badge variant="outline" className={cn("gap-1", className)}>
        <div className={cn("w-2 h-2 rounded-full", getStatusColor())} />
        {getStatusText()}
      </Badge>
    );
  }

  return (
    <div 
      className={cn(
        "w-3 h-3 rounded-full border-2 border-background",
        getStatusColor(),
        className
      )}
      title={getStatusText()}
    />
  );
}