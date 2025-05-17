import { WebSocketServer } from 'ws';
import { createMockSession } from '@shared/websocket';
import { BaseEvents } from '@shared/events';

const PORT = 5201;
const wss = new WebSocketServer({ port: PORT });

wss.on('connection', (ws) => {
  console.log('[server] connection made');
  const user = createMockSession();
  console.log(user)

  const send = (event: string, payload: any) => {
    ws.send(JSON.stringify({ event, payload }));
  };

  // Send session info
  send(BaseEvents.User, { user, requireNameChange: false });

  // Send "ready" if needed
  send(BaseEvents.Ready, {});

  ws.on('message', (msg) => {
    try {
      const data = JSON.parse(msg.toString());
      console.log(`[server] Received: ${data.event}`, data.payload);

      if (data.event === BaseEvents.PasscodeRequired) {
        // do something
      }

      if (data.event === BaseEvents.PasscodeAccepted) {
        send(BaseEvents.PasscodeAccepted, { success: true });
      }

    } catch (err) {
      console.error('[server] Failed to parse message', err);
    }
  });

  ws.on('close', () => {
    console.log(`[server] Connection closed for user ${user.id}`);
  });
});

console.log(`[server] WebSocket server running on ws://localhost:${PORT}`);
