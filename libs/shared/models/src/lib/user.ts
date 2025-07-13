export interface OrbitUserData {
    id: string;
    username: string;
    name: string;
    source: string;
    sessionId: string;

    balance: number;
    currency: string;

    flags?: string;

    language?: string;
    country?: string;
}


export interface UserGameSettings {
    [key: string]: unknown;
}

export type OrbitUser<T> = {
    socket: T;
    settings: UserGameSettings;
} & OrbitUserData;

// ================================================
// This is from the Host / Auth Provider
// ================================================
export interface MockSessionData {
    type: string;
}

export interface MockUserData extends MockSessionData {
    username: string;
    credits: number;
    currency: string;
    nicknamePrompt?: boolean;
}

