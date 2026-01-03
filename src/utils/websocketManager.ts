// utils/websocketManager.ts
export type MessageHandler = (event: MessageEvent) => void;

export class WebSocketManager {
  private socket: WebSocket | null = null;
  private url: string;
  private onMessage: MessageHandler;
  private onClose?: () => void;

  constructor(url: string, onMessage: MessageHandler, onClose?: () => void) {
    this.url = url;
    this.onMessage = onMessage;
    this.onClose = onClose;
  }

  connect() {
    this.socket = new WebSocket(this.url);

    this.socket.onopen = () => {
      // Bağlantı açıldığında yapılacak işlemler
    };

    this.socket.onmessage = this.onMessage;

    this.socket.onclose = () => {
      if (this.onClose) this.onClose();
    };
  }

  sendMessage(message: object) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    }
  }

  disconnect() {
    this.socket?.close();
  }

  get instance() {
    return this.socket;
  }
}
