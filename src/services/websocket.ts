import { EventEmitter } from 'events';

class WebSocketService {
  private socket: WebSocket | null = null;
  private eventEmitter = new EventEmitter();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;

  constructor() {
    this.connect();
  }

  private connect() {
    try {
      const wsUrl = process.env.REACT_APP_WS_URL || 'ws://localhost:8080';
      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.eventEmitter.emit(data.type, data.payload);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.socket.onclose = () => {
        console.log('WebSocket disconnected');
        this.handleReconnect();
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
      this.handleReconnect();
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      setTimeout(() => this.connect(), this.reconnectDelay);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  public subscribe(event: string, callback: (data: any) => void) {
    this.eventEmitter.on(event, callback);
    return () => this.eventEmitter.off(event, callback);
  }

  public send(type: string, payload: any) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type, payload }));
    } else {
      console.error('WebSocket is not connected');
    }
  }

  public disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}

export const wsService = new WebSocketService(); 