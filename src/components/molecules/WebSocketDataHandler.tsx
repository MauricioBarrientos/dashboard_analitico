import React, { useEffect, useState, useCallback } from 'react';
import { WebSocketService } from '../../services/websocketService';
import { AppError, WebSocketError } from '../../services/errorHandler';
import NetworkStatus from '../atoms/NetworkStatus';

interface WebSocketDataHandlerProps {
  onDataUpdate: (data: any) => void;
  onError?: (error: AppError) => void;
}

const WebSocketDataHandler: React.FC<WebSocketDataHandlerProps> = ({ 
  onDataUpdate, 
  onError 
}) => {
  const [isOnline, setIsOnline] = useState(true);
  const [connectionError, setConnectionError] = useState<AppError | null>(null);
  const [wsService, setWsService] = useState<WebSocketService | null>(null);

  const handleWebSocketError = useCallback((error: WebSocketError) => {
    setConnectionError(error);
    setIsOnline(false);
    
    if (onError) {
      onError(error);
    }
    
    console.error('WebSocket error:', error);
  }, [onError]);

  const handleWebSocketOpen = useCallback((event: Event) => {
    setConnectionError(null);
    setIsOnline(true);
    console.log('WebSocket connection opened:', event);
  }, []);

  const handleWebSocketClose = useCallback((event: CloseEvent) => {
    if (event.code !== 1000) { // 1000 = normal closure
      setIsOnline(false);
      console.log('WebSocket connection closed unexpectedly:', event);
    }
  }, []);

  const handleWebSocketMessage = useCallback((data: any) => {
    try {
      onDataUpdate(data);
    } catch (updateError) {
      const error = new AppError('Error al procesar mensaje recibido', 'MSG_PROCESS_ERROR', updateError as Error);
      handleWebSocketError(error);
    }
  }, [onDataUpdate, handleWebSocketError]);

  useEffect(() => {
    // Configurar el WebSocket service
    const service = new WebSocketService({
      url: process.env.VITE_WS_URL || 'ws://localhost:8080',
      onMessage: handleWebSocketMessage,
      onError: handleWebSocketError,
      onOpen: handleWebSocketOpen,
      onClose: handleWebSocketClose,
    });

    setWsService(service);
    
    // Conectar al WebSocket
    service.connect();

    // Cleanup
    return () => {
      service.disconnect();
    };
  }, [handleWebSocketMessage, handleWebSocketError, handleWebSocketOpen, handleWebSocketClose]);

  const sendMessage = (data: any) => {
    if (wsService && wsService.isConnected()) {
      try {
        wsService.send(data);
      } catch (error) {
        const sendError = new AppError('Error al enviar mensaje', 'MSG_SEND_ERROR', error as Error);
        handleWebSocketError(sendError);
      }
    } else {
      const error = new AppError('No se puede enviar mensaje: WebSocket no está conectado', 'WS_NOT_CONNECTED');
      handleWebSocketError(error);
    }
  };

  return (
    <div className="absolute top-0 right-0">
      <NetworkStatus 
        isOnline={isOnline} 
        hasError={!!connectionError} 
        errorMessage={connectionError?.message} 
      />
    </div>
  );
};

export default WebSocketDataHandler;