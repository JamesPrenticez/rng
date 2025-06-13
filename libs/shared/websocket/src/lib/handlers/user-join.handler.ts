import { User } from '@shared/models';
import { Socket, Server } from 'socket.io';
import { users } from '../stores/users.store';

export const handleUserJoin = (io: Server, socket: Socket) => {
  socket.on('user:join', (user: User) => {
    users.set(socket.id, user);
    io.emit('users:update', Array.from(users.values()));
    console.log(users)
  });

  socket.on('disconnect', () => {
    users.delete(socket.id);
    io.emit('users:update', Array.from(users.values()));
  });
}
