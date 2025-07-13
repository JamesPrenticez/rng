import { OrbitUser } from '@shared/models';
import { Server, Socket } from 'socket.io';
import { createServer } from 'http';
import { handleUserJoin } from './handlers/user-join.handler';
import { mockUserMiddleware } from './mock-user.middleware';

export type OrbitGameUser = OrbitUser<Socket>;

export interface UserServerContext {
  users: Map<string, OrbitGameUser>;
  io: Server;
}

interface UserServerOptions {
  port: number;
}

export const UserServer = async (options: UserServerOptions) => {
  const httpServer = createServer();

  const context: UserServerContext = {
    users: new Map<string, OrbitGameUser>(),
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

  // listen for new connections
  context.io.on('connection', (socket) => {
    handleUserJoin(context, socket);
  });

  httpServer.listen(options.port);

  return {
    users: () => context.users,
  };
};
