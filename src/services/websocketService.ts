// src/services/websocketService.ts

import { AppError, WebSocketError, reportError } from './errorHandler';

export interface WebSocketConfig {
  url: string;
  onMessage: (data: any) => void;
  onError?: (error: WebSocketError) => void;
  onOpen?: (event: Event) => void;
  onClose?: (event: CloseEvent) => void;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

export class WebSocketService {
  private ws: WebSocket | null = null;
  private config: WebSocketConfig;
  private reconnectAttempts = 0;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private isManuallyClosed = false;

  constructor(config: WebSocketConfig) {
    this.config = {
      reconnectInterval: 5000, // 5 segundos
      maxReconnectAttempts: 10, // 10 intentos máximos
      ...config
    };
  }

  public connect(): void {
    if (this.ws && (this.ws.readyState === WebSocket.CONNECTING || this.ws.readyState === WebSocket.OPEN)) {
      return;
    }

    try {
      this.ws = new WebSocket(this.config.url);
      
      this.ws.onopen = (event) => {
        this.reconnectAttempts = 0; // Reiniciar intentos al conectarse exitosamente
        if (this.config.onOpen) {
          this.config.onOpen(event);
        }
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data as string);
          this.config.onMessage(data);
        } catch (error) {
          const parseError = new AppError('Error al parsear mensaje WebSocket', 'WS_PARSE_ERROR', error as Error);
          reportError(parseError);
          if (this.config.onError) {
            this.config.onError(parseError);
          }
        }
      };

      this.ws.onerror = (event) => {
        const error = new WebSocketError('Error en WebSocket', event);
        reportError(error);
        if (this.config.onError) {
          this.config.onError(error);
        }
      };

      this.ws.onclose = (event) => {
        if (this.config.onClose) {
          this.config.onClose(event);
        }

        // Solo reconectar si no fue cerrado manualmente y no se alcanzó el máximo de intentos
        if (!this.isManuallyClosed && this.reconnectAttempts < this.config.maxReconnectAttempts!) {
          this.reconnectAttempts++;
          console.log(`Intentando reconectar... (intento ${this.reconnectAttempts}/${this.config.maxReconnectAttempts})`);
          
          if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
          }
          
          this.reconnectTimer = setTimeout(() => {
            this.connect();
          }, this.config.reconnectInterval);
        } else if (this.reconnectAttempts >= this.config.maxReconnectAttempts!) {
          const error = new WebSocketError(`Máximo de intentos de reconexión alcanzado (${this.config.maxReconnectAttempts})`);
          reportError(error);
          if (this.config.onError) {
            this.config.onError(error);
          }
        }
      };
    } catch (error) {
      const wsError = new WebSocketError('Error al crear WebSocket', error as Event);
      reportError(wsError);
      if (this.config.onError) {
        this.config.onError(wsError);
      }
    }
  }

  public send(data: any): void {
    if (!this.ws) {
      throw new AppError('WebSocket no está conectado', 'WS_NOT_CONNECTED');
    }

    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else if (this.ws.readyState === WebSocket.CONNECTING) {
      // Cola de mensajes pendientes o reintentar cuando se conecte
      const sendWhenReady = () => {
        if (this.ws?.readyState === WebSocket.OPEN) {
          this.ws.send(JSON.stringify(data));
        } else {
          setTimeout(sendWhenReady, 100);
        }
      };
      sendWhenReady();
    } else {
      throw new AppError('WebSocket no está en estado abierto', 'WS_NOT_OPEN');
    }
  }

  public disconnect(): void {
    this.isManuallyClosed = true;
    
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  public isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  public isConnecting(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.CONNECTING;
  }
}