import { useEffect, useState } from 'react';

interface WebSocketService {
  connect: (url: string) => void;
  disconnect: () => void;
  sendMessage: (message: string) => void;
  readyState: number;
  data: any;
}

const useWebSocket = (url: string): WebSocketService => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [readyState, setReadyState] = useState<number>(WebSocket.CONNECTING);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const ws = new WebSocket(url);
    
    ws.onopen = () => {
      setReadyState(WebSocket.OPEN);
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data);
        setData(parsedData);
      } catch (e) {
        console.error('Error parsing WebSocket data:', e);
      }
    };

    ws.onclose = () => {
      setReadyState(WebSocket.CLOSED);
      console.log('WebSocket disconnected');
    };

    ws.onerror = (error) => {
      setReadyState(WebSocket.CLOSED);
      console.error('WebSocket error:', error);
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [url]);

  const sendMessage = (message: string) => {
    if (socket && readyState === WebSocket.OPEN) {
      socket.send(message);
    }
  };

  const disconnect = () => {
    if (socket) {
      socket.close();
    }
  };

  const connect = (newUrl: string) => {
    if (socket) {
      socket.close();
    }
    
    const newSocket = new WebSocket(newUrl);
    setSocket(newSocket);
    setReadyState(WebSocket.CONNECTING);
  };

  return {
    connect,
    disconnect,
    sendMessage,
    readyState,
    data
  };
};

export default useWebSocket;