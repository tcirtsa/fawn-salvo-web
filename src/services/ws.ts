import { api } from '@/utils/api';

type MessageHandler = (message: any) => void;

export class WebSocketService {
    private ws: WebSocket | null = null;
    private messageHandlers: Set<MessageHandler> = new Set();
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private reconnectTimeout = 1000;
    private heartbeatInterval: NodeJS.Timeout | null = null;

    constructor() {
        this.connect();
    }

    private startHeartbeat() {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
        }
        this.heartbeatInterval = setInterval(() => {
            this.send({ type: 'ping' });
        }, 30000);
    }

    private stopHeartbeat() {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }
    }

    private async connect() {
        try {
            const response = await api.get('/ws/token');
            const wsUrl = `ws://${window.location.hostname}:${window.location.port}/ws?token=${response.data.token}`;

            this.ws = new WebSocket(wsUrl);

            this.ws.onopen = () => {
                console.log('WebSocket connected');
                this.reconnectAttempts = 0;
                this.startHeartbeat();
            };

            this.ws.onmessage = (event) => {
                const message = JSON.parse(event.data);
                this.messageHandlers.forEach(handler => handler(message));
            };

            this.ws.onclose = () => {
                console.log('WebSocket disconnected');
                this.stopHeartbeat();
                this.reconnect();
            };

            this.ws.onerror = (error) => {
                console.error('WebSocket error:', error);
            };
        } catch (error) {
            console.error('Failed to connect WebSocket:', error);
            this.reconnect();
        }
    }

    private reconnect() {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.error('Max reconnection attempts reached');
            return;
        }

        this.reconnectAttempts++;
        setTimeout(() => {
            this.connect();
        }, this.reconnectTimeout * this.reconnectAttempts);
    }

    public subscribe(handler: MessageHandler) {
        this.messageHandlers.add(handler);
        return () => this.messageHandlers.delete(handler);
    }

    public send(message: any) {
        if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(message));
        } else {
            console.error('WebSocket is not connected');
        }
    }

    public close() {
        this.stopHeartbeat();
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }
}

export const wsService = new WebSocketService();