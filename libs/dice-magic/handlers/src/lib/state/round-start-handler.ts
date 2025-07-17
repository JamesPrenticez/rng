// import { v4 as uuidv4 } from 'uuid';

// import {
//     DiceMagicStates,
//     createRoundStartEvent,
//     type IGameContext,
// } from '@dice-magic/models';

// import type { StateHandler } from '../types';

// export const RoundStartHandler: StateHandler = async (
//     context: IGameContext,
//     _,
//     newState
// ) => {
//     if (newState !== DiceMagicStates.WaitingForBets) {
//         return false;
//     }

//     const roundId = uuidv4();

//     context.userServer.broadcast(
//         createRoundStartEvent(
//             roundId,
//             context.settings.tableLimits,
//             context.stateMachine.getData().players.map((p) => p.toData()),
//             null,
//             null
//         )
//     );

//     context.stateMachine.update({ roundId });
//     return true;
// };
