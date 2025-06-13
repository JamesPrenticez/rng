import { Socket } from 'socket.io';
import { BaseEvents, PasscodeAcceptedEvent } from '@shared/events';

export function handlePasscodeAccepted(socket: Socket) {
  socket.on(BaseEvents.PasscodeAccepted, (payload: PasscodeAcceptedEvent['payload']) => {
    console.log(`[server] Received ${BaseEvents.PasscodeAccepted}`, payload);
    socket.emit(BaseEvents.PasscodeAccepted, { success: true });
  });
}
