import type { DiceMagicStates, IGameContext } from '@dice-magic/models';

export type StateHandler = (
    context: IGameContext,
    prevState: DiceMagicStates,
    newState: DiceMagicStates
) => Promise<boolean>;
