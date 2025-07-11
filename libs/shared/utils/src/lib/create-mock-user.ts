import { OrbitUserData } from '@shared/models';
import { v4 as uuidv4 } from 'uuid';
interface CreateMockUserOptions {
  username?: string;
  balance?: number;
  currency?: string;
  sessionId: string;
  nicknamePrompt?: boolean;
}

export const createMockUser = (
  options: CreateMockUserOptions,
): OrbitUserData => {
  return {
    id: uuidv4(),
    username: options.username || 'Guest',
    name: "mock",
    sessionId: options.sessionId,
    balance: 1000,
    currency: 'USD', 
  };
};
