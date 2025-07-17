import { BaseGameState } from "@shared/models"
import { ICard, IDiceMagicPlayer } from "./player.type";
import { IStateMachine } from "@shared/state-machine"
import { DiceMagicStates } from "./events.type";
import { IUserServer } from "@shared/websocket"

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

export interface DiceMagicState extends BaseGameState {
    roundId: string;
    cards: ICard[];
    players: IDiceMagicPlayer[];
    dealer: IDiceMagicPlayer | null;
    timer: number | null;
    roundStart: number | null;
    startTime: number | null;
    endTime: number | null;
}


export interface IDiceMagicSettings {
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
    players: IDiceMagicPlayers;
    stateMachine: IStateMachine<DiceMagicState, DiceMagicStates>;
    userServer: IUserServer;
    intervalTimer: ReturnType<typeof setInterval> | null;
    // broadcastPlayers: () => void;
    // leaderRank: string[];
    // kickedPlayers: KickedPlayers;
    // playersToBeKicked: string[];
    // featureTimeouts: FeatureTimeOuts;
    settings: IDiceMagicSettings;
}
