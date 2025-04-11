import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import socket, {
  connectSocket,
  disconnectSocket,
  login as socketLogin,
  createRoom as socketCreateRoom,
  getRooms as socketGetRooms,
  joinRoom as socketJoinRoom,
  leaveRoom as socketLeaveRoom,
  kickUser as socketKickUser,
} from "../services/socket";

import type { User, Room, RoomContextProps } from "../models";

const RoomContext = createContext<RoomContextProps | undefined>(undefined);

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [connected, setConnected] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [roomUsers, setRoomUsers] = useState<User[]>([]);

  // Connect to socket when component mounts
  useEffect(() => {
    connectSocket();

    // Set up event listeners
    socket.on("connect", () => {
      setConnected(true);
      console.log("Connected to server");
    });

    socket.on("disconnect", () => {
      setConnected(false);
      console.log("Disconnected from server");
    });

    socket.on("roomsList", (rooms: Room[]) => {
      setAvailableRooms(rooms);
    });

    socket.on("roomUsers", (users: User[]) => {
      setRoomUsers(users);
    });

    socket.on("joinedRoom", (room: Room) => {
      setCurrentRoom(room);
      setRoomUsers(room.users);
    });

    socket.on("kicked", (message: string) => {
      alert(message);
      setCurrentRoom(null);
      setRoomUsers([]);
    });

    socket.on("error", (message: string) => {
      alert(message);
    });

    // Clean up on unmount
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("roomsList");
      socket.off("roomUsers");
      socket.off("joinedRoom");
      socket.off("kicked");
      socket.off("error");
      disconnectSocket();
    };
  }, []);

  const login = async (username: string): Promise<User> => {
    const user = await socketLogin(username);
    setUser(user);
    return user;
  };

  const createRoom = async (roomName: string): Promise<Room> => {
    const room = await socketCreateRoom(roomName);
    setCurrentRoom(room);
    return room;
  };

  const getRooms = async (): Promise<Room[]> => {
    const rooms = await socketGetRooms();
    setAvailableRooms(rooms);
    return rooms;
  };

  const joinRoom = async (roomId: string): Promise<boolean> => {
    return await socketJoinRoom(roomId);
  };

  const leaveRoom = async (): Promise<boolean> => {
    const success = await socketLeaveRoom();
    if (success) {
      setCurrentRoom(null);
      setRoomUsers([]);
    }
    return success;
  };

  const kickUser = async (userId: string): Promise<boolean> => {
    return await socketKickUser(userId);
  };

  const value: RoomContextProps = {
    socket,
    connected,
    user,
    currentRoom,
    availableRooms,
    roomUsers,
    login,
    createRoom,
    getRooms,
    joinRoom,
    leaveRoom,
    kickUser,
  };

  return (
    <RoomContext.Provider value={value}>{children}</RoomContext.Provider>
  );
};

export const useRoomSocket = (): RoomContextProps => {
  const context = useContext(RoomContext);
  if (context === undefined) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
