import { Server, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { 
  User, 
  Room, 
  ClientToServerEvents, 
  ServerToClientEvents, 
  InterServerEvents, 
  SocketData 
} from '../types';

// In-memory storage
const users: Map<string, User> = new Map();
const rooms: Map<string, Room> = new Map();

export const setupSocketService = (io: Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>) => {
  io.on('connection', (socket: Socket<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >) => {
    console.log('User connected:', socket.id);

    // Handle user login
    socket.on('login', (username, callback) => {
      const user: User = {
        id: socket.id,
        username,
        roomId: null
      };

      users.set(socket.id, user);
      socket.data.user = user;
      
      callback(user);
      console.log(`User logged in: ${username}`);
    });

    // Handle room creation
    socket.on('createRoom', (roomName, callback) => {
      const user = users.get(socket.id);
      
      if (!user) {
        socket.emit('error', 'User not found');
        return;
      }
      
      // If user is already in a room, leave it first
      if (user.roomId) {
        leaveRoom(socket);
      }
      
      const roomId = uuidv4();
      const room: Room = {
        id: roomId,
        name: roomName,
        hostId: user.id,
        users: [user]
      };
      
      rooms.set(roomId, room);
      
      // Update user's room
      user.roomId = roomId;
      users.set(user.id, user);
      
      // Join socket room
      socket.join(roomId);
      
      callback(room);
      
      // Broadcast updated rooms list
      io.emit('roomsList', Array.from(rooms.values()));
      console.log(`Room created: ${roomName} by ${user.username}`);
    });

    // Get all available rooms
    socket.on('getRooms', (callback) => {
      callback(Array.from(rooms.values()));
    });

    // Join a room
    socket.on('joinRoom', (roomId, callback) => {
      const user = users.get(socket.id);
      const room = rooms.get(roomId);
      
      if (!user) {
        socket.emit('error', 'User not found');
        callback(false);
        return;
      }
      
      if (!room) {
        socket.emit('error', 'Room not found');
        callback(false);
        return;
      }
      
      // If user is already in a room, leave it first
      if (user.roomId) {
        leaveRoom(socket);
      }
      
      // Join new room
      room.users.push(user);
      user.roomId = roomId;
      
      // Join socket room
      socket.join(roomId);
      
      // Notify room users about new user
      io.to(roomId).emit('roomUsers', room.users);
      
      callback(true, room);
      socket.emit('joinedRoom', room);
      console.log(`${user.username} joined room: ${room.name}`);
    });

    // Leave room
    socket.on('leaveRoom', (callback) => {
      const success = leaveRoom(socket);
      callback(success);
    });

    // Kick user (host only)
    socket.on('kickUser', (userId, callback) => {
      const user = users.get(socket.id);
      const targetUser = users.get(userId);
      
      if (!user || !targetUser) {
        socket.emit('error', 'User not found');
        callback(false);
        return;
      }
      
      if (!user.roomId || user.roomId !== targetUser.roomId) {
        socket.emit('error', 'Users not in the same room');
        callback(false);
        return;
      }
      
      const room = rooms.get(user.roomId);
      
      if (!room) {
        socket.emit('error', 'Room not found');
        callback(false);
        return;
      }
      
      // Check if the user is the host
      if (room.hostId !== user.id) {
        socket.emit('error', 'Only the host can kick users');
        callback(false);
        return;
      }
      
      // Remove user from room
      room.users = room.users.filter(u => u.id !== targetUser.id);
      targetUser.roomId = null;
      
      // Notify kicked user
      io.to(targetUser.id).emit('kicked', `You were kicked from ${room.name}`);
      
      // Remove from socket room
      const targetSocket = io.sockets.sockets.get(targetUser.id);
      if (targetSocket) {
        targetSocket.leave(room.id);
      }
      
      // Update room users
      io.to(room.id).emit('roomUsers', room.users);
      
      callback(true);
      console.log(`${targetUser.username} was kicked from ${room.name} by ${user.username}`);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      leaveRoom(socket);
      users.delete(socket.id);
      console.log('User disconnected:', socket.id);
    });

    // Helper function to leave a room
    function leaveRoom(socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>): boolean {
      const user = users.get(socket.id);
      
      if (!user || !user.roomId) {
        return false;
      }
      
      const room = rooms.get(user.roomId);
      
      if (!room) {
        user.roomId = null;
        return false;
      }
      
      // Remove user from room
      room.users = room.users.filter(u => u.id !== user.id);
      
      // Check if room is empty
      if (room.users.length === 0) {
        rooms.delete(room.id);
        io.emit('roomsList', Array.from(rooms.values()));
      } else {
        // If the leaving user is the host, assign a new host
        if (room.hostId === user.id) {
          room.hostId = room.users[0].id;
        }
        
        // Update room users for remaining users
        io.to(room.id).emit('roomUsers', room.users);
      }
      
      // Leave socket room
      socket.leave(room.id);
      
      // Update user
      user.roomId = null;
      
      // Broadcast updated rooms list
      io.emit('roomsList', Array.from(rooms.values()));
      
      console.log(`${user.username} left room: ${room.name}`);
      return true;
    }
  });
}