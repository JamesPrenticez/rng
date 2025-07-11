import { BaseEvents, createEvent } from '@shared/events';
import { OrbitSocket, UserServerContext } from '../types';
import { OrbitGameUser } from '../user-server';

export const handleUserJoin = (context: UserServerContext, socket: OrbitSocket) => {
  const { io, users } = context;

  socket.on(BaseEvents.UserJoin, (user: OrbitGameUser) => {
    users.set(socket.id, { ...user, socket }); // store user data + socket reference
    io.emit(...createEvent(BaseEvents.UserUpdated, Array.from(users.values())));
  });

  socket.on('disconnect', () => {
    users.delete(socket.id);
    io.emit(...createEvent(BaseEvents.UserUpdated, Array.from(users.values())));
  });
};