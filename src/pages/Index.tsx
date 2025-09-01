import { Sidebar } from "@/components/Sidebar";
import { ChatRoom } from "@/components/ChatRoom";
import { HelpSupportCenter } from "@/components/HelpSupportCenter";
import { TradingPost } from "@/components/TradingPost";
import { QuestBoard } from "@/components/QuestBoard";
import { useAuth } from "@/hooks/useAuth";
import { useRealChat } from "@/hooks/useRealChat";
import { Navigate } from "react-router-dom";
import { profileToUser, channelToChatChannel, messageToComponentMessage } from "@/utils/dataAdapters";
import throneRoomBg from "@/assets/throne-room-bg.png";

const Index = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const {
    profile,
    channels,
    messages,
    activeChannel,
    loading,
    sendMessage,
    selectChannel,
    editMessage,
    deleteMessage,
    // Enhanced features
    presenceList,
    onlineUsers,
    setUserStatus,
    typingUsers,
    startTyping,
    stopTyping,
    reactions,
    toggleReaction
  } = useRealChat(user?.id);

  // Redirect to auth if not logged in
  if (!authLoading && !user) {
    return <Navigate to="/auth" replace />;
  }

  // Show loading state
  if (authLoading || loading || !profile || !activeChannel) {
    return (
      <div 
        className="min-h-screen bg-background flex items-center justify-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.8)), url(${throneRoomBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="text-primary text-xl">Loading the kingdom...</div>
      </div>
    );
  }

  // Convert database types to component types
  const currentUser = profileToUser(profile);
  const adaptedChannels = channels.map(channelToChatChannel);
  const adaptedActiveChannel = channelToChatChannel(activeChannel);
  const adaptedMessages = messages.map(messageToComponentMessage);

  // Get current channel and determine room type based on raw database type
  const currentChannel = adaptedChannels.find(c => c.id === activeChannel.id);
  const dbChannelType = activeChannel.type; // Use database type directly
  
  // Render appropriate component based on room type
  const renderMainContent = () => {
    // Check by channel name first for specific functionality
    if (currentChannel?.name === 'Help & Support') {
      return <HelpSupportCenter />;
    }
    if (currentChannel?.name === 'Trading Post') {
      return <TradingPost />;
    }
    if (currentChannel?.name === 'Quest Board') {
      return <QuestBoard />;
    }
    
    // Default to chat room for all other channels
    return (
      <ChatRoom
        channel={adaptedActiveChannel}
        currentUser={currentUser}
        messages={adaptedMessages}
        onSendMessage={sendMessage}
        typingUsers={typingUsers}
        onStartTyping={startTyping}
        onStopTyping={stopTyping}
        reactions={reactions}
        onlineUsers={onlineUsers}
        onEditMessage={editMessage}
        onDeleteMessage={deleteMessage}
        onToggleReaction={toggleReaction}
      />
    );
  };

  return (
    <div 
      className="min-h-screen bg-background flex"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.8)), url(${throneRoomBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <Sidebar
        currentUser={currentUser}
        channels={adaptedChannels}
        activeChannelId={activeChannel.id}
        onChannelSelect={selectChannel}
        onLogout={signOut}
      />
      
      {/* Main Content - Dynamic based on room type */}
      <div className="flex-1 flex flex-col">
        {renderMainContent()}
      </div>
    </div>
  );
};

export default Index;
