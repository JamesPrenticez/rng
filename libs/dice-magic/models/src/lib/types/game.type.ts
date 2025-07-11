import { RoundEndEvent, RoundStartEvent } from "@shared/events";
import type { IStateMachine } from '@shared/state-machine';
import { BaseGameState } from "@shared/game/game-state-logger";
import { IDiceMagicPlayer } from "../player.type";
import { DiceMagicStates } from "./events.type";

export interface IDiceMagicPlayers {
    add: (seat: number, data: IDiceMagicPlayer) => void;
    get: (seat: number) => IDiceMagicPlayer | null;
    delete: (seat: number) => void;
    toArray: () => IDiceMagicPlayer[];
    cloneArray: () => IDiceMagicPlayer[];
    forEach: (
        callbackFn: (player: IDiceMagicPlayer, seat: number) => void
    ) => void;
}

export type RoundData = Partial<
    RoundStartEvent['payload'] & RoundEndEvent['payload']
>;

export interface DiceMagicState extends BaseGameState {
    roundId: string;
    // cards: ICard[];
    players: IDiceMagicPlayer[];
    dealer: IDiceMagicPlayer | null;
    timer: number | null;
    roundStart: number | null;
    // redDeckSplitCard: boolean;
    startTime: number | null;
    endTime: number | null;
}

export interface GameSettings {
    name: string;
    // tableLimits: number[];
    tableSeatLimit: number;
    // playerBetDuration: number;
    // playerTurnDuration: number;
    // insuranceDuration: number;
    // minBet: number;
    // maxBet: number;
    // minSideBet: number;
    // maxSideBet: number;
    // gameEndDelay: number;
    // gameConfig: BlackjackConfigFlags;
    // videoStreamData?: VideoStreamData;
}

export interface IGameContext {
    players: IDiceMagicPlayers
    stateMachine: IStateMachine<DiceMagicState, DiceMagicStates>;
    // userServer: IUserServer;
    // intervalTimer: ReturnType<typeof setInterval> | null;
    // broadcastPlayers: () => void;
    // leaderRank: string[];
    // kickedPlayers: KickedPlayers;
    // playersToBeKicked: string[];
    // featureTimeouts: FeatureTimeOuts;
    settings: GameSettings;
}
