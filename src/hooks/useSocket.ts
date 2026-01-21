import { useEffect, useState, useRef } from 'react';

interface WebSocketMessage {
  type: string;
  data: any;
}

export const useSocket = (url: string) => {
  const [data, setData] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onopen = () => {
      console.log('Connected to WebSocket');
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        // Update data state based on the message type
        setData(prevData => ({
          ...prevData,
          [message.type]: message.data
        }));
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onclose = () => {
      console.log('Disconnected from WebSocket');
      setIsConnected(false);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };

    socketRef.current = ws;

    // Cleanup function
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [url]);

  return { data, isConnected };
};