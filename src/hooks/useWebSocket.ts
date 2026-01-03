// hooks/useWebSocket.ts
import { useEffect, useRef } from "react";
import { WebSocketManager, MessageHandler } from "@/utils/websocketManager";
import { useAuth } from "@/providers/AuthProvider";

const WEBSOCKET_HOSTNAME = process.env.NEXT_PUBLIC_WEBSOCKET_HOSTNAME;

export const useWebSocket = (
  url: string,
  onMessage: MessageHandler,
  onClose?: () => void
) => {
  const managerRef = useRef<WebSocketManager | null>(null);
  const {accessToken} = useAuth();
  useEffect(() => {
    if (!accessToken) return;
    const manager = new WebSocketManager(`${WEBSOCKET_HOSTNAME}${url}`+`?token=${accessToken}`, onMessage, onClose);
    manager.connect();
    managerRef.current = manager;

    return () => {
      manager.disconnect();
    };
  }, [url, accessToken]);

  const send = (message: object) => {
    managerRef.current?.sendMessage(message);
  };

  return {
    send,
    socket: managerRef.current?.instance,
  };
};
