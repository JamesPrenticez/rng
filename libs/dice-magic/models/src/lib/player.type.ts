export enum PlayerBet {
    BASE = 'base',
    // BEHIND = 'behind',
    // PERFECT_PAIRS = 'perfect_pairs',
    // TWENTY_ONE = 'twenty_one',
    // INSURANCE = 'insurance',
}

export type PlayerData = {
    user_id: string;
    name: string;
    seat: number;
    // scores: IPlayerScore[];
    // bets: IPlayerBets;
    // betBehinds: { user_id: string; amount: number }[];
    // chips: {
    //     insurance: number;
    //     double: number;
    //     split: number;
    // };
    // winAmounts: IPlayerWins;
    // winStreak: number;
    // lastAction: PlayerAction | null;
    // lastActionTime: number | null;
    // lastActions: [PlayerAction | null, PlayerAction | null];
    // lastActionTimes: [number | null, number | null];
    // isFinished: boolean;
    // isPlaying: boolean;
    // cards: ICard[][];
    // state: PlayerState;
    // states: [PlayerState, PlayerState];
};

export interface PlayerPayout {
    player_id: string;
    seat: number;
    hand: number;
    type: PlayerBet;
    bet: number;
    payout: number;
    multiplier: number;
}

export interface ICard {
    id: number;
    uuid: string;
    face: 'diamond' | 'spade' | 'club' | 'heart';
    value: number;
}

export interface IPlayerCard extends ICard {
    seat_id: number;
    hand: number;
}

export type IDiceMagicPlayer = {
    id: string;
    name: string;
    seat: number;

    cards: () => IPlayerCard[];
    clone: () => IDiceMagicPlayer;
    toData: () => PlayerData;
}

export interface IDiceMagicPlayerState {
    cards: IPlayerCard[]; // All of players cards
    // firstCards: IPlayerCard[]; // Players first 2 cards used for side bets
    // handActions: [PlayerAction[], PlayerAction[]]; // Actions played for each hand
    // bets: IPlayerBets; // Amounts for each bet type
    // winAmounts: IPlayerWins; // Win amounts for base and side bets
    // behindBets: IBetBehind[]; // All users who bet behind on this seat
    // sideBets: {
    //     // Side bet win reason
    //     perfectPairs: PerfectPairs;
    //     twentyOne: TwentyOnePlus;
    // };
    // isDisconnected: boolean; // If their websocket is disconnected
    // winStreak: number; // Total wins in a row for this seat
    // state: [PlayerState, PlayerState]; // Current state of player for both hands
    // lockedIn: boolean; // If the players bet is locked in
    // lastActionTimes: [number | null, number | null]; // Last time the player made an action
    // hasInsurance: boolean;
}