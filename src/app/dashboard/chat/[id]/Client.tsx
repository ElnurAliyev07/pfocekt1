'use client'
import React from 'react'
import ChatDetail from '../components/ChatDetail'
import ChatList from '../components/ChatList';
import { useRouter, useParams } from 'next/navigation';


const Client = () => {
  const [isMobile, setIsMobile] = React.useState(false);
  const router = useRouter();
  const params = useParams();

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleChatSelect = (userId: string) => {
    router.push(`/dashboard/chat/${userId}`);
  };

  return (
    <div className="flex w-full h-[calc(100vh-150px)] bg-white">
      {/* Show Generalchat on mobile only if no chat is selected */}
      {!isMobile && (
        <ChatList onChatSelect={handleChatSelect} selectedChat={params.id as string} />
      )}

      {/* Show ChatDetail when a chat is selected */}
        <div className="flex-1 h-full">
          <ChatDetail 
            onBack={() => {
                router.push('/dashboard/chat');
            }}
            chatId={params.id as string}
            isMobile={isMobile}
          />
        </div>
      
      
      
    </div>
  )
}

export default Client