import { Room } from "./room.types";
import { User } from "./user.types";

export interface RoomContextProps {
  socket: any;
  connected: boolean;
  user: User | null;
  currentRoom: Room | null;
  availableRooms: Room[];
  roomUsers: User[];
  login: (username: string) => Promise<User>;
  createRoom: (roomName: string) => Promise<Room>;
  getRooms: () => Promise<Room[]>;
  joinRoom: (roomId: string) => Promise<boolean>;
  leaveRoom: () => Promise<boolean>;
  kickUser: (userId: string) => Promise<boolean>;
}