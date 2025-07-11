import type { Server, Socket } from 'socket.io';
import { OrbitGameUser } from './user-server';
import type { EventEmitter } from 'node:events';
import { IStateMachine } from "@shared/state-machine"
import { BaseGameState } from "@shared/game-state-logger"

export interface OrbitSocket extends Socket {
    data: {
        user: OrbitGameUser;
        // service: ServiceToken;
        type: 'user'; // | 'service';
    };
}

export interface UserServerOptions {
    port: number;
    // rgsApiHost: string;
    // gameHistoryHost: string;
    // userSettingsHost?: string;
    useMockServer: boolean;
    disableEvents?: boolean;
    cors?: string | string[];
    // privateKey: string;
    // publicKey?: string;
    // redisDb?: string;
}

export interface UserServerContext {
    users: Map<string, OrbitGameUser>;
    validEvents: Map<string, string[]>;
    validServices: Set<string>;
    validOutgoingEvents: Map<string, string[]>;
    emitter: EventEmitter;
    options: UserServerOptions;
    io: Server;
    // game: UserServerGameData;
    // defaultGameSettings: UserGameSettings;
    stateMachine?: IStateMachine<BaseGameState, string>;
    // log: {
    //     action: UserActionLogger;
    //     state: GameStateLogger;
    //     event?: ReturnType<typeof publishRedisEvent>;
    // };
    // privateGamePasscode: string[];
}
