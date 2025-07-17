import {
    DiceMagicStates,
    type IGameContext,
    type PlayerLeaveSeatEvent,
} from '@dice-magic/models';

import type { OrbitGameUser } from '@shared/websocket';

export const PlayerLeaveSeatHandler = (
    user: OrbitGameUser,
    event: PlayerLeaveSeatEvent,
    context: IGameContext
) => {
    const { seat } = event.payload;

    // const player = context.players.get(seat);

    // if (player?.id !== user.id) {
    //     return {
    //         status: 401,
    //         message: "Can't leave seat you are not sitting in",
    //     };
    // }

    // Can't Leave In the middle of a round
    // if (
    //     player.getData().bets.base > 0 &&
    //     context.stateMachine.getState()?.name !== DiceMagicStates.WaitingForBets
    // ) {
    //     return {
    //         status: 401,
    //         message: 'Cannot leave seat in middle of game',
    //     };
    // }

    context.players.delete(seat);

    context.stateMachine.update({ players: context.players.cloneArray() });

    return {
        status: 200,
        message: 'Success',
    };
};
