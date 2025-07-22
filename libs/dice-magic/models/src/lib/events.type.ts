import { BaseGameStates, createEvent } from "@shared/events";
import { PlayerData, PlayerPayout } from "./player.type";
import { OrbitGameUser } from "@shared/websocket";

export const DiceMagicStates = {
    // WaitingForPlayerAction: 'WaitingForPlayerAction',
    // WaitingForCards: 'WaitingForCards',
    // WaitingForHitCard: 'WaitingForHitCard',
    // WaitingForSplitCards: 'WaitingForSplitCards',
    // WaitingForDealerCard: 'WaitingForDealerCard',
    // WaitingForInsurance: 'WaitingForInsurance',
    // ShoeChange: 'ShoeChange',
    // PostGameRoundState: 'PostGameRoundState',
    ...BaseGameStates,
};

export type DiceMagicStates = keyof typeof DiceMagicStates | string;;


export enum DiceMagicEvents {
  UserJoin = 'UserJoin',
  UserLeave = 'UserLeave',
  PlayerBet = 'PlayerBet',
  RoundStart = 'RoundStart',
  RoundEnd = 'RoundEnd',
  Players = 'Players', // broadcast to all players
  PlayerSit = 'PlayerSit',
  PlayerLeaveSeat = 'PlayerLeaveSeat',
  GameState = 'GameState',
}

export const Events = Object.assign({}, DiceMagicEvents);

// Game State Event
export const createGameStateEvent = (
    previousState: DiceMagicStates,
    nextState: DiceMagicStates,
    seatId: number,
    hand: number
) => {
    return createEvent(Events.GameState, {
        previous_state: previousState,
        next_state: nextState,
        seat_id: seatId,
        hand,
    });
};

export type GameStateEvent = ReturnType<typeof createGameStateEvent>[1];

// RoundStartEvent
export const createRoundStartEvent = (
    roundId: string,
    bet_amounts: number[],
    players: Map<string, OrbitGameUser>,//PlayerData[],
    start_time: number | null,
    duration: number | null
) => {
    return createEvent(Events.RoundStart, {
        round_id: roundId,
        players,
        bet_amounts,
        start_time,
        duration,
    });
};

export type RoundStartEvent = ReturnType<typeof createRoundStartEvent>[1];

// RoundEndEvent
export const createRoundEndEvent = (
    roundId: string,
    totalWon: number,
    payouts: PlayerPayout[]
) => {
    return createEvent(Events.RoundEnd, {
        round_id: roundId,
        total_won: totalWon,
        payouts,
    });
};

export type RoundEndEvent = ReturnType<typeof createRoundEndEvent>[1];

// Player Event - AKA broadcast
export const createPlayersEvent = (
    players: PlayerData[],
    dealer: PlayerData,
    gameLeader: string
) => {
    return createEvent(Events.Players, {
        players: players.sort((a, b) => a.seat - b.seat),
        dealer,
        gameLeader,
    });
};

export type PlayersEvent = ReturnType<typeof createPlayersEvent>[1];

// PlayerSitEvent
export const createPlayerSitEvent = (seat: number) => {
    return createEvent(Events.PlayerSit, { seat });
};

export type PlayerSitEvent = ReturnType<typeof createPlayerSitEvent>[1];

export const createPlayerLeaveSeatEvent = (seat: number) => {
    return createEvent(Events.PlayerLeaveSeat, { seat });
};

export type PlayerLeaveSeatEvent = ReturnType<
    typeof createPlayerLeaveSeatEvent
>[1];