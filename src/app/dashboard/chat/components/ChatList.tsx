import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "@/providers/AuthProvider";

interface Participant {
  id: number;
  username: string;
  full_name: string;
  is_online: boolean;
}

interface GroupParticipants {
  total_count: number;
  online_count: number;
  online_members: number[];
}

interface Message {
  content: string;
  timestamp: string;
  type: 'sending' | 'sent' | 'delivered' | 'read' | string;
  sender: string;
}

interface Chat {
  id: string;
  type: 'private' | 'group';
  title: string;
  last_message?: Message;
  unread_count: number;
  participants: Participant | GroupParticipants;
  avatar: string | null;
}

type PrivateChat = Chat & {
  type: 'private';
  participants: Participant;
}

type GroupChat = Chat & {
  type: 'group';
  participants: GroupParticipants;
}

const isPrivateChat = (chat: Chat): chat is PrivateChat => {
  return chat.type === 'private' && 'full_name' in chat.participants;
};

const isGroupChat = (chat: Chat): chat is GroupChat => {
  return chat.type === 'group' && 'total_count' in chat.participants;
};

interface Category {
  key: 'all' | 'private' | 'group';
  value: string;
}

interface ChatListProps {
  onChatSelect: (chatId: string) => void;
  selectedChat?: string | null;
}

interface ChatItemProps {
  chat: Chat;
  selectedChat?: string | null;
  onChatSelect: (chatId: string) => void;
}

interface WebSocketMessage {
  type: string;
  chat_list?: Chat[];
  error?: string;
}

type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

const ConnectionStatusIndicator: React.FC<{ status: ConnectionStatus }> = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'connected':
        return 'bg-green-500';
      case 'connecting':
        return 'bg-yellow-500';
      case 'disconnected':
      case 'error':
        return 'bg-red-500';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'connected':
        return 'Connected';
      case 'connecting':
        return 'Connecting...';
      case 'disconnected':
        return 'Disconnected';
      case 'error':
        return 'Connection Error';
    }
  };

  return (
    <div className="flex items-center gap-2 px-2 py-1 text-xs">
      <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
      <span className="text-gray-600">{getStatusText()}</span>
    </div>
  );
};

const ChatList = ({ onChatSelect, selectedChat }: ChatListProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category>({
    key: 'all',
    value: "Bütün mesajlar"
  });
  const [chats, setChats] = useState<Chat[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting');
  const { accessToken } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const handleConnectionError = (message: string) => {
    setError(message);
    setIsLoading(false);
    setConnectionStatus('error');
  };

  const connectWebSocket = () => {
    if (!accessToken) {
      handleConnectionError('Authentication token not found. Please log in again.');
      return;
    }

    const wsUrl = `${process.env.NEXT_PUBLIC_WEBSOCKET_HOSTNAME}/ws/chat_list${
      selectedCategory.key !== 'all' ? '/' + selectedCategory.key : ''
    }/?token=${accessToken}`;

    try {
      const ws = new WebSocket(wsUrl);
      let connectionTimeout = setTimeout(() => {
        if (ws?.readyState !== WebSocket.OPEN) {
          ws?.close();
          handleConnectionError('Connection timeout. Please check your internet connection.');
        }
      }, 10000); // 10 second timeout

      ws.onopen = () => {
        clearTimeout(connectionTimeout);
        console.log('WebSocket connected');
        setError(null);
        setIsLoading(true);
        setConnectionStatus('connected');
        ws?.send(JSON.stringify({ type: 'refresh' }));
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as WebSocketMessage;
          
          if (data.type === 'chat_list_update' && data.chat_list) {
            setChats(data.chat_list);
            setIsLoading(false);
          } else if (data.error) {
            handleConnectionError(`Server error: ${data.error}`);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
          handleConnectionError('Error processing server response. Please try again.');
        }
      };

      ws.onerror = () => {
        handleConnectionError('Connection error occurred. Please try again.');
      };

      ws.onclose = () => {
        setConnectionStatus('disconnected');
      };

      setSocket(ws);
    } catch (error) {
      handleConnectionError('Failed to establish connection. Please try again.');
    }
  };

  useEffect(() => {
    let reconnectTimeout: NodeJS.Timeout;
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 5;
    const baseReconnectDelay = 1000; // Start with 1 second

    const getReconnectDelay = () => {
      // Exponential backoff: 1s, 2s, 4s, 8s, 16s
      return Math.min(baseReconnectDelay * Math.pow(2, reconnectAttempts), 16000);
    };

    const handleReconnection = () => {
      if (reconnectAttempts >= maxReconnectAttempts) {
        handleConnectionError('Connection attempts exhausted. Please check your internet connection and try again.');
        return false;
      }
      const delay = getReconnectDelay();
      console.log(`Attempting to reconnect in ${delay}ms (attempt ${reconnectAttempts + 1}/${maxReconnectAttempts})`);
      setConnectionStatus('connecting');
      reconnectTimeout = setTimeout(() => {
        reconnectAttempts++;
        connectWebSocket();
      }, delay);
      return true;
    };

    connectWebSocket();

    return () => {
      clearTimeout(reconnectTimeout);
      socket?.close();
    };
  }, [selectedCategory, accessToken]);

  // Mesajları kategoriye ve aramaya göre filtrele
  const filteredChats = chats.filter(chat => {
    const matchesCategory = selectedCategory.key === 'all' || chat.type === selectedCategory.key;
    
    const searchTerm = searchQuery.toLowerCase();
    const matchesSearch = searchTerm === '' || 
      chat.title.toLowerCase().includes(searchTerm) || 
      (chat.last_message?.content.toLowerCase().includes(searchTerm)) ||
      (isPrivateChat(chat) && chat.participants.full_name.toLowerCase().includes(searchTerm));
    
    return matchesCategory && matchesSearch;
  });

  const categories: Category[] = [
    {
      key: 'all',
      value: "Bütün mesajlar"
    },
    { 
      key: 'private',
      value: "Özel Mesajlar"
    },
    { 
      key: 'group',
      value: "Grup Mesajları"
    }
  ];

  const ChatItem: React.FC<ChatItemProps> = ({ chat, selectedChat, onChatSelect }) => {
    const getChatTitle = () => {
      if (isPrivateChat(chat)) {
        return chat.participants.full_name;
      }
      return chat.title;
    };

    const getLastMessageText = () => {

      if (!chat.last_message || !chat.last_message.content) return '';
      
      const senderName = isGroupChat(chat) && chat.last_message ? `~${chat.last_message.sender}: ` : '';
      return `${senderName}${chat.last_message.content.length > 20 ? chat.last_message.content.slice(0, 20) + '...' : chat.last_message.content}`;
    };

    const getParticipantInfo = () => {
      if (isGroupChat(chat) && chat.participants.online_count > 0) {
        return `${chat.participants.online_count}/${chat.participants.total_count} online`;
      }
      if (isPrivateChat(chat)) {
        return chat.participants.is_online ? 'Online' : '';
      }
      return '';
    };

    const getMessageStatus = () => {
      if (!chat.last_message) return null;
      switch (chat.last_message.type) {
        case 'sending':
          return (
            <svg className="w-3 h-3 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          );
        case 'sent':
          return (
            <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          );
        case 'delivered':
          return (
            <svg className="w-3 h-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7M5 13l4 4L19 7" />
            </svg>
          );
        case 'read':
          return (
            <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M5 13l4 4L19 7M5 13l4 4L19 7" />
            </svg>
          );
        default:
          return null;
      }
    };

    return (
      <div 
        className={`flex items-center gap-[6px] md:gap-[8px] p-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
          selectedChat === chat.id ? "bg-gray-200" : ""
        }`}
        onClick={() => onChatSelect(chat.id)}
      >
        <div className="profile-pic min-w-[40px] md:min-w-[48px]">
          <Image 
            src={chat.avatar || '/grid.png'}
            width={48} 
            height={48} 
            alt={`${getChatTitle()} avatar`}
            className="w-[40px] h-[40px] md:w-[48px] md:h-[48px] rounded-full" 
          />
        </div>
        <div className="infos flex flex-col gap-[4px] md:gap-[6px] w-full">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-medium text-[13px] md:text-[14px]">
                {getChatTitle()}
              </span>
              <span className="text-[11px] text-green-400">
                {getParticipantInfo()}
              </span>
            </div>
            <div className="flex items-center gap-1">
              {getMessageStatus()}
              <span className="font-medium text-[13px] md:text-[14px] text-gray-400">
                {chat.last_message && (() => {
                  const messageDate = new Date(chat.last_message.timestamp);
                  const today = new Date();
                  const yesterday = new Date(today);
                  yesterday.setDate(yesterday.getDate() - 1);

                  if (messageDate.toDateString() === today.toDateString()) {
                    return messageDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                  } else if (messageDate.toDateString() === yesterday.toDateString()) {
                    return 'Dünən';
                  } else {
                    return messageDate.toLocaleDateString();
                  }
                })()}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] md:text-[12px] text-t-gray truncate max-w-[70%]">
              {getLastMessageText()}
            </span>
            {chat.unread_count > 0 && (
              <div className="bg-[#444BD3] pt-0.5 pr-2 pb-0.5 pl-2 rounded-[24px] text-white font-medium text-[11px] md:text-[12px]">
                {chat.unread_count}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const ErrorDisplay = () => (
    <div className="w-full h-full md:w-[380px] md:min-w-[380px] border-r border-gray-100 flex flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center gap-4 max-w-sm">
        <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <div className="text-red-500 text-center font-medium">{error}</div>
        <button 
          onClick={() => {
            setError(null);
            setIsLoading(true);
            connectWebSocket();
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Retry Connection
        </button>
      </div>
    </div>
  );

  if (error) {
    return <ErrorDisplay />;
  }

  return (
    <div className="w-full h-full md:w-[380px] md:min-w-[380px] border-r border-gray-100 flex flex-col relative">
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex flex-col items-center justify-center gap-4 z-50">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
          <div className="text-sm text-gray-600">Loading chats...</div>
        </div>
      )}
      <div className="absolute top-0 right-0 z-50 animate-fade-in">
        <ConnectionStatusIndicator status={connectionStatus} />
      </div>
      <div className="border-b border-gray-100 pt-4 md:pt-5 px-4 md:px-6 pb-4 md:pb-5">
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between gap-2 md:gap-3"
          >
            <div className="flex items-center gap-1 md:gap-1.5">
              <span className="font-semibold text-[16px] md:text-[20px]">{selectedCategory.value}</span>
              <svg
                className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.2802 5.9668L8.93355 10.3135C8.42021 10.8268 7.58021 10.8268 7.06688 10.3135L2.72021 5.9668"
                  stroke="#14171A"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="inline-block w-auto h-auto bg-[#F9F9F9] pt-0.5 pr-2 pb-0.5 pl-2 rounded-[24px] font-semibold text-[12px]">
              {categories.find(cat => cat.value === selectedCategory.value)?.key === 'all' ? 
                chats.length : 
                chats.filter(chat => chat.type === categories.find(cat => cat.value === selectedCategory.value)?.key).length
              }
            </div>
          </button>

          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-50">
              {categories.map((category, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedCategory(category);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-3 hover:bg-gray-50 ${
                    selectedCategory.value === category.value ? 'bg-gray-50' : ''
                  }`}
                >
                  <span className="font-medium">{category.value}</span>
                  <div className="inline-block bg-[#F9F9F9] px-2 py-0.5 rounded-[24px] text-[12px]">
                    {category.key === 'all' ? 
                      chats.length : 
                      chats.filter(chat => chat.type === category.key).length
                    }
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="messages-sec flex-1 pt-4 md:pt-5 px-4 md:px-6 pb-4 md:pb-5 flex flex-col gap-[15px] md:gap-[20px] overflow-hidden">
        <div className="search-messages rounded-[8px] border border-gray-150 w-full">
          <div className="flex items-center pt-2 md:pt-2.5 px-4 md:px-6 pb-2 md:pb-2.5 gap-[8px]">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_3101_5096)">
                <path
                  d="M3 10C3 10.9193 3.18106 11.8295 3.53284 12.6788C3.88463 13.5281 4.40024 14.2997 5.05025 14.9497C5.70026 15.5998 6.47194 16.1154 7.32122 16.4672C8.1705 16.8189 9.08075 17 10 17C10.9193 17 11.8295 16.8189 12.6788 16.4672C13.5281 16.1154 14.2997 15.5998 14.9497 14.9497C15.5998 14.2997 16.1154 13.5281 16.4672 12.6788C16.8189 11.8295 17 10.9193 17 10C17 9.08075 16.8189 8.1705 16.4672 7.32122C16.1154 6.47194 15.5998 5.70026 14.9497 5.05025C14.2997 4.40024 13.5281 3.88463 12.6788 3.53284C11.8295 3.18106 10.9193 3 10 3C9.08075 3 8.1705 3.18106 7.32122 3.53284C6.47194 3.88463 5.70026 4.40024 5.05025 5.05025C4.40024 5.70026 3.88463 6.47194 3.53284 7.32122C3.18106 8.1705 3 9.08075 3 10Z"
                  stroke="#212121"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M21 21L15 15"
                  stroke="#212121"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_3101_5096">
                  <rect width="24" height="24" fill="white" />
                </clipPath>
              </defs>
            </svg>
            <input
              type="text"
              placeholder="Sizə maraqlı olanı axtarın"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="outline-hidden"
            />
          </div>
        </div>
        <div className="messages flex flex-col gap-[12px] md:gap-[16px] overflow-y-auto">
          {filteredChats.map((chat) => (
            <ChatItem 
              key={chat.id} 
              chat={chat}
              selectedChat={selectedChat}
              onChatSelect={onChatSelect}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatList;
