import { Socket } from 'socket.io';
import { BaseEvents, PasscodeRequiredEvent } from '@shared/events';

export function handlePasscodeRequired(socket: Socket) {
  socket.on(BaseEvents.PasscodeRequired, (payload: PasscodeRequiredEvent['payload']) => {
    console.log(`[server] Received ${BaseEvents.PasscodeRequired}`, payload);
    // your logic here
  });
}