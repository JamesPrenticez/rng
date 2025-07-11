export interface UserGameSettings {
  [key: string]: unknown;
}

export interface MockSessionData {
  type: string;
}

export interface OrbitUserData {
  id: string;
  username: string;
  name: string;
  sessionId: string;

  balance: number;
  currency: string;

  flags?: string;

  language?: string;
  country?: string;
}

export interface IOrbitUserFunctions {
  getDisplayName(): string;
  updateDisplayName(
    displayName: string
  ): Promise<{ success: boolean; error?: string }>;
  // Settings
  getSettings(): UserGameSettings;
  updateSettings(data: Partial<UserGameSettings>): void;
}

export type OrbitUser<T> = {
  socket: T;
  settings: UserGameSettings;
} & OrbitUserData &
  IOrbitUserFunctions;
