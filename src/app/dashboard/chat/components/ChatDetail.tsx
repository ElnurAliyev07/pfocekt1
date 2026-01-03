import React from "react";
import GroupChat from "./GroupChat";
import PrivateChat from "./PrivateChat";
interface ChatDetailProps {
  onBack: () => void;
  isMobile: boolean;      
  chatId: string;
}

const ChatDetail = ({ onBack, isMobile, chatId }: ChatDetailProps) => {
  if (chatId.includes('group')) {
    return <GroupChat onBack={onBack} isMobile={isMobile} />
  }else if (chatId.includes('private')) {
    return <PrivateChat onBack={onBack} isMobile={isMobile} chatId={chatId} />
  }

};

export default ChatDetail;
