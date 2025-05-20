import { Server, Socket } from 'socket.io';
import { createServer } from 'http';
import { createMockSession } from '@shared/websocket';
import { BaseEvents, PasscodeAcceptedEvent, PasscodeRequiredEvent } from '@shared/events';

const PORT = 3201;

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket: Socket) => {
  console.log('[server] Socket.IO connection made');
  const user = createMockSession();
  // console.log(user);

  socket.emit(BaseEvents.User, { payload: {user: user}, requireNameChange: false });
  socket.emit(BaseEvents.Ready, {});

  socket.on(BaseEvents.PasscodeRequired, (payload: PasscodeRequiredEvent['payload']) => {
    console.log(`[server] Received ${BaseEvents.PasscodeRequired}`, payload);
    // handle logic here
  });

  socket.on(BaseEvents.PasscodeAccepted, (payload: PasscodeAcceptedEvent['payload']) => {
    console.log(`[server] Received ${BaseEvents.PasscodeAccepted}`, payload);
    socket.emit(BaseEvents.PasscodeAccepted, { success: true });
  });

  socket.on('disconnect', () => {
    console.log(`[server] Socket.IO connection closed for user ${user.id}`);
  });
});

httpServer.listen(PORT, () => {
  console.log(`[server] Socket.IO server running at http://localhost:${PORT}`);
});
