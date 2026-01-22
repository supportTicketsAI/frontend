import { useEffect, useRef, useState } from 'react';
import { API_CONFIG } from '../types';

export interface WebSocketMessage {
    type: 'ticket_update' | 'ticket_created' | 'system_status';
    payload: any;
}

export function useWebSocket() {
    const [isConnected, setIsConnected] = useState(false);
    const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const connect = () => {
        try {
            const wsUrl = `ws://localhost:8000${API_CONFIG.ENDPOINTS.WEBSOCKET}`;
            wsRef.current = new WebSocket(wsUrl);

            wsRef.current.onopen = () => {
                console.log('✅ WebSocket conectado');
                setIsConnected(true);
            };

            wsRef.current.onmessage = (event) => {
                try {
                    const message: WebSocketMessage = JSON.parse(event.data);
                    setLastMessage(message);
                    console.log('📨 WebSocket mensaje:', message);
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error);
                }
            };

            wsRef.current.onclose = () => {
                console.log('❌ WebSocket desconectado');
                setIsConnected(false);
                
                // Reconectar después de 3 segundos
                reconnectTimeoutRef.current = setTimeout(() => {
                    console.log('🔄 Intentando reconectar WebSocket...');
                    connect();
                }, 3000);
            };

            wsRef.current.onerror = (error) => {
                console.error('WebSocket error:', error);
                setIsConnected(false);
            };
        } catch (error) {
            console.error('Error creating WebSocket connection:', error);
        }
    };

    const disconnect = () => {
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
        }
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }
    };

    const sendMessage = (message: any) => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(message));
        } else {
            console.warn('WebSocket no está conectado');
        }
    };

    useEffect(() => {
        connect();

        return () => {
            disconnect();
        };
    }, []);

    return {
        isConnected,
        lastMessage,
        sendMessage,
        connect,
        disconnect
    };
}