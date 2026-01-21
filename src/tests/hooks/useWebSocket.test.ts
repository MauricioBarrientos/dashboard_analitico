import { renderHook, act } from '@testing-library/react';
import { useWebSocket } from '../hooks/useWebSocket';

// Mock WebSocket
class MockWebSocket {
  static instances: MockWebSocket[] = [];
  
  onopen: ((this: WebSocket, ev: Event) => any) | null = null;
  onmessage: ((this: WebSocket, ev: MessageEvent) => any) | null = null;
  onclose: ((this: WebSocket, ev: CloseEvent) => any) | null = null;
  onerror: ((this: WebSocket, ev: Event) => any) | null = null;
  
  readyState = WebSocket.CONNECTING;
  url: string;
  
  constructor(url: string) {
    this.url = url;
    MockWebSocket.instances.push(this);
  }
  
  static reset() {
    MockWebSocket.instances = [];
  }
  
  close(code?: number) {
    this.readyState = WebSocket.CLOSED;
    if (this.onclose) {
      this.onclose(new CloseEvent('close', { code: code || 1000 }));
    }
  }
  
  send(data: string) {
    // Mock send functionality
  }
}

describe('useWebSocket Hook', () => {
  // Mock WebSocket globally
  const originalWebSocket = global.WebSocket;
  
  beforeEach(() => {
    global.WebSocket = MockWebSocket as any;
    MockWebSocket.reset();
  });
  
  afterEach(() => {
    global.WebSocket = originalWebSocket;
  });
  
  test('should initialize with default values', () => {
    const { result } = renderHook(() => useWebSocket('ws://localhost:8080'));
    
    expect(result.current.data).toBeNull();
    expect(result.current.isConnected).toBe(false);
    expect(result.current.error).toBeNull();
  });
  
  test('should connect to WebSocket and update connection status', () => {
    const { result } = renderHook(() => useWebSocket('ws://localhost:8080'));
    
    // Simulate the connection event
    act(() => {
      const mockWs = MockWebSocket.instances[0];
      mockWs.readyState = WebSocket.OPEN;
      if (mockWs.onopen) {
        mockWs.onopen(new Event('open'));
      }
    });
    
    expect(result.current.isConnected).toBe(true);
    expect(result.current.error).toBeNull();
  });
  
  test('should handle error when WebSocket URL is invalid', () => {
    const { result } = renderHook(() => useWebSocket('invalid-url'));
    
    expect(result.current.error).toBe('Invalid WebSocket URL');
  });
  
  test('should handle WebSocket messages and update data', () => {
    const testData = { type: 'test', payload: { value: 123 } };
    const { result } = renderHook(() => useWebSocket('ws://localhost:8080'));
    
    // Simulate the connection event
    act(() => {
      const mockWs = MockWebSocket.instances[0];
      mockWs.readyState = WebSocket.OPEN;
      if (mockWs.onopen) {
        mockWs.onopen(new Event('open'));
      }
    });
    
    // Simulate receiving a message
    act(() => {
      const mockWs = MockWebSocket.instances[0];
      if (mockWs.onmessage) {
        mockWs.onmessage(new MessageEvent('message', {
          data: JSON.stringify(testData)
        }));
      }
    });
    
    expect(result.current.data).toEqual(testData);
  });
  
  test('should handle WebSocket errors', () => {
    const { result } = renderHook(() => useWebSocket('ws://localhost:8080'));
    
    // Simulate an error
    act(() => {
      const mockWs = MockWebSocket.instances[0];
      if (mockWs.onerror) {
        mockWs.onerror(new Event('error'));
      }
    });
    
    expect(result.current.error).toContain('WebSocket connection error');
    expect(result.current.isConnected).toBe(false);
  });
  
  test('should handle WebSocket close events', () => {
    const { result } = renderHook(() => useWebSocket('ws://localhost:8080'));
    
    // Simulate the connection event
    act(() => {
      const mockWs = MockWebSocket.instances[0];
      mockWs.readyState = WebSocket.OPEN;
      if (mockWs.onopen) {
        mockWs.onopen(new Event('open'));
      }
    });
    
    expect(result.current.isConnected).toBe(true);
    
    // Simulate the close event
    act(() => {
      const mockWs = MockWebSocket.instances[0];
      if (mockWs.onclose) {
        mockWs.onclose(new CloseEvent('close', { code: 1001 }));
      }
    });
    
    expect(result.current.isConnected).toBe(false);
  });
  
  test('should send messages through WebSocket when connected', () => {
    const { result } = renderHook(() => useWebSocket('ws://localhost:8080'));
    
    // Simulate the connection event
    act(() => {
      const mockWs = MockWebSocket.instances[0];
      mockWs.readyState = WebSocket.OPEN;
      if (mockWs.onopen) {
        mockWs.onopen(new Event('open'));
      }
    });
    
    // Mock the send method to track calls
    const mockSend = jest.fn();
    const mockWs = MockWebSocket.instances[0];
    mockWs.send = mockSend;
    
    // Send a test message
    act(() => {
      result.current.send('test message');
    });
    
    expect(mockSend).toHaveBeenCalledWith('test message');
  });
  
  test('should not send messages when WebSocket is not connected', () => {
    const { result } = renderHook(() => useWebSocket('ws://localhost:8080'));
    
    // Try to send a message before connecting
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
    
    act(() => {
      result.current.send('test message');
    });
    
    expect(consoleSpy).toHaveBeenCalledWith(
      'WebSocket is not connected, cannot send message:', 
      'test message'
    );
    consoleSpy.mockRestore();
  });
});