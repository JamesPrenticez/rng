// WebSocketContext.tsx
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { io, type Socket } from 'socket.io-client';

const WebSocketContext = createContext<Socket | undefined>(undefined);

export const WebSocketProvider = ({
  children,
  url,
}: {
  children: ReactNode;
  url: string;
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const s = io(url, { autoConnect: true });
    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, [url]);

  if (!socket) return null; // 👈 prevent rendering until socket is ready

  return (
    <WebSocketContext.Provider value={socket ?? undefined}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useSocket = () => {
  const socket = useContext(WebSocketContext);
  if (!socket) throw new Error('useSocket must be used within WebSocketProvider');
  return socket;
};
