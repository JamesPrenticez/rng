import { MockOrbitUser, OrbitPublicUserData, OrbitUser, OrbitUserData, UserGameSettings } from '@shared/models';
import { v5 as uuidv5 } from 'uuid';

const MOCK_NAMESPACE = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';

export const getDisplayName = (userData: MockOrbitUser) => {
  return userData.username ?? ""
};

export const createMockUser = <T>(
  userData: MockOrbitUser,
  settings: UserGameSettings,
  socket: T,
): OrbitUser<T> => {

  const context = {
    id: uuidv5(userData.username, MOCK_NAMESPACE),
    username: userData.username,
    name: "",
    source: "Mock",
    sessionId: userData.sessionId
  };

  const user: OrbitUser<T> = {
    settings,
    id: context.id,
    username: context.username,
    name: context.name,
    source: context.source,
    sessionId: context.sessionId,
    balance: 10000,
    currency: 'USD',
    getDisplayName: () => getDisplayName(userData),
    toData: () => ({
      id: context.id,
      username: userData.username,
      balance: 10000,
      name: "",
      source: "mock",
    }),
    socket
  };
  
  return user;
};