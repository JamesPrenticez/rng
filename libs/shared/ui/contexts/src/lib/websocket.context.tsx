// WebSocketContext.tsx
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';

type WebSocketContextType = {
  socket: WebSocket;
  send: (event: string, payload: any) => void;
};

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider = ({
  children,
  url,
}: {
  children: ReactNode;
  url: string;
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(url);
    socketRef.current = ws;

    ws.onopen = () => {
      console.log('[client] Connected to server');
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log('[client] Message received:', message);
        // You can add custom event dispatching logic here
      } catch (e) {
        console.error('[client] Invalid message:', event.data);
      }
    };

    ws.onclose = () => {
      console.log('[client] Disconnected from server');
      setIsConnected(false);
    };

    ws.onerror = (err) => {
      console.error('[client] WebSocket error:', err);
    };

    return () => {
      ws.close();
    };
  }, [url]);

  if (!isConnected || !socketRef.current) return null;

  const send = (event: string, payload: any) => {
    const message = JSON.stringify({ event, payload });
    socketRef.current?.send(message);
  };

  return (
    <WebSocketContext.Provider value={{ socket: socketRef.current, send }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useSocket must be used within WebSocketProvider');
  }
  return context;
};
