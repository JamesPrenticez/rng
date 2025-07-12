export const PlayerSitHandler = (
    user: AnimoGameUser,
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

    const blackJackPlayer = BlackJackPlayer(
        user.id,
        user.getDisplayName(),
        event.payload.seat
    );

    const settings = user.getSettings();

    if (
        otherPlayer.length &&
        context.stateMachine.getState()?.name === BlackJackStates.WaitingForBets
    ) {
        blackJackPlayer.addBet(
            otherPlayer[0].getData().bets.base,
            PlayerBet.BASE
        );

        if (settings.replicateSideBets) {
            blackJackPlayer.addBet(
                otherPlayer[0].getData().bets.perfect_pairs,
                PlayerBet.PERFECT_PAIRS
            );
            blackJackPlayer.addBet(
                otherPlayer[0].getData().bets.twenty_one,
                PlayerBet.TWENTY_ONE
            );
        }
    }

    context.players.add(seat, blackJackPlayer);
    context.stateMachine.update({ players: context.players.cloneArray() });

    return {
        status: 200,
        message: 'Success',
    };
};