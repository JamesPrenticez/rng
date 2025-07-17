import type { OrbitUserData } from '@shared/models';
import { v4 as uuidv4 } from 'uuid';

export const BaseGameStates = {
    Starting: 'Starting',
    Paused: 'Paused',
    Maintenance: 'Maintenance',
    Scheduled: 'Scheduled',
    Unknown: 'Unknown',
    Offline: 'Offline',
    WaitingForDealer: 'WaitingForDealer',
    WaitingForPlayers: 'WaitingForPlayers',
    WaitingForBets: 'WaitingForBets',
    FinishedBetting: 'FinishedBetting',
    PlayerEndTurn: 'PlayerEndTurn',
    RoundEnd: 'RoundEnd',
};

export type BaseGameStates = keyof typeof BaseGameStates;

export enum FromServerEvents {
  // ChatMessage = 'ChatMessage',
  // ChatMessageDeleted = 'ChatMessageDeleted',
  // DuplicateSession = 'DuplicateSession',
  // Error = 'Error',
  Response = 'Response',
  User = 'User',
  // ServerInfo = 'ServerInfo',
  // WaitingForCard = 'WaitingForCard',
  // WaitingForWheel = 'WaitingForWheel',
  // SettingPasscode = 'SettingPasscode', // Premium game server is setting a game enter passcode on the User Server
  // GameSchedule = 'GameSchedule',

  RoundStart = 'RoundStart',
  RoundEnd = 'RoundEnd',

  GameState = 'GameState',
}

export enum ToServerEvents {
  // CardUpdate = 'CardUpdate', // Single Card
  // CameraChange = 'CameraChange',
  // WheelUpdate = 'WheelUpdate',
  // RedDeckSplitCard = 'RedDeckSplitCard',
}

export enum FromUserEvents {
  // SendChatMessage = 'SendChatMessage',
  // UserSettings = 'UserSettings',
  PasscodeRequest = 'PasscodeRequest', // User responds with entering a passcode
  // GameHistoryRequest = 'GameHistoryRequest',
  // RoundHistoryDetailRequest = 'RoundHistoryDetailRequest',
  // GetUserSettingsRequest = 'GetUserSettingsRequest',
  // AddUserSettingRequest = 'AddUserSettingRequest',
  // EditUserSettingRequest = 'EditUserSettingRequest',
  // DeleteUserSettingRequest = 'DeleteUserSettingRequest',
  // UpdateDisplayNameRequest = 'UpdateDisplayNameRequest',
}

export enum InternalEvents {
  UserJoin = 'UserJoin',
  UserDisconnect = 'UserDisconnect',
  UsersUpdate = 'UsersUpdate',

  Ready = 'Ready',
  // DeleteChatMessage = 'DeleteChatMessage',
  // HostChange = 'HostChange',
}

export enum ToUserEvents {
  PasscodeRequired = 'PasscodeRequired',
  PasscodeIncorrect = 'PasscodeIncorrect',
  PasscodeAccepted = 'PasscodeAccepted',
  // GameLeaderSet = 'GameLeaderSet',
  // AdditionalFundsRequired = 'AdditionalFundsRequired',
  // HasGameLeaderAddedFunds = 'HasGameLeaderAddedFunds',
  // GameInfo = 'GameInfo',
}

export const BaseEvents = {
  ...FromServerEvents,
  ...ToServerEvents,
  ...FromUserEvents,
  ...ToUserEvents,
  ...InternalEvents
};

export type BaseEvents = keyof typeof BaseEvents;

export type IBaseEvent<T, D = unknown> = [
  T,
  { event: T; message_id: string; payload: D; timestamp: number },
];

export const createEvent = <T, D = unknown>(
  type: T,
  data: D
): IBaseEvent<T, D> => {
  const uuid = uuidv4();
  return [
      type,
      { event: type, message_id: uuid, payload: data, timestamp: Date.now() },
  ];
};

export type ResponseMessage<T = undefined> = {
    status: number;
    message: string;
    data?: T;
};

export type ResponseEvent = IBaseEvent<'response', ResponseMessage>[1];

export const createResponseEvent = <T = undefined>(
    messageId: string,
    response: ResponseMessage<T>
) => {
    const ev = createEvent(BaseEvents.Response, response);
    ev[1].message_id = messageId;

    return ev;
};

export type _ResponseEvent = ReturnType<typeof createResponseEvent>[1];

// USER - READY
export const createReadyEvent = () => {
    return createEvent(BaseEvents.Ready, {});
};

export type ReadyEvent = ReturnType<typeof createReadyEvent>[1];

// USER - JOIN
export const createUserJoinEvent = (user: OrbitUserData) => {
  return createEvent(BaseEvents.UserJoin, { user });
};

export type UserJoinEvent = ReturnType<typeof createUserJoinEvent>[1];

// USER - UPDATE
export const createUsersUpdateEvent = (users: OrbitUserData[]) => {
  return createEvent(BaseEvents.UsersUpdate, users);
};

export type UsersUpdateEvent = ReturnType<typeof createUsersUpdateEvent>[1];

export const createUserEvent = (
  user: OrbitUserData,
  requireNameChange?: boolean
) => {
  return createEvent(BaseEvents.User, { user, requireNameChange });
};

export type UserEvent = ReturnType<typeof createUserEvent>[1];

// ROUND DATA
export interface RoundData {
  roundId: string;
  host: string;
  remainingBetDuration?: number;
}

export const createRoundEvent = (event: BaseEvents, data: RoundData) => {
    return createEvent(event, data);
};

export const createRoundStartEvent = (data: RoundData) => {
    return createRoundEvent(BaseEvents.RoundStart, data);
};

export const createRoundEndEvent = (data: RoundData) => {
    return createRoundEvent(BaseEvents.RoundEnd, data);
};

export type RoundStartEvent = ReturnType<typeof createRoundStartEvent>[1];
export type RoundEndEvent = ReturnType<typeof createRoundEndEvent>[1];

export interface PlayerPayout {
    userId?: string;
    name: string;
    amount: number;
}