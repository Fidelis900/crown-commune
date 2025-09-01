import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Settings, Volume2, Bell, Eye, Moon, Sun } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [settings, setSettings] = useState({
    soundEnabled: true,
    notifications: true,
    showOnlineStatus: true,
    darkMode: false,
    autoJoinChannels: true,
    showTypingIndicators: true,
  });
  
  const { toast } = useToast();

  const handleSettingChange = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = () => {
    // In a real app, this would save to backend/localStorage
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            Kingdom Settings
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Audio Settings */}
          <div className="space-y-3">
            <h3 className="font-medium flex items-center gap-2">
              <Volume2 className="w-4 h-4" />
              Audio
            </h3>
            <div className="flex items-center justify-between">
              <Label htmlFor="sound-enabled">Message sounds</Label>
              <Switch
                id="sound-enabled"
                checked={settings.soundEnabled}
                onCheckedChange={() => handleSettingChange('soundEnabled')}
              />
            </div>
          </div>

          <Separator />

          {/* Notification Settings */}
          <div className="space-y-3">
            <h3 className="font-medium flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </h3>
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications">Push notifications</Label>
              <Switch
                id="notifications"
                checked={settings.notifications}
                onCheckedChange={() => handleSettingChange('notifications')}
              />
            </div>
          </div>

          <Separator />

          {/* Privacy Settings */}
          <div className="space-y-3">
            <h3 className="font-medium flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Privacy
            </h3>
            <div className="flex items-center justify-between">
              <Label htmlFor="online-status">Show online status</Label>
              <Switch
                id="online-status"
                checked={settings.showOnlineStatus}
                onCheckedChange={() => handleSettingChange('showOnlineStatus')}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="typing-indicators">Show typing indicators</Label>
              <Switch
                id="typing-indicators"
                checked={settings.showTypingIndicators}
                onCheckedChange={() => handleSettingChange('showTypingIndicators')}
              />
            </div>
          </div>

          <Separator />

          {/* Appearance Settings */}
          <div className="space-y-3">
            <h3 className="font-medium flex items-center gap-2">
              {settings.darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              Appearance
            </h3>
            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode">Dark theme</Label>
              <Switch
                id="dark-mode"
                checked={settings.darkMode}
                onCheckedChange={() => handleSettingChange('darkMode')}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-join">Auto-join accessible channels</Label>
              <Switch
                id="auto-join"
                checked={settings.autoJoinChannels}
                onCheckedChange={() => handleSettingChange('autoJoinChannels')}
              />
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 justify-end mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}