// middleware.ts
import type { ExtendedError } from 'socket.io/dist/namespace';
import type { Socket } from 'socket.io';
import { BaseEvents } from '@shared/events';

import { createMockUser } from "@shared/utils"

import type {
  UserGameSettings,
  MockSessionData,
  MockUserData,
} from '@shared/models';

export const mockUserMiddleware =
  (gameUuid: string, gameSettings: UserGameSettings) =>
  async (socket: Socket, next: (err?: ExtendedError) => void) => {
    try {
      const raw = socket.handshake.auth.session
        ?? socket.handshake.headers['x-session'];

      let user = undefined;

      if (raw) {
        try {
          const data = JSON.parse(
            Buffer.from(raw, 'base64').toString(),
          ) as MockSessionData;

          if (data.type === 'user') {
            const u = data as MockUserData;

            user = createMockUser(
              {
                username: u.username,
                balance: u.credits,
                currency: u.currency,
                sessionId: raw,
                nicknamePrompt: u.nicknamePrompt,
              },
              gameUuid,
              gameSettings,
            );
          }
        } catch {
          /* ignore parse errors and fall through */
        }
      }

      // if (!user) {
      //   const session = createMockSession();
      //   user = createMockAnimoUser(
      //     { sessionId: session },
      //     gameUuid,
      //     gameSettings,
      //   );
      // }

      socket.data.user = user;
      socket.emit(BaseEvents.User, { payload: { user }, requireNameChange: false });
      next();
    } catch (e) {
      next(e as ExtendedError);
    }
  };
