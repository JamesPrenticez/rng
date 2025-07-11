import type { Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { createMockUser, createMockUserSessionToken } from '@shared/utils';

export function mockUserMiddleware() {
  return (socket: Socket, next: (err?: Error) => void) => {
    socket.data.type = 'mock';

    const sessionId = uuidv4();

    const user = createMockUser({
      username: 'Guest',
      sessionId,
      balance: 1000,
      currency: 'USD',
    });

    const sessionToken = createMockUserSessionToken(
      user.username,
      user.balance,
      user.currency
    );

    socket.data.user = user;
    socket.data.sessionToken = sessionToken;

    next();
  };
}

export function userMiddleware() {
  return (socket: Socket, next: (err?: Error) => void) => {
    socket.data.type = 'user';

    // Here you'd usually parse token from headers, validate, and set socket.data.user
    // For now, just leave it empty
    next();
  };
}