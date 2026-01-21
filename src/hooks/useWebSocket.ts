import { useEffect, useState, useRef } from 'react';
import { DashboardData } from '../utils/validation';

interface WebSocketService {
  data: DashboardData | null;
  isConnected: boolean;
  error: string | null;
  send: (message: string) => void;
}

export const useWebSocket = (url: string): WebSocketService => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Verificar si la URL es válida antes de intentar conectarse
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch (urlError) {
      console.error('Invalid WebSocket URL:', url, urlError);
      setError('Invalid WebSocket URL');
      return;
    }

    const connect = () => {
      try {
        const ws = new WebSocket(url);

        ws.onopen = () => {
          console.log('WebSocket connected to:', url);
          setIsConnected(true);
          setError(null);
        };

        ws.onmessage = (event) => {
          try {
            const messageData = JSON.parse(event.data);
            setData(messageData);
          } catch (parseError) {
            console.error('Error parsing WebSocket message:', parseError);
            setError('Error parsing received data');
          }
        };

        ws.onclose = (event) => {
          console.log('WebSocket disconnected:', event.code, event.reason);
          setIsConnected(false);

          // Solo intentar reconexión si no fue un cierre intencional (código 1000)
          if (event.code !== 1000) {
            // Intento de reconexión automática con retroceso exponencial
            if (reconnectTimeoutRef.current) {
              clearTimeout(reconnectTimeoutRef.current);
            }
            const reconnectDelay = Math.min(30000, 1000 * Math.pow(2, reconnectTimeoutRef.current ? 2 : 1));
            reconnectTimeoutRef.current = setTimeout(() => {
              console.log(`Attempting to reconnect to ${url}...`);
              connect();
            }, reconnectDelay);
          }
        };

        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          setError(`WebSocket connection error: ${parsedUrl.hostname} may not be available`);
          setIsConnected(false);
        };

        socketRef.current = ws;
      } catch (error) {
        console.error('Error creating WebSocket connection:', error);
        setError('Error establishing WebSocket connection');
      }
    };

    // Conectar solo si la URL parece válida
    if (parsedUrl && parsedUrl.protocol === 'ws:' || parsedUrl.protocol === 'wss:') {
      connect();
    } else {
      setError('Invalid WebSocket protocol');
    }

    // Cleanup
    return () => {
      if (socketRef.current) {
        socketRef.current.close(1000); // Cierre normal
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [url]);

  const send = (message: string) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(message);
    } else {
      console.warn('WebSocket is not connected, cannot send message:', message);
    }
  };

  return { data, isConnected, error, send };
};