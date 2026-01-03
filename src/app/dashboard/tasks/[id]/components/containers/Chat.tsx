'use client'

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Menu from "@/components/ui/icons/Menu";
import { getTaskMessageService } from "@/services/client/chat.service";
import { useAuth } from "@/providers/AuthProvider";
import { TaskMessage } from "@/types/chat.type";
import Send from "@/components/ui/icons/Send";
import IncomingMessage from "../common/chat/IncomingMessage";
import SendedMessage from "../common/chat/SendedMessage";
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { BsEmojiGrin } from "react-icons/bs";
import { Task } from "@/types/task.type";
import { useWebSocket } from "@/hooks/useWebSocket";
import useTaskItemStore from "@/store/taskItemStore";



const Chat: React.FC = () => {
    const { task } = useTaskItemStore();
    
    const [messages, setMessages] = useState<TaskMessage[]>([]);
    const [newMessage, setNewMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const { user } = useAuth();
    
    // Chat container ref'i eklendi
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const [showPicker, setShowPicker] = useState<boolean>(false);
    const pickerRef = useRef<HTMLDivElement | null>(null);


    const handleEmojiClick = (emojiData: EmojiClickData) => {
        setNewMessage((prev) => prev + emojiData.emoji);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
                setShowPicker(false);
            }
        };

        if (showPicker) {
            document.addEventListener("click", handleClickOutside);
        }
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [showPicker]);

    useEffect(() => {
        const fetchTaskMessages = async () => {
            if (!task) return;
            setLoading(true);
            try {
                const response = await getTaskMessageService(String(task?.id));
                setMessages(response.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchTaskMessages();
    }, [task]);

    const { send } = useWebSocket(
        `/ws/task_chat/${task?.id}/`,
        (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.message && data.user) {
              setMessages((prev) => [...prev, data]);
            }
          } catch (error) {
            console.error("Mesaj ayrıştırılamadı:", error);
          }
        },
        () => {
          console.warn("WebSocket bağlantısı kapatıldı.");
        }
      );

    // Scroll davranışı değiştirildi
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessage = () => {
        if (send && newMessage.trim()) {
            send({ message: newMessage });
            setNewMessage('');
        }
    };

    const groupMessagesByDate = (messages: TaskMessage[]) => {
        return messages.reduce((acc: { [key: string]: TaskMessage[] }, message) => {
            const date = new Date(message.created_at).toLocaleDateString();
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(message);
            return acc;
        }, {});
    };

    const groupedMessages = groupMessagesByDate(messages);

    return (
        <div className="mt-[26px] bg-white rounded-[12px] py-[20px]">
            <div className="flex justify-between items-center pb-[20px] px-[24px] border-b border-[#F9F9F9]">
                <div className="flex items-center gap-[12px]">
                    <Image
                        src="/grid.png"
                        width={100}
                        height={100}
                        alt="user"
                        className="w-[40px] h-[40px] rounded-full object-cover object-center"
                    />
                    <div>
                        <h2 className="font-medium text-t-black leading-[24px]">{task?.project.workspace.title}</h2>
                        <div className="flex items-center gap-[8px]">
                            <div className="w-[12px] h-[12px] bg-green-500 rounded-full"></div>
                            <span className="text-[12px] font-medium leading-[16px] text-t-black">Online</span>
                        </div>
                    </div>
                </div>
                <button><Menu /></button>
            </div>

            <div>
                {/* Chat container ref eklendi ve scroll davranışı container'a özgü hale getirildi */}
                <div 
                    ref={chatContainerRef}
                    className="max-h-[400px] px-[24px] pt-[24px] overflow-y-auto custom-scrollbar"
                >
                    {loading ? (
                        <div className="animate-pulse">
                            <div className="h-6 bg-gray-200 rounded-sm mb-4"></div>
                            <div className="h-6 bg-gray-200 rounded-sm mb-4"></div>
                            <div className="h-6 bg-gray-200 rounded-sm mb-4"></div>
                            <div className="h-6 bg-gray-200 rounded-sm mb-4"></div>
                            <div className="h-6 bg-gray-200 rounded-sm mb-4"></div>
                        </div>
                    ) : (
                        <div>
                            {Object.entries(groupedMessages).map(([date, messages]) => (
                                <div key={date}>
                                    <div className="text-center text-gray-500 py-2">{date}</div>
                                    {messages.map((message, index) => {
                                        const isSameUserAsPrevious =
                                            index > 0 && messages[index - 1].user.id === message.user.id;

                                        return message.user.id === user?.id ? (
                                            <div
                                                className={`${index === 0
                                                    ? 'mt-0'
                                                    : isSameUserAsPrevious
                                                        ? 'mt-[10px]'
                                                        : 'mt-[32px]'
                                                    }`}
                                                key={index}
                                            >
                                                <SendedMessage message={message} showUserInfo={!isSameUserAsPrevious} />
                                            </div>
                                        ) : (
                                            <div
                                                className={`${index === 0
                                                    ? 'mt-0'
                                                    : isSameUserAsPrevious
                                                        ? 'mt-[10px]'
                                                        : 'mt-[32px]'
                                                    }`}
                                                key={index}
                                            >
                                                <IncomingMessage message={message} showUserInfo={!isSameUserAsPrevious} />
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Bu ref artık kullanılmıyor ama kaldırmadım, isterseniz kaldırabilirsiniz */}
                    <div className="invisible" ref={messagesEndRef}></div>
                </div>

                <div className="mt-[12px] px-[24px] flex gap-[12px] items-center">
                    <div className="relative">
                        <button
                            onClick={() => setShowPicker((prev) => !prev)}
                            className="">
                            <BsEmojiGrin size={24}/>
                        </button>
                        {showPicker && (
                            <div
                                ref={pickerRef}
                                className="absolute bottom-[60px] left-0 bg-white shadow-lg rounded-md z-10 custom-scrollbar"
                                style={{
                                    maxHeight: "300px",
                                    overflow: "auto",
                                }}
                            >
                                <EmojiPicker onEmojiClick={handleEmojiClick} />
                            </div>
                        )}
                    </div>
                    <div className="flex items-center px-[20px] rounded-[12px] w-full h-[48px] border-2 border-border-gray">
                        <input
                            className="flex-1 p-0 m-0 border-none outline-hidden focus:ring-0 text-sm"
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    sendMessage();
                                }
                            }}
                            placeholder="Mesaj yaz..."
                        />
                        <button onClick={sendMessage}><Send /></button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;