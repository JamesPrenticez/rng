import { IBaseEvent, ResponseEvent, BaseEvents } from '@shared/events';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { io, type Socket } from 'socket.io-client';

type GameSocket = Socket & {
  emitWithResponse: (
    event: IBaseEvent<string, unknown>,
    timeout?: number
  ) => Promise<ResponseEvent>;
};

const WebSocketContext = createContext<GameSocket | null>(null);

export const WebSocketProvider = ({
  children,
  url,
}: {
  children: ReactNode;
  url: string;
}) => {
  const [socket, setSocket] = useState<GameSocket | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const session = params.get('session');

    const rawSocket = io(url, {
      autoConnect: true,
      auth: { session },
    }) as GameSocket;

    rawSocket.emitWithResponse = function (
      event: IBaseEvent<string, unknown>,
      timeout = 5000
    ): Promise<ResponseEvent> {
      const [eventName, data] = event;

      return new Promise((resolve, reject) => {
        let timer: ReturnType<typeof setTimeout> | null = null;

        const onResponse = (response: ResponseEvent) => {
          if (response.message_id === data?.message_id) {
            this.off(BaseEvents.Response, onResponse);
            if (timer) clearTimeout(timer);
            resolve(response);
          }
        };

        this.on(BaseEvents.Response, onResponse);
        this.emit(eventName, data);

        timer = setTimeout(() => {
          this.off(BaseEvents.Response, onResponse);
          reject('TIMEOUT_ERROR');
        }, timeout);
      });
    };

    setSocket(rawSocket);
    return () => {
      rawSocket.disconnect();
    };
  }, [url]);

  if (!socket) return null;

  return (
    <WebSocketContext.Provider value={socket}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useSocket = (): GameSocket => {
  const socket = useContext(WebSocketContext);
  if (!socket) throw new Error('useSocket must be used within WebSocketProvider');
  return socket;
};
