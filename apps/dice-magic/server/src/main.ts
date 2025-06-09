import { Server, Socket } from 'socket.io';
import { createServer } from 'http';
import { createMockSession, mockUserMiddleware } from '@shared/websocket';
import { BaseEvents, PasscodeAcceptedEvent, PasscodeRequiredEvent } from '@shared/events';

// mockUserMiddlewate // libs\shared\websocket\src\lib\mock-user.middleware.ts
// PlayerServer // libs\shared\websocket\src\lib\player-server.ts
// UserServer // libs\shared\websocket\src\lib\user-server.ts
// RouletteBackend // apps\roulette\server\src\roulette-backend.service.ts
// which then get called here.

const PORT = 3201;
const GAME_UUID = "123456789"
const GAME_SETTINGS = {}

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

io.use(mockUserMiddleware(GAME_UUID, GAME_SETTINGS));

io.on('connection', (socket: Socket) => {
  console.log('[server] Socket.IO connection made');
  // const user = createMockSession();
  // console.log(user);

  // socket.emit(BaseEvents.User, { payload: {user: user}, requireNameChange: false });
  // socket.emit(BaseEvents.Ready, {});

  socket.on(BaseEvents.PasscodeRequired, (payload: PasscodeRequiredEvent['payload']) => {
    console.log(`[server] Received ${BaseEvents.PasscodeRequired}`, payload);
    // handle logic here
  });

  socket.on(BaseEvents.PasscodeAccepted, (payload: PasscodeAcceptedEvent['payload']) => {
    console.log(`[server] Received ${BaseEvents.PasscodeAccepted}`, payload);
    socket.emit(BaseEvents.PasscodeAccepted, { success: true });
  });

  socket.on('disconnect', () => {
    console.log("disconnect")
    // console.log(`[server] Socket.IO connection closed for user ${user.id}`);
  });
});

httpServer.listen(PORT, () => {
  console.log(`[server] Socket.IO server running at http://localhost:${PORT}`);
});
