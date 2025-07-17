import { BaseEvents, IBaseEvent, ResponseEvent } from '@shared/events';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { io, type Socket } from 'socket.io-client';

type GameSocket = Socket & {
  emitWithResponse: (
    event: IBaseEvent<string, unknown>
  ) => Promise<ResponseEvent>;
};

interface WebSocketContextProps {
  socket: GameSocket;
  connected: boolean;
  // duplicateSession: boolean;
  // host: string;
  reconnecting: boolean;
  reconnectTimer: number;
  connectedSince: Date | null;
  error: Error | null;
  pause: () => void;
  unpause: () => void;
}

const WebSocketContext = createContext<WebSocketContextProps | undefined>(
  undefined
);

interface WebSocketProviderProps {
  children: ReactNode;
  url: string;
  token?: string; // TODO
}

export const createSocket = (
  url: string,
  session?: string,
  token?: string
): GameSocket => {

  const socket = io(url, {
    autoConnect: true,
    auth: {
      token: token || session,
    },
    withCredentials: true,
  }) as GameSocket;

  socket.emitWithResponse = function (event, timeout = 5000) {
    const [eventName, data] = event;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.off(BaseEvents.Response, onResponse);
        reject('TIMEOUT_ERROR');
      }, timeout);

      const onResponse = (response: ResponseEvent) => {
        if (response.message_id === data.message_id) {
          this.off(BaseEvents.Response, onResponse);
          clearTimeout(timer);
          resolve(response);
        }
      };

      this.on(BaseEvents.Response, onResponse);
      this.emit(eventName, data);
    });
  };

  return socket;
};

export const WebSocketProvider = ({
  children,
  url,
  token,
}: WebSocketProviderProps) => {
  const session = new URLSearchParams(window.location.search).get('session');
  
  const socket = useRef<GameSocket>(
    createSocket(url, session ?? undefined, token)
  ).current;

  const reconnectTries = useRef(0);
  const [connected, setConnected] = useState(false);
  const [reconnecting, setReconnecting] = useState(false);
  const [reconnectTimer, setReconnectTimer] = useState(0);
  const [connectedSince, setConnectedSince] = useState<Date | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [paused, setPaused] = useState(false);

  const pause = useCallback(() => {
    socket.disconnect();
  }, [socket]);

  const unpause = useCallback(() => {
    socket.connect();
  }, [socket]);

  // Decrement reconnect timer every second
  useEffect(() => {
    if (reconnecting && !paused) {
      const timer = setInterval(() => {
        setReconnectTimer((prev) => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [reconnecting, paused]);

  // Attempt reconnection
  useEffect(() => {
    if (reconnectTimer === 0 && !paused && reconnecting) {
      socket.connect();
    }
  }, [reconnectTimer, paused, reconnecting, socket]);

  // Register socket listeners
  useEffect(() => {
    socket.on('connect', () => {
      setConnected(true);
      setConnectedSince(new Date());
      setReconnecting(false);
      reconnectTries.current = 0;
      setError(null);
      console.info('[socket] connected');
    });

    socket.on('disconnect', () => {
      setConnected(false);
      setConnectedSince(null);
      setReconnecting(true);
      reconnectTries.current += 1;
      setReconnectTimer(Math.min(30, 5 * reconnectTries.current));
      console.warn('[socket] disconnected');
    });

    socket.on('connect_error', (err) => {
      console.error('[socket] connection error', err);
      const e = err as { message: string; data?: { code?: number } };
      if (e.data?.code === 401) {
        localStorage.removeItem('auth_token');
      }

      if (e.message === 'xhr poll error') {
        setReconnecting(true);
        setConnected(false);
        setConnectedSince(null);
        reconnectTries.current += 1;
        setReconnectTimer(Math.min(30, 5 * reconnectTries.current));
        return;
      }

      setError(new Error(e.message));
      setConnected(false);
    });

    // Initial connect
    socket.connect();

    return () => {
      socket.disconnect();
      socket.removeAllListeners();
    };
  }, [socket]);

  const value = useMemo<WebSocketContextProps>(() => {
    return {
      socket,
      connected,
      reconnecting,
      reconnectTimer,
      connectedSince,
      error,
      pause,
      unpause,
    };
  }, [
    socket,
    connected,
    reconnecting,
    reconnectTimer,
    connectedSince,
    error,
    pause,
    unpause,
  ]);

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebsocketContext = (): GameSocket => {
  const ctx = useContext(WebSocketContext);
  if (!ctx?.socket)
    throw new Error(
      'useSocket must be used within WebSocketProvider and after connection'
    );
  return ctx.socket;
};

export const useSocketStatus = () => {
  const ctx = useContext(WebSocketContext);
  if (!ctx) throw new Error('WebSocketContext missing');
  return {
    connected: ctx.connected,
    reconnecting: ctx.reconnecting,
    reconnectTimer: ctx.reconnectTimer,
    connectedSince: ctx.connectedSince,
    error: ctx.error,
    pause: ctx.pause,
    unpause: ctx.unpause,
  };
};
