export enum GameStatus {
    Online = 'online',
    Scheduled = 'scheduled',
    Maintenance = 'maintenance',
    Paused = 'paused', // Paused immediately
    Pause = 'pause', // Pause at end of round
    Offline = 'offline',
}

export interface BaseGameState {
    roundId: string;
    totalUsers: number;
    totalPlayers: number;
    totalBet: number;
    totalWon: number;
    status: GameStatus;
    // schedule?: GameSchedule[];
    currentHost?: string;
    hostName?: string;
    statusMessage?: {
        title: string;
        message: string;
    };
}