import { Sidebar } from "@/components/Sidebar";
import { ChatRoom } from "@/components/ChatRoom";
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
      
      <div className="flex-1 flex flex-col">
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
      </div>
    </div>
  );
};

export default Index;
