import { Room } from "./room";
import { User } from "./user";

export interface ServerToClientEvents {
  roomsList: (rooms: Room[]) => void;
  roomUsers: (users: User[]) => void;
  joinedRoom: (room: Room) => void;
  kicked: (message: string) => void;
  error: (message: string) => void;
}

export interface ClientToServerEvents {
  login: (username: string, callback: (user: User) => void) => void;
  createRoom: (roomName: string, callback: (room: Room) => void) => void;
  getRooms: (callback: (rooms: Room[]) => void) => void;
  joinRoom: (roomId: string, callback: (success: boolean, room?: Room) => void) => void;
  leaveRoom: (callback: (success: boolean) => void) => void;
  kickUser: (userId: string, callback: (success: boolean) => void) => void;
  disconnect: () => void;
}

export interface InterServerEvents {}

export interface SocketData {
  user: User;
}