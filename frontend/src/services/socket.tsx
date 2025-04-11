import { io, Socket } from 'socket.io-client';
import type { User, Room } from '../models';

// Create a socket instance
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';
const socket: Socket = io(SOCKET_URL);

// Socket connection functions
export const connectSocket = (): Socket => {
  socket.connect();
  return socket;
};

export const disconnectSocket = (): void => {
  socket.disconnect();
};

// User actions
export const login = (username: string): Promise<User> => {
  return new Promise((resolve) => {
    socket.emit('login', username, (user: User) => {
      resolve(user);
    });
  });
};

// Room actions
export const createRoom = (roomName: string): Promise<Room> => {
  return new Promise((resolve) => {
    socket.emit('createRoom', roomName, (room: Room) => {
      resolve(room);
    });
  });
};

export const getRooms = (): Promise<Room[]> => {
  return new Promise((resolve) => {
    socket.emit('getRooms', (rooms: Room[]) => {
      resolve(rooms);
    });
  });
};

export const joinRoom = (roomId: string): Promise<boolean> => {
  return new Promise((resolve) => {
    socket.emit('joinRoom', roomId, (success: boolean) => {
      resolve(success);
    });
  });
};

export const leaveRoom = (): Promise<boolean> => {
  return new Promise((resolve) => {
    socket.emit('leaveRoom', (success: boolean) => {
      resolve(success);
    });
  });
};

export const kickUser = (userId: string): Promise<boolean> => {
  return new Promise((resolve) => {
    socket.emit('kickUser', userId, (success: boolean) => {
      resolve(success);
    });
  });
};

export default socket;