export type PlayerData = {
    id: string;
    name: string;
    seat: number;
//     scores: IPlayerScore[];
//     bets: IPlayerBets;
//     betBehinds: { user_id: string; amount: number }[];
//     chips: {
//         insurance: number;
//         double: number;
//         split: number;
//     };
//     winAmounts: IPlayerWins;
//     winStreak: number;
//     lastAction: PlayerAction | null;
//     lastActionTime: number | null;
//     lastActions: [PlayerAction | null, PlayerAction | null];
//     lastActionTimes: [number | null, number | null];
//     isFinished: boolean;
//     isPlaying: boolean;
//     cards: ICard[][];
//     state: PlayerState;
//     states: [PlayerState, PlayerState];
};

export interface IPlayerRoll {
    roll: number;
    distance: number;
}

export interface IPlayerScore {
    score: number;
}

export interface IDiceMagicPlayerState {
    roll: number; // All of players cards
    distance: number;
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

export interface DiceMagicPlayerState extends IDiceMagicPlayerState {
    id: string;
    name: string;
    seat: number;
}

export type IDiceMagicPlayer = {
    id: string;
    name: string;
    seat: number;

    // cards: () => IPlayerCard[];
    // actions: () => PlayerAction[];
    // actionsForHand: (hand: number) => PlayerAction[];
    // isPlaying: () => boolean;
    // isFinished: () => boolean;
    // hasInsurance: () => boolean;
    // canSplit: () => boolean;
    // hasSplit: () => boolean;
    // hasDoubled: () => boolean;
    // isLockedIn: () => boolean;
    // lockIn: () => void;
    // score: (value: number) => IPlayerScore;

    // addCard: (card: IPlayerCard) => void;
    // addCards: (cards: IPlayerCard[]) => void;
    // addAction: (action: PlayerAction) => void;
    // addBet: (amount: number, type: PlayerBet, user_id?: string) => void;
    // clearCards: () => void;
    // clearState: () => void;
    // cardsForHand: (hand: number) => ICard[];
    // getCurrentHand: () => number;
    // getPlayerActions: (dealerCard: ICard) => PlayerAction[];
    clone: () => IDiceMagicPlayer;
    // getData: () => BlackJackPlayerState;
    // setData: (data: Partial<IBlackJackPlayerState>) => void;
    // setDisconnected: (isDisconnected: boolean) => void;
    // setHasInsurance: (hasInsurance: boolean) => void;
    // toData: () => PlayerData;
    // updatePlayerState: (newState: PlayerState, hand?: number) => void;
    // incrementWinStreak: () => void;
    // clearWinStreak: () => void;
};