import { createEvent } from '@shared/events';

export enum DiceMagicEvents {
  UserJoin = 'UserJoin',
  UserLeave = 'UserLeave',
  PlayerBet = 'PlayerBet',
  PlayerSit = 'PlayerSit'
}


export const Events = Object.assign({}, DiceMagicEvents);

// Player Sit Event
export const createPlayerSitEvent = (seat: number) => {
    return createEvent(Events.PlayerSit, { seat });
};

export type PlayerSitEvent = ReturnType<typeof createPlayerSitEvent>[1];