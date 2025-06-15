import { User } from '@shared/models';
import { Socket, Server } from 'socket.io';
import { users } from '../stores/users.store';
import { BaseEvents, createEvent } from '@shared/events';

export const handleUserJoin = (io: Server, socket: Socket) => {
  socket.on(BaseEvents.UserJoin, (user: User) => {
    users.set(socket.id, user);
    io.emit(...createEvent(BaseEvents.UsersUpdate, Array.from(users.values())));
  });

  socket.on('disconnect', () => {
    users.delete(socket.id);
    io.emit(...createEvent(BaseEvents.UsersUpdate, Array.from(users.values())));
  });
};
