import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/providers/AuthProvider';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  timestamp: string;
  status: 'sending' | 'sent' | 'delivered' | 'read';
}

interface ChatUser {
  id: string;
  full_name: string;
  avatar: string;
  is_online: boolean;
}

interface PrivateChatProps {
  onBack: () => void;
  isMobile: boolean;
  chatId: string;
} 

const PrivateChat = ({ onBack, isMobile, chatId }: PrivateChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatUser, setChatUser] = useState<ChatUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const { accessToken, user } = useAuth();
  
  // WebSocket bağlantısını kur
  useEffect(() => {
    if (!accessToken) return;
    
    const wsUrl = `${process.env.NEXT_PUBLIC_WEBSOCKET_HOSTNAME}/ws/private_chat/${chatId.replace('private_', '')}/?token=${accessToken}`;
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      console.log(`WebSocket bağlantısı kuruldu: ${chatId}`);
      // Bağlantı kurulduğunda mesaj geçmişini iste
      ws.send(JSON.stringify({ type: 'get_history' }));
    };
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'history') {
        // Mesaj geçmişi geldiğinde
        setMessages(data.messages);
        setChatUser(data.user);
        setIsLoading(false);
      } 
      else if (data.type === 'message') {
        // Yeni mesaj geldiğinde
        setMessages(prev => [...prev, data.message]);
      } 
      else if (data.type === 'status_update') {
        // Mesaj durumu güncellendiğinde (okundu, iletildi vb.)
        setMessages(prev => 
          prev.map(msg => 
            msg.id === data.message_id ? { ...msg, status: data.status } : msg
          )
        );
      }
      else if (data.type === 'user_status') {
        // Kullanıcı durumu güncellendiğinde (çevrimiçi/çevrimdışı)
        setChatUser(prev => prev ? { ...prev, is_online: data.is_online } : null);
      }
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    ws.onclose = () => {
      console.log(`WebSocket bağlantısı kapandı: ${chatId}`);
    };
    
    wsRef.current = ws;
    
    // Temizleme fonksiyonu
    return () => {
      ws.close();
    };
  }, [chatId, accessToken]);
  
  // Mesajlar güncellendiğinde otomatik kaydır
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Mesaj gönderme
  const sendMessage = () => {
    if (!newMessage.trim() || !wsRef.current) return;
    
    // Geçici ID ile mesajı ekle (optimistik UI)
    const tempId = `temp-${Date.now()}`;
    const tempMessage: Message = {
      id: tempId,
      content: newMessage,
      sender_id: user?.id ? String(user.id) : '',
      timestamp: new Date().toISOString(),
      status: 'sending'
    };
    
    setMessages(prev => [...prev, tempMessage]);
    setNewMessage('');
    
    // WebSocket üzerinden mesajı gönder
    if (wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'send_message',
        content: newMessage,
        temp_id: tempId
      }));
    }
  };
  
  // Mesajları tarih gruplarına ayır
  const groupMessagesByDate = () => {
    const groups: { [date: string]: Message[] } = {};
    
    messages.forEach(message => {
      const date = new Date(message.timestamp).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    
    return Object.entries(groups);
  };
  
  // Mesaj durumu ikonu
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sending':
        return (
          <svg className="w-6 h-6 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        );
      case 'sent':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 13l4 4L19 7" stroke="#64717C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case 'delivered':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 13l4 4L19 7M5 13l4 4L19 7" stroke="#64717C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case 'read':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 12.9L7.143 16.5L15 7.5M20 7.563L11.428 16.563L11 16" stroke="#0EBA70" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      default:
        return null;
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col w-full h-full items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="mt-4 text-gray-500">Mesajlar yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full">
      <div className="border-b border-gray-100 flex items-center pt-4 md:pt-5 px-4 md:px-6 pb-4 md:pb-5 justify-between">
        <div className="flex items-center gap-[10px]">
          {isMobile && (
            <button 
              onClick={onBack}
              className="mr-2 p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 19L8 12L15 5"
                  stroke="#14171A"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
          <Image
            src={chatUser?.avatar || "/singlechatpic.png"}
            width={40}
            height={40}
            alt="chat avatar"
            className="rounded-full"
          />
          <div className="flex flex-col gap-[6px]">
            <p className="font-medium text-[14px] md:text-[16px]">{chatUser?.full_name || "Kullanıcı"}</p>
            {chatUser?.is_online && (
              <div className="flex items-center gap-[5px] h-[10px]">
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="5" cy="5" r="5" fill="#68D391" />
                </svg>
                <span className="font-medium text-[11px] md:text-[12px] text-t-gray">
                  Online
                </span>
              </div>
            )}
          </div>
        </div>
        <div>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z"
              stroke="#14171A"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6Z"
              stroke="#14171A"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z"
              stroke="#14171A"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="flex flex-col gap-[16px] md:gap-[20px]">
            {groupMessagesByDate().map(([date, dateMessages]) => (
              <React.Fragment key={date}>
                <div className="flex items-center justify-between">
                  <div className="w-[45%] h-px bg-[#F9F9F9]"></div>
                  <div className="w-[102px] h-[30px] bg-[#F9F9F9] pt-1 pr-4 pb-1 pl-4 rounded-[48px] text-[12px] flex items-center justify-center">
                    {date === new Date().toLocaleDateString() ? 'Bugün' : date}
                  </div>
                  <div className="w-[45%] h-px bg-[#F9F9F9]"></div>
                </div>
                
                {dateMessages.map((message) => {
                  const isOwnMessage = message.sender_id === (user?.id ? String(user.id) : '');
                  
                  return (
                    <div key={message.id} className={`flex items-start gap-[10px] ${isOwnMessage ? 'justify-end' : ''}`}>
                      {!isOwnMessage && (
                        <Image
                          src={chatUser?.avatar || "/singlechatpic.png"}
                          width={40}
                          height={40}
                          alt="chat avatar"
                          className="rounded-full"
                        />
                      )}
                      <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'} gap-[7px]`}>
                        <p className={`w-auto inline-block pt-2 pr-4 pb-2 pl-4 rounded-[12px] text-[14px] ${
                          isOwnMessage ? 'bg-[#444BD3] text-white' : 'bg-[#F9F9F9] text-[#14171A]'
                        }`}>
                          {message.content}
                        </p>
                        <div className={`flex items-center ${isOwnMessage ? 'justify-between w-full' : ''}`}>
                          <p className="text-[12px] text-t-gray">
                            {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </p>
                          {isOwnMessage && getStatusIcon(message.status)}
                        </div>
                      </div>
                      {isOwnMessage && (
                        <Image
                          src={"/singchatpic2.png"}
                          width={40}
                          height={40}
                          alt="user avatar"
                          className="rounded-full"
                        />
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
        <div className="p-4 md:p-6 flex items-center gap-[8px] border-t border-gray-100">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.9707 12V15.5C11.9707 17.43 13.5407 19 15.4707 19C17.4007 19 18.9707 17.43 18.9707 15.5V10C18.9707 6.13 15.8407 3 11.9707 3C8.1007 3 4.9707 6.13 4.9707 10V16C4.9707 19.31 7.6607 22 10.9707 22"
              stroke="#14171A"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="pt-2 pr-5 pb-2 pl-5 border-2 border-gray-200 rounded-[12px] w-full flex items-center">
            <input
              type="text"
              placeholder="Mesaj yazın..."
              className="w-full outline-hidden text-sm md:text-base"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button onClick={sendMessage} disabled={!newMessage.trim()}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`${!newMessage.trim() ? 'opacity-50' : ''}`}
              >
                <path
                  d="M16.1391 2.96004L7.10914 5.96004C1.03914 7.99004 1.03914 11.3 7.10914 13.32L9.78914 14.21L10.6791 16.89C12.6991 22.96 16.0191 22.96 18.0391 16.89L21.0491 7.87004C22.3891 3.82004 20.1891 1.61004 16.1391 2.96004ZM16.4591 8.34004L12.6591 12.16C12.5091 12.31 12.3191 12.38 12.1291 12.38C11.9391 12.38 11.7491 12.31 11.5991 12.16C11.4597 12.0189 11.3814 11.8285 11.3814 11.63C11.3814 11.4316 11.4597 11.2412 11.5991 11.1L15.3991 7.28004C15.6891 6.99004 16.1691 6.99004 16.4591 7.28004C16.7491 7.57004 16.7491 8.05004 16.4591 8.34004Z"
                  fill="#444BD3"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivateChat;