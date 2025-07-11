import { BaseGameStates, createEvent } from '@shared/events';
import { PlayerData } from '../player.type';
import { Events } from '../events.type';

export const DiceMagicStates = {
    WaitingForPlayerAction: 'WaitingForPlayerAction',
    // WaitingForCards: 'WaitingForCards',
    // WaitingForHitCard: 'WaitingForHitCard',
    // WaitingForSplitCards: 'WaitingForSplitCards',
    // WaitingForDealerCard: 'WaitingForDealerCard',
    // WaitingForInsurance: 'WaitingForInsurance',
    // ShoeChange: 'ShoeChange',
    PostGameRoundState: 'PostGameRoundState',
    ...BaseGameStates,
};

export type DiceMagicStates = keyof typeof DiceMagicStates | string;

export const createPlayersEvent = (
    players: PlayerData[],
    // dealer: PlayerData,
    // gameLeader: string
) => {
    return createEvent(Events.Players, {
        players: players.sort((a, b) => a.seat - b.seat),
        // dealer,
        // gameLeader,
    });
};

export type PlayersEvent = ReturnType<typeof createPlayersEvent>[1];