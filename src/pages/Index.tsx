import { Sidebar } from "@/components/Sidebar";
import { ChatRoom } from "@/components/ChatRoom";
import { useKingdomChat } from "@/hooks/useKingdomChat";
import throneRoomBg from "@/assets/throne-room-bg.png";

const Index = () => {
  const {
    currentUser,
    activeChannel,
    channels,
    messages,
    sendMessage,
    selectChannel,
    logout
  } = useKingdomChat();

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
        channels={channels}
        activeChannelId={activeChannel.id}
        onChannelSelect={selectChannel}
        onLogout={logout}
      />
      
      <div className="flex-1 flex flex-col">
        <ChatRoom
          channel={activeChannel}
          currentUser={currentUser}
          messages={messages}
          onSendMessage={sendMessage}
        />
      </div>
    </div>
  );
};

export default Index;
