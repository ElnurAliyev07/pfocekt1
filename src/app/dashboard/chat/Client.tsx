'use client'
import React from 'react'
import ChatList from './components/ChatList';
import { useRouter } from 'next/navigation';

const Client = () => {
  const router = useRouter();
  const [isMobile, setIsMobile] = React.useState(false);

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
        
      <ChatList onChatSelect={handleChatSelect} selectedChat={null} />

      
      {/* Show placeholder when no chat is selected on desktop */}
      {!isMobile && (
        <div className="flex-1 h-full flex items-center justify-center text-gray-500">
          Söhbət başlatmaq üçün bir istifadəçi seçin
        </div>
      )}
    </div>
  )
}

export default Client