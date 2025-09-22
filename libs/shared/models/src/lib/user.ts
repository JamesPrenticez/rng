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

export type OrbitPublicUserData = Omit<OrbitUserData, 'sessionId' | 'flags' | 'currency'>

export interface IOrbitUserFunctions {
    // // Transactions / bets
    // getBalance(): ResultPromise<UserBalanceResponse>;
    // addBet(bet: UserBet): ResultPromise<UserBetResponse>;
    // addBets(bets: UserBet[]): ResultPromise<UserBetResponse>;
    // addWin(win: UserWin): ResultPromise<UserWinResponse>;
    // addWins(wins: UserWin[]): ResultPromise<UserWinResponse>;

    // // Game History
    // addGameHistoryRound: (
    //     round: NewUserRoundStats,
    //     bets: NewUserBetStats[]
    // ) => Promise<{ round: UserRoundStats; bets: UserBetStats[] } | null>;
    // addGameHistoryBet: (bet: NewUserBetStats) => Promise<UserBetStats | null>;

    // getGameHistory: (options: {
    //     from?: Date;
    //     to?: Date;
    //     limit?: number;
    //     page?: number;
    // }) => Promise<UserRoundStats[]>;

    // getBetDetail: (roundId: string) => Promise<UserBetStats[]>;

    // // User
    // updateDisplayName(
    //     displayName: string
    // ): Promise<{ success: boolean; error?: string }>;
    getDisplayName(): string;

    // updateData(data: Partial<AnimoUserData>): void;

    toData(internal: false): OrbitPublicUserData;
    // toData(internal: true): AnimoUserData;
    // toData(internal: boolean): AnimoPublicUserData | AnimoPublicUserData;
    // // Settings
    // getSettings(): UserGameSettings;
    // updateSettings(data: Partial<UserGameSettings>): void;

    // // User Settings
    // getUserSettings: (
    //     userId: UserSetting['userId'],
    //     settingType?: UserSetting['settingType'],
    //     gameType?: UserSetting['gameType']
    // ) => Promise<UserSetting[] | null>;
    // addUserSetting: (data: NewUserSetting) => Promise<UserSetting | null>;
    // updateUserSetting: (
    //     id: UserSetting['id'],
    //     userId: UserSetting['userId'],
    //     data: Partial<NewUserSetting>
    // ) => Promise<UserSetting | null>;
    // deleteUserSetting: (
    //     id: UserSetting['id'],
    //     userId: UserSetting['userId']
    // ) => Promise<boolean>;

    // getSession(): GameUserSession;

    // checkMessage: (
    //     message: string,
    //     messageSettings: MessageSettings
    // ) => { message: string; blocked: boolean; blockReason: ChatBlockReasons };
    // updateLastSentTime: () => void;
    // lastBalanceUpdate: () => number;
}


export interface UserGameSettings {
    [key: string]: unknown;
}

export type OrbitUser<T> = {
    socket: T;
    settings: UserGameSettings;
} & OrbitUserData & IOrbitUserFunctions;

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

export type MockOrbitUser = Pick<
    OrbitUserData,
    'username' | 'balance' | 'currency' | 'sessionId'
> & {
    nicknamePrompt?: boolean;
};