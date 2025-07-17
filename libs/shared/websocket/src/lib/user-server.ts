import { OrbitUser } from '@shared/models';
import { Server, Socket } from 'socket.io';
import { createServer } from 'node:http';
import { EventEmitter } from 'node:events';
import { handleUserJoin } from './handlers/user-join.handler';
import { mockUserMiddleware } from './mock-user.middleware';

export type OrbitGameUser = OrbitUser<Socket>;

export interface UserServerContext {
  users: Map<string, OrbitGameUser>;
  emitter: EventEmitter;
  io: Server;
}

interface UserServerOptions {
  port: number;
}

export const UserServer = (options: UserServerOptions) => {
  const httpServer = createServer();

  const context: UserServerContext = {
    users: new Map<string, OrbitGameUser>(),
    emitter: new EventEmitter(),
    io: new Server(httpServer, {
      cors: {
        origin: '*', // TODO update with app specific cors
      },
    }),
  };

  // Player server goes here
  const GAME_UUID = '123456789';
  const GAME_SETTINGS = {};
  context.io.use(mockUserMiddleware(GAME_UUID, GAME_SETTINGS));

  // Broadcast - send event updates to all users
  const broadcast = <T>(
      data: [string, T],
      type: string | string[] = 'player' // DiceMagicEvents.Player (circular dep)
  ) => {
      context.io.to(type).emit(data[0], data[1]);
      context.io.of('/service').to(type).emit(data[0], data[1]);
  };

  // listen for new connections
  context.io.on('connection', (socket) => {
    handleUserJoin(context, socket);
  });

  httpServer.listen(options.port);

  return {
    users: () => context.users,
    broadcast,
    emitter: context.emitter,
  };
};

export type IUserServer = ReturnType<typeof UserServer>;