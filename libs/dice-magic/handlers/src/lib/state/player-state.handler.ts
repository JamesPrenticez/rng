// import { DiceMagicStates, PlayerState } from '@dice-magic/models';
import type { StateHandler } from '../types';
// import { getNextPlayer } from './blackjack.state';

export const PlayerStateHandler: StateHandler = async (context, _, newState) => {
  // if (newState !== BlackJackStates.WaitingForPlayerAction) return false;

  // const player = getNextPlayer(context.stateMachine?.getData().players);

  // context.players.forEach(p => {
  //   if (player && p.seat === player.seat) {
  //     p.updatePlayerState(PlayerState.TURN, 0);
  //   } else {
  //     p.updatePlayerState(
  //       p.isFinished() ? PlayerState.FINISHED : PlayerState.WAITING
  //     );
  //   }
  // });

  context.broadcastPlayers();
  return true;
};
