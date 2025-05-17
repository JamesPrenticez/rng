import type { User } from '@shared/models';
import { v4 as uuidv4 } from 'uuid';

export enum FromServerEvents {
  // ChatMessage = 'ChatMessage',
  // ChatMessageDeleted = 'ChatMessageDeleted',
  // DuplicateSession = 'DuplicateSession',
  // Error = 'Error',
  // Response = 'Response',
  User = 'User',
  // ServerInfo = 'ServerInfo',
  // WaitingForCard = 'WaitingForCard',
  // WaitingForWheel = 'WaitingForWheel',
  // SettingPasscode = 'SettingPasscode', // Premium game server is setting a game enter passcode on the User Server
  // GameSchedule = 'GameSchedule',
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
  // UserJoin = 'UserJoin',
  // UserDisconnect = 'UserDisconnect',
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

export const createReadyEvent = () => {
    return createEvent(BaseEvents.Ready, {});
};

export type ReadyEvent = ReturnType<typeof createReadyEvent>[1];

export const createPasscodeRequiredEvent = () => {
  return createEvent(BaseEvents.PasscodeRequired, {});
};

export type PasscodeRequiredEvent = ReturnType<
  typeof createPasscodeRequiredEvent
>[1];

export const createPasscodeIncorrectEvent = (message: string) => {
  return createEvent(BaseEvents.PasscodeIncorrect, { message });
};

export type PasscodeIncorrectEvent = ReturnType<
  typeof createPasscodeIncorrectEvent
>[1];

export const createPasscodeAcceptedEvent = () => {
  return createEvent(BaseEvents.PasscodeAccepted, {});
};

export type PasscodeAcceptedEvent = ReturnType<
  typeof createPasscodeAcceptedEvent
>[1];

export const createPasscodeRequestEvent = (passcode: string) => {
  return createEvent(BaseEvents.PasscodeRequest, { passcode });
};

export type PasscodeRequestEvent = ReturnType<
  typeof createPasscodeRequestEvent
>[1];

export const createUserEvent = (
  user: User,
  requireNameChange?: boolean
) => {
  return createEvent(BaseEvents.User, { user, requireNameChange });
};

export type UserEvent = ReturnType<typeof createUserEvent>[1];