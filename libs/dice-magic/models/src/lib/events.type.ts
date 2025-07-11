import { createEvent } from '@shared/events';

export enum DiceMagicEvents {
  UserJoin = 'UserJoin',
  UserLeave = 'UserLeave',
  Players = 'Players',
  PlayerBet = 'PlayerBet',
  PlayerSit = 'PlayerSit',
  PlayerLeaveSeat = 'PlayerLeaveSeat'
}


export const Events = Object.assign({}, DiceMagicEvents);

// TO SERVER EVENTS
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