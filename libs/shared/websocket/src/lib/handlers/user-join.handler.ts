import { Socket } from 'socket.io';
import { BaseEvents, createEvent } from '@shared/events';
import { OrbitGameUser, UserServerContext } from '../user-server';

export const handleUserJoin = (context: UserServerContext, socket: Socket) => {
  socket.on(BaseEvents.UserJoin, (user: OrbitGameUser) => {
    context.users.set(socket.id, user);
    context.io.emit(...createEvent(BaseEvents.UsersUpdate, Array.from(context.users.values())));
  });

  socket.on('disconnect', () => {
    context.users.delete(socket.id);
    context.io.emit(...createEvent(BaseEvents.UsersUpdate, Array.from(context.users.values())));
  });
};
