import { Server, Socket } from 'socket.io';
import { createServer } from 'http';
import { 
  handlePasscodeAccepted,
  handlePasscodeRequired,
  handleUserJoin,
  mockUserMiddleware
} from '@shared/websocket';

const PORT = 3201;
const GAME_UUID = "123456789"
const GAME_SETTINGS = {}

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

// Fetch the user data from the session token provided by the host for use in the game
io.use(mockUserMiddleware(GAME_UUID, GAME_SETTINGS));

io.on('connection', (socket: Socket) => {
  console.log('[server] Socket.IO connection made');

  // Passcode
  handlePasscodeRequired(socket);
  handlePasscodeAccepted(socket);

  // Users
  handleUserJoin(io, socket);
  handlePlayerSit(io, socket);

  socket.on('disconnect', () => {
    console.log("disconnect")
  });
});

httpServer.listen(PORT, () => {
  console.log(`[server] Socket.IO server running at http://localhost:${PORT}`);
});
