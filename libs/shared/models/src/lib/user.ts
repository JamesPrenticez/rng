export interface User {
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

export interface MockSessionData {
    type: string;
}

export interface MockUserData extends MockSessionData {
    username: string;
    credits: number;
    currency: string;
    nicknamePrompt?: boolean;
}
