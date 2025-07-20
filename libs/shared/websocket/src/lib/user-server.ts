import { OrbitUser, UserGameSettings } from '@shared/models';
import { Server, Socket } from 'socket.io';
import { createServer } from 'node:http';
import { EventEmitter } from 'node:events';
// import { handleUserJoin } from './handlers/user-join.handler';
import { mockUserMiddleware } from './mock-user.middleware';
import os from 'node:os';
import { UserServerContext, UserServerOptions } from './types';
import { PlayerServer } from './player-server';
import { BaseEvents, createEvent } from '@shared/events';
import { handleUserJoin } from './handlers/user-join.handler';

export type OrbitGameUser = OrbitUser<Socket>;

const getInterfaceIP = () => {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        if (interfaces[name]) {
            for (const iface of interfaces[name]) {
                if (iface.family === 'IPv4' && !iface.internal) {
                    return iface.address;
                }
            }
        }
    }
    return '127.0.0.1';
};

const getCors = (port: number, cors?: string | string[]) => {
    if (!cors) {
        if (process.env.NODE_ENV === 'development') {
            const appPort = port + 1000;
            const dealerPort = port + 1020;

            const ips = [getInterfaceIP(), 'localhost'];
            const ports = [appPort, dealerPort, 4220];

            if (process.env.IP) {
                ips.push(process.env.IP);
            }

            const allowed = ips.reduce((acc: string[], ip) => {
                ports.forEach((port) => {
                    acc.push(`http://${ip}:${port}`);
                });
                return acc;
            }, []);

            return allowed;
        }
        return '*';
    }
    if (Array.isArray(cors)) return [...cors];
    return cors;
};



export const UserServer = (
  options: UserServerOptions,
  userGameSettings?: UserGameSettings
) => {
  const httpServer = createServer();

  const context: UserServerContext = {
    users: new Map<string, OrbitGameUser>(),
    emitter: new EventEmitter(),
    io: new Server(httpServer, {
      cors: {
        origin: getCors(options.port, options.cors),
        credentials: true,
      },
    }),
    options,
    defaultGameSettings: userGameSettings ?? {},
    validServices: new Set<string>(),
    validEvents: new Map<string, string[]>(),
    validOutgoingEvents: new Map<string, string[]>(),
  };

  // Player server goes here
  // const GAME_UUID = '123456789';
  // const GAME_SETTINGS = {};
  // context.io.use(mockUserMiddleware(GAME_UUID, GAME_SETTINGS));

  // Listeners
  PlayerServer(context);

  // SO there should be a better way to do this?
  context.emitter.on(BaseEvents.UsersUpdate, (users) => {
    context.io.emit(...createEvent(BaseEvents.UsersUpdate, users));
  });

  // Broadcast - send event updates to all users
  const broadcast = <T>(
      data: [string, T],
      type: string | string[] = 'player' // DiceMagicEvents.Player (circular dep)
  ) => {
      context.io.to(type).emit(data[0], data[1]);
      context.io.of('/service').to(type).emit(data[0], data[1]);
  };

  httpServer.listen(options.port);

  return {
    users: () => context.users,
    broadcast,
    emitter: context.emitter,
  };
};

export type IUserServer = ReturnType<typeof UserServer>;