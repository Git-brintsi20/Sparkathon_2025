import React, { 
  createContext, 
  useContext, 
  useEffect, 
  useRef, 
  useState, 
  useCallback,
  useMemo // <-- Import useMemo
} from 'react';
import type { WebSocketMessage, WebSocketState } from '@/types/common';

// --- MockWebSocket Class (This part is well-designed, no major changes needed) ---
// In WebSocketContext.tsx

class MockWebSocket {
  // Use properties directly, just like the real WebSocket
  public onopen: ((ev: Event) => any) | null = null;
  public onmessage: ((ev: MessageEvent) => any) | null = null;
  public onclose: ((ev: CloseEvent) => any) | null = null;
  public onerror: ((ev: Event) => any) | null = null;

  public readyState = 0; // CONNECTING
  public url: string;

  constructor(url: string) {
    this.url = url;
    console.log('Mock WebSocket: Initialized');

    // Simulate the connection opening
    setTimeout(() => {
      this.readyState = 1; // OPEN
      console.log('Mock WebSocket: Connection opened');
      // Directly call the handler if it has been set
      if (typeof this.onopen === 'function') {
        this.onopen(new Event('open'));
      }
    }, 100);
  }

  send(data: string) {
    if (this.readyState !== 1) {
      console.warn('Mock WebSocket: Cannot send while not OPEN');
      return;
    }
    console.log('Mock WebSocket: "Sending" message:', data);
    // Simulate a response
    setTimeout(() => {
      if (typeof this.onmessage === 'function') {
        const response = { type: 'mock_response', payload: { text: 'This is a mock reply!' } };
        this.onmessage(new MessageEvent('message', { data: JSON.stringify(response) }));
      }
    }, 500);
  }

  close() {
    if (this.readyState === 3) return; // Already closed
    this.readyState = 3; // CLOSED
    console.log('Mock WebSocket: Connection closed');
    // Directly call the handler if it has been set
    if (typeof this.onclose === 'function') {
      this.onclose(new CloseEvent('close', { wasClean: true, code: 1000 }));
    }
  }
}

// --- Context Definition ---
interface WebSocketContextType {
  state: WebSocketState;
  sendMessage: (message: WebSocketMessage) => void;
  subscribe: (type: string, callback: (payload: any) => void) => () => void;
  connect: () => void;
  disconnect: () => void;
  isConnected: boolean;
  isMock: boolean;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) throw new Error('useWebSocket must be used within a WebSocketProvider');
  return context;
};

interface WebSocketProviderProps {
  children: React.ReactNode;
  url?: string;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  autoConnect?: boolean;
  // This prop's instability was the cause of the loop.
  // We will handle it more carefully now.
  mockResponseGenerator?: (message: WebSocketMessage) => WebSocketMessage | undefined;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
  children,
  url = import.meta.env.VITE_WS_URL || `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws`,
  reconnectInterval = 5000,
  maxReconnectAttempts = 5,
  autoConnect = true,
  mockResponseGenerator, // Receive the generator function
}) => {
  const [state, setState] = useState<WebSocketState>({ isConnected: false, lastMessage: null, error: null });
  const [isMock, setIsMock] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const subscribersRef = useRef<Map<string, Set<(payload: any) => void>>>(new Map());
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.onclose = null; // Prevent reconnect logic from firing on manual disconnect
      wsRef.current.close(1000, 'Disconnected by user');
      wsRef.current = null;
    }
    setState(prev => ({ ...prev, isConnected: false, error: null }));
  }, []);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN || wsRef.current?.readyState === WebSocket.CONNECTING) return;
    disconnect(); // Ensure any old connection is cleaned up before starting a new one

    try {
      let socket: WebSocket;
      if (import.meta.env.VITE_WS_ENABLED === 'false') {
        console.warn('Using mock WebSocket.');
        setIsMock(true);
        const mockWs = new MockWebSocket(url);
        if (mockResponseGenerator) {
          mockWs.setResponseGenerator(mockResponseGenerator);
        }
        socket = mockWs as unknown as WebSocket;
      } else {
        setIsMock(false);
        socket = new WebSocket(url);
      }
      wsRef.current = socket;
      
      socket.onopen = () => {
        setState(prev => ({ ...prev, isConnected: true, error: null }));
        reconnectAttemptsRef.current = 0;
        if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      };

      socket.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          setState(prev => ({ ...prev, lastMessage: message }));
          const subscribers = subscribersRef.current.get(message.type);
          subscribers?.forEach(callback => callback(message.payload));
        } catch (error) { console.error('Error parsing WebSocket message:', error); }
      };
      
      socket.onclose = (event) => {
        // Only attempt to reconnect if it wasn't a clean, manual disconnect
        if (wsRef.current && !event.wasClean && reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current++;
          const timeout = setTimeout(connect, reconnectInterval * Math.pow(2, reconnectAttemptsRef.current - 1));
          reconnectTimeoutRef.current = timeout;
        }
        setState(prev => ({ ...prev, isConnected: false, error: event.wasClean ? null : 'Connection closed unexpectedly' }));
      };

      socket.onerror = () => {
        setState(prev => ({ ...prev, error: 'WebSocket connection error' }));
      };

    } catch (error) {
      setState(prev => ({ ...prev, error: 'Failed to create WebSocket connection' }));
    }
    // CORRECTED: The unstable mockResponses dependency is removed.
    // We now pass a stable function `mockResponseGenerator` instead of an object.
  }, [url, reconnectInterval, maxReconnectAttempts, mockResponseGenerator, disconnect]);

  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else { console.warn('WebSocket is not connected'); }
  }, []);

  const subscribe = useCallback((type: string, callback: (payload: any) => void) => {
    if (!subscribersRef.current.has(type)) {
      subscribersRef.current.set(type, new Set());
    }
    const subscribers = subscribersRef.current.get(type)!;
    subscribers.add(callback);
    return () => { subscribers.delete(callback); };
  }, []);

  useEffect(() => {
    if (autoConnect) connect();
    return () => disconnect();
  }, [autoConnect, connect, disconnect]);

  // CORRECTED: Memoize the context value to prevent unnecessary re-renders of consumers.
  const contextValue = useMemo(() => ({
    state,
    sendMessage,
    subscribe,
    connect,
    disconnect,
    isConnected: state.isConnected,
    isMock,
  }), [state, sendMessage, subscribe, connect, disconnect, isMock]);

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
};