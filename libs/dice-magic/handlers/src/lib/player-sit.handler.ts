import {
    DiceMagicPlayer,
    // DiceMagicStates,
    type IGameContext,
    // PlayerBet,
    type PlayerSitEvent,
} from '@dice-magic/models';

import type { OrbitGameUser } from '@shared/websocket';

export const PlayerSitHandler = (
    user: OrbitGameUser,
    event: PlayerSitEvent,
    context: IGameContext
) => {
    const { seat } = event.payload;

    if (context.players.get(seat)) {
        return {
            status: 401,
            message: 'Seat taken!',
        };
    }

    const otherPlayer = context.players
        .toArray()
        .filter((p) => p.id === user.id);

    const seatLimit = context.settings.tableSeatLimit;

    if (otherPlayer.length === seatLimit) {
        return {
            status: 401,
            message: `Player has reached the table's seat limit`,
        };
    }

    const diceMagicPlayer = DiceMagicPlayer(
        user.id,
        user.getDisplayName(),
        event.payload.seat
    );

    // const settings = user.getSettings();

    // if (
    //     otherPlayer.length &&
    //     context.stateMachine.getState()?.name === BlackJackStates.WaitingForBets
    // ) {
    //     blackJackPlayer.addBet(
    //         otherPlayer[0].getData().bets.base,
    //         PlayerBet.BASE
    //     );

    //     if (settings.replicateSideBets) {
    //         blackJackPlayer.addBet(
    //             otherPlayer[0].getData().bets.perfect_pairs,
    //             PlayerBet.PERFECT_PAIRS
    //         );
    //         blackJackPlayer.addBet(
    //             otherPlayer[0].getData().bets.twenty_one,
    //             PlayerBet.TWENTY_ONE
    //         );
    //     }
    // }

    context.players.add(seat, diceMagicPlayer);
    context.stateMachine.update({ players: context.players.cloneArray() });

    return {
        status: 200,
        message: 'Success',
    };
};
