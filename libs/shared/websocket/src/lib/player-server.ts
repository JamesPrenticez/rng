// Local
import { mockUserMiddleware } from './mock-user.middleware';
import type { UserServerContext } from './types';
import { UserConnectionHandler } from './handlers/user-connection.handler';
import { Socket } from 'socket.io';

export const PlayerServer = (context: UserServerContext) => {
    const io = context.io;

    if (context.options.useMockServer) {
        io.use(
            mockUserMiddleware(
                context.defaultGameSettings
            )
        );
    } else {
        console.log("What you doing ! we dont have a prod server")
        // io.use(userMiddleware(context));
    }

    io.on('connection', async (socket: Socket) => {
      // console.log(socket)
        // if (socket.data.type === 'user')
          return UserConnectionHandler(context)(socket);
    }
  );
};
