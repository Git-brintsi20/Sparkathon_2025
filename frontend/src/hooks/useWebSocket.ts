import { useEffect, useRef, useState, useCallback } from 'react';

export interface WebSocketConfig {
  url: string;
  protocols?: string | string[];
  onOpen?: (event: Event) => void;
  onMessage?: (event: MessageEvent) => void;
  onError?: (event: Event) => void;
  onClose?: (event: CloseEvent) => void;
  reconnectAttempts?: number;
  reconnectInterval?: number;
  heartbeatInterval?: number;
  heartbeatMessage?: string;
}

export interface WebSocketState {
  socket: WebSocket | null;
  isConnected: boolean;
  isConnecting: boolean;
  isReconnecting: boolean;
  error: string | null;
  reconnectCount: number;
  lastMessage: any;
  connectionId: string | null;
}

export interface UseWebSocketReturn {
  state: WebSocketState;
  connect: () => void;
  disconnect: () => void;
  reconnect: () => void;
  sendMessage: (message: any) => boolean;
  sendJSON: (data: any) => boolean;
  subscribe: (channel: string) => void;
  unsubscribe: (channel: string) => void;
  isHealthy: () => boolean;
}

export const useWebSocket = (config: WebSocketConfig): UseWebSocketReturn => {
  const {
    url,
    protocols,
    onOpen,
    onMessage,
    onError,
    onClose,
    reconnectAttempts = 5,
    reconnectInterval = 3000,
    heartbeatInterval = 30000,
    heartbeatMessage = 'ping'
  } = config;

  const [state, setState] = useState<WebSocketState>({
    socket: null,
    isConnected: false,
    isConnecting: false,
    isReconnecting: false,
    error: null,
    reconnectCount: 0,
    lastMessage: null,
    connectionId: null,
  });

  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const subscriptionsRef = useRef<Set<string>>(new Set());

  // Clear all timeouts
  const clearTimeouts = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (heartbeatTimeoutRef.current) {
      clearTimeout(heartbeatTimeoutRef.current);
      heartbeatTimeoutRef.current = null;
    }
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }
  }, []);

  // Start heartbeat
  const startHeartbeat = useCallback(() => {
    if (heartbeatInterval > 0) {
      heartbeatIntervalRef.current = setInterval(() => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
          socketRef.current.send(heartbeatMessage);
        }
      }, heartbeatInterval);
    }
  }, [heartbeatInterval, heartbeatMessage]);

  // Stop heartbeat
  const stopHeartbeat = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }
  }, []);

  // Handle reconnection
  const handleReconnect = useCallback(() => {
    if (state.reconnectCount < reconnectAttempts) {
      setState(prev => ({
        ...prev,
        isReconnecting: true,
        reconnectCount: prev.reconnectCount + 1,
        error: null,
      }));

      reconnectTimeoutRef.current = setTimeout(() => {
        connect();
      }, reconnectInterval);
    } else {
      setState(prev => ({
        ...prev,
        isReconnecting: false,
        error: 'Maximum reconnection attempts reached',
      }));
    }
  }, [state.reconnectCount, reconnectAttempts, reconnectInterval]);

  // Connect to WebSocket
  const connect = useCallback(() => {
    if (socketRef.current?.readyState === WebSocket.CONNECTING || 
        socketRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      setState(prev => ({
        ...prev,
        isConnecting: true,
        error: null,
      }));

      const socket = new WebSocket(url, protocols);
      socketRef.current = socket;

      socket.onopen = (event) => {
        setState(prev => ({
          ...prev,
          socket,
          isConnected: true,
          isConnecting: false,
          isReconnecting: false,
          error: null,
          reconnectCount: 0,
          connectionId: `ws_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        }));

        startHeartbeat();
        
        // Resubscribe to channels
        subscriptionsRef.current.forEach(channel => {
          socket.send(JSON.stringify({ type: 'subscribe', channel }));
        });

        onOpen?.(event);
      };

      socket.onmessage = (event) => {
        let parsedMessage;
        try {
          parsedMessage = JSON.parse(event.data);
        } catch {
          parsedMessage = event.data;
        }

        setState(prev => ({
          ...prev,
          lastMessage: parsedMessage,
        }));

        onMessage?.(event);
      };

      socket.onerror = (event) => {
        setState(prev => ({
          ...prev,
          error: 'WebSocket connection error',
          isConnecting: false,
        }));

        onError?.(event);
      };

      socket.onclose = (event) => {
        setState(prev => ({
          ...prev,
          socket: null,
          isConnected: false,
          isConnecting: false,
          connectionId: null,
        }));

        stopHeartbeat();
        socketRef.current = null;

        // Attempt reconnection if not intentionally closed
        if (!event.wasClean && state.reconnectCount < reconnectAttempts) {
          handleReconnect();
        }

        onClose?.(event);
      };

    } catch (error) {
      setState(prev => ({
        ...prev,
        error: `Failed to connect: ${error}`,
        isConnecting: false,
      }));
    }
  }, [url, protocols, onOpen, onMessage, onError, onClose, startHeartbeat, stopHeartbeat, handleReconnect, state.reconnectCount, reconnectAttempts]);

  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    clearTimeouts();
    stopHeartbeat();
    
    if (socketRef.current) {
      socketRef.current.close(1000, 'Disconnected by user');
      socketRef.current = null;
    }

    setState(prev => ({
      ...prev,
      socket: null,
      isConnected: false,
      isConnecting: false,
      isReconnecting: false,
      connectionId: null,
    }));
  }, [clearTimeouts, stopHeartbeat]);

  // Reconnect to WebSocket
  const reconnect = useCallback(() => {
    disconnect();
    setState(prev => ({
      ...prev,
      reconnectCount: 0,
      error: null,
    }));
    setTimeout(connect, 100);
  }, [disconnect, connect]);

  // Send message
  const sendMessage = useCallback((message: any): boolean => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      try {
        socketRef.current.send(
          typeof message === 'string' ? message : JSON.stringify(message)
        );
        return true;
      } catch (error) {
        console.error('Failed to send message:', error);
        return false;
      }
    }
    return false;
  }, []);

  // Send JSON message
  const sendJSON = useCallback((data: any): boolean => {
    return sendMessage(JSON.stringify(data));
  }, [sendMessage]);

  // Subscribe to channel
  const subscribe = useCallback((channel: string) => {
    subscriptionsRef.current.add(channel);
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      sendJSON({ type: 'subscribe', channel });
    }
  }, [sendJSON]);

  // Unsubscribe from channel
  const unsubscribe = useCallback((channel: string) => {
    subscriptionsRef.current.delete(channel);
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      sendJSON({ type: 'unsubscribe', channel });
    }
  }, [sendJSON]);

  // Check if connection is healthy
  const isHealthy = useCallback((): boolean => {
    return socketRef.current?.readyState === WebSocket.OPEN && state.isConnected;
  }, [state.isConnected]);

  // Auto-connect on mount
  useEffect(() => {
    connect();
    
    return () => {
      clearTimeouts();
      disconnect();
    };
  }, []);

  // Handle page visibility for reconnection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !state.isConnected && !state.isConnecting) {
        reconnect();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [state.isConnected, state.isConnecting, reconnect]);

  return {
    state,
    connect,
    disconnect,
    reconnect,
    sendMessage,
    sendJSON,
    subscribe,
    unsubscribe,
    isHealthy,
  };
};

// Hook for real-time delivery updates
export const useDeliveryUpdates = () => {
  const config: WebSocketConfig = {
    url: `${import.meta.env.VITE_WS_URL || 'ws://localhost:8080'}/delivery-updates`,
    reconnectAttempts: 10,
    reconnectInterval: 2000,
    heartbeatInterval: 25000,
  };

  const [deliveryUpdates, setDeliveryUpdates] = useState<any[]>([]);
  const [alertCount, setAlertCount] = useState(0);

  const websocket = useWebSocket({
    ...config,
    onMessage: (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'delivery_update') {
          setDeliveryUpdates(prev => [data.payload, ...prev.slice(0, 49)]);
        } else if (data.type === 'alert') {
          setAlertCount(prev => prev + 1);
        }
      } catch (error) {
        console.error('Failed to parse delivery update:', error);
      }
    },
  });

  const subscribeToDelivery = useCallback((deliveryId: string) => {
    websocket.subscribe(`delivery_${deliveryId}`);
  }, [websocket]);

  const unsubscribeFromDelivery = useCallback((deliveryId: string) => {
    websocket.unsubscribe(`delivery_${deliveryId}`);
  }, [websocket]);

  const clearAlerts = useCallback(() => {
    setAlertCount(0);
  }, []);

  return {
    ...websocket,
    deliveryUpdates,
    alertCount,
    subscribeToDelivery,
    unsubscribeFromDelivery,
    clearAlerts,
  };
};

// Hook for real-time analytics
export const useAnalyticsStream = () => {
  const config: WebSocketConfig = {
    url: `${import.meta.env.VITE_WS_URL || 'ws://localhost:8080'}/analytics`,
    reconnectAttempts: 5,
    reconnectInterval: 5000,
    heartbeatInterval: 30000,
  };

  const [metrics, setMetrics] = useState<any>(null);
  const [trends, setTrends] = useState<any[]>([]);

  const websocket = useWebSocket({
    ...config,
    onMessage: (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'metrics_update') {
          setMetrics(data.payload);
        } else if (data.type === 'trend_update') {
          setTrends(prev => [...prev, data.payload]);
        }
      } catch (error) {
        console.error('Failed to parse analytics update:', error);
      }
    },
  });

  return {
    ...websocket,
    metrics,
    trends,
  };
};