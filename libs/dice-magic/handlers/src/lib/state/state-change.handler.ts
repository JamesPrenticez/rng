import {
  createGameStateEvent,
  DiceMagicStates,
  IGameContext,
} from '@dice-magic/models';
import { PlayerStateHandler } from './player-state.handler';

const Handlers = [PlayerStateHandler];

export const StateChangeHandler = (context: IGameContext) => {
  return async (prevState: DiceMagicStates, newState: DiceMagicStates) => {
    console.log("asdfjasgdkjhjfajhs")
    console.log(`DiceMagic State changed: ${prevState} -> ${newState}`);

    const seat_id = 0;
    const hand = 0;

    context.userServer.broadcast(
      createGameStateEvent(prevState, newState, seat_id, hand),
      ['players']
    );

    Handlers.map(async (handler) => {
      const result = await handler(context, prevState, newState);
      if (result) {
        console.log('[Handler] ', handler.name);
      }
    });
  };
};
