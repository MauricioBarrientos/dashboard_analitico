import { WebSocketService } from '../../services/websocketService';
import { AppError, WebSocketError } from '../../services/errorHandler';

// Mock de WebSocket para pruebas
const mockWebSocket = {
  onopen: jest.fn(),
  onmessage: jest.fn(),
  onerror: jest.fn(),
  onclose: jest.fn(),
  send: jest.fn(),
  close: jest.fn(),
  readyState: 1, // WebSocket.OPEN
};

describe('WebSocketService', () => {
  let realWebSocket: any;

  beforeEach(() => {
    // Guardar referencia original
    realWebSocket = (global as any).WebSocket;
    
    // Mock del WebSocket global
    (global as any).WebSocket = jest.fn(() => mockWebSocket);
  });

  afterEach(() => {
    // Restaurar WebSocket original
    (global as any).WebSocket = realWebSocket;
  });

  test('should connect to WebSocket with provided URL', () => {
    const url = 'ws://localhost:8080';
    const mockOnMessage = jest.fn();
    
    const wsService = new WebSocketService({
      url,
      onMessage: mockOnMessage,
    });

    wsService.connect();

    expect((global as any).WebSocket).toHaveBeenCalledWith(url);
  });

  test('should send data when connected', () => {
    const url = 'ws://localhost:8080';
    const mockOnMessage = jest.fn();
    const testData = { type: 'test', data: 'data' };
    
    const wsService = new WebSocketService({
      url,
      onMessage: mockOnMessage,
    });

    wsService.connect();
    wsService.send(testData);

    expect(mockWebSocket.send).toHaveBeenCalledWith(JSON.stringify(testData));
  });

  test('should throw error if trying to send when not connected', () => {
    // Simular estado no conectado
    const mockWebSocketNotConnected = {
      ...mockWebSocket,
      readyState: 0, // WebSocket.CONNECTING
    };
    
    (global as any).WebSocket = jest.fn(() => mockWebSocketNotConnected);

    const url = 'ws://localhost:8080';
    const mockOnMessage = jest.fn();
    
    const wsService = new WebSocketService({
      url,
      onMessage: mockOnMessage,
    });

    wsService.connect();

    expect(() => wsService.send({ test: 'data' })).toThrow(AppError);
  });

  test('should handle WebSocket message parsing errors', () => {
    const url = 'ws://localhost:8080';
    const mockOnMessage = jest.fn();
    const mockOnError = jest.fn();
    
    const wsService = new WebSocketService({
      url,
      onMessage: mockOnMessage,
      onError: mockOnError,
    });

    wsService.connect();

    // Simular error de parseo invocando onmessage con datos inválidos
    const event = { data: '{ invalid json' } as MessageEvent;
    if (mockWebSocket.onmessage) {
      mockWebSocket.onmessage(event);
    }

    expect(mockOnError).toHaveBeenCalledWith(
      expect.objectContaining({
        code: 'WS_PARSE_ERROR'
      })
    );
  });

  test('should track connection state correctly', () => {
    const url = 'ws://localhost:8080';
    const mockOnMessage = jest.fn();
    
    const wsService = new WebSocketService({
      url,
      onMessage: mockOnMessage,
    });

    expect(wsService.isConnected()).toBe(false);

    // Simular estado conectado
    mockWebSocket.readyState = WebSocket.OPEN;
    (global as any).WebSocket = jest.fn(() => mockWebSocket);
    
    wsService.connect();

    // Mockear onopen para que cambie el estado simulado
    const wsInstance = (global as any).WebSocket.mock.instances[0];
    if (wsInstance && wsInstance.onopen) {
      wsInstance.onopen({ type: 'open' });
    }

    expect(wsService.isConnected()).toBe(true);
  });
});