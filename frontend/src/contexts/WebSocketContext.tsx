import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { io, Socket } from 'socket.io-client';

// Notification from server
export interface ServerNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  isRead: boolean;
  metadata?: {
    deliveryId?: string;
    vendorId?: string;
    link?: string;
  };
  createdAt: string;
}

interface SocketContextType {
  isConnected: boolean;
  notifications: ServerNotification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  refreshNotifications: () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error('useSocket must be used within a SocketProvider');
  return context;
};

// Keep backward-compatible export name
export const useWebSocket = useSocket;

interface SocketProviderProps {
  children: React.ReactNode;
}

export const WebSocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<ServerNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const socketRef = useRef<Socket | null>(null);

  // Get auth token
  const getToken = useCallback(() => {
    return localStorage.getItem('token');
  }, []);

  // Build Socket.IO URL from API URL or use location
  const getSocketUrl = useCallback(() => {
    const apiUrl = import.meta.env.VITE_API_URL;
    if (apiUrl && apiUrl.startsWith('http')) {
      // Absolute URL — use its origin
      return new URL(apiUrl).origin;
    }
    // Relative /api — connect to same origin
    return window.location.origin;
  }, []);

  // Fetch initial notifications via REST
  const refreshNotifications = useCallback(async () => {
    const token = getToken();
    if (!token) return;

    try {
      const apiBase = import.meta.env.VITE_API_URL || '/api';
      const res = await fetch(`${apiBase}/notifications?limit=20`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data?.notifications) {
          setNotifications(json.data.notifications.map((n: any) => ({
            id: n._id || n.id,
            type: n.type,
            title: n.title,
            message: n.message,
            severity: n.severity || 'low',
            isRead: n.isRead,
            metadata: n.metadata,
            createdAt: n.createdAt,
          })));
        }
      }
    } catch (err) {
      console.warn('Failed to fetch notifications:', err);
    }

    try {
      const apiBase = import.meta.env.VITE_API_URL || '/api';
      const res = await fetch(`${apiBase}/notifications/unread-count`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) setUnreadCount(json.data.count);
      }
    } catch {
      // ignore
    }
  }, [getToken]);

  // Connect / disconnect socket based on auth
  useEffect(() => {
    const token = getToken();
    if (!token) {
      // Not logged in — disconnect if connected
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setIsConnected(false);
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    const socketUrl = getSocketUrl();
    const socket = io(socketUrl, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
      reconnectionDelayMax: 10000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('get:unread-count');
      // Fetch full notification list on connect
      refreshNotifications();
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('notification', (payload: ServerNotification) => {
      setNotifications(prev => [payload, ...prev].slice(0, 50));
      setUnreadCount(prev => prev + 1);
    });

    socket.on('unread-count', (data: { count: number }) => {
      setUnreadCount(data.count);
    });

    socket.on('connect_error', (err) => {
      console.warn('Socket connection error:', err.message);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [getToken, getSocketUrl, refreshNotifications]);

  const markAsRead = useCallback((id: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('mark:read', id);
    }
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  const markAllAsRead = useCallback(async () => {
    const token = getToken();
    if (!token) return;

    try {
      const apiBase = import.meta.env.VITE_API_URL || '/api';
      await fetch(`${apiBase}/notifications/read-all`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      // ignore
    }

    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);
  }, [getToken]);

  const contextValue = useMemo(() => ({
    isConnected,
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    refreshNotifications,
  }), [isConnected, notifications, unreadCount, markAsRead, markAllAsRead, refreshNotifications]);

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};