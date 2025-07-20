import { BaseGameState, UserGameSettings } from "@shared/models";
import { OrbitGameUser } from "./user-server";
import type { EventEmitter } from 'node:events';
import type { Server } from 'socket.io';
import type { IStateMachine } from '@shared/state-machine';

export interface UserServerOptions {
  port: number;
  cors?: string | string[];
  useMockServer: boolean;
}

export interface UserServerContext {
    users: Map<string, OrbitGameUser>;
    emitter: EventEmitter;
    io: Server;
    validEvents: Map<string, string[]>;
    validServices: Set<string>;
    validOutgoingEvents: Map<string, string[]>;
    options: UserServerOptions;
    // game: UserServerGameData;
    defaultGameSettings: UserGameSettings;
    stateMachine?: IStateMachine<BaseGameState, string>;
}