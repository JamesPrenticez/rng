import type { Socket } from 'socket.io';
import { mockUserMiddleware, userMiddleware } from './mock-user.middleware';
import { UserServerContext } from './types';
import { handleUserJoin } from './handlers/user-join.handler';

export function PlayerServer(context: UserServerContext) {
    const io = context.io;

    if (context.options.useMockServer) {
        io.use(mockUserMiddleware());
    } else {
        io.use(userMiddleware());
    }

    io.on('connection', (socket: Socket) => {
        handleUserJoin(context, socket);
    });
}