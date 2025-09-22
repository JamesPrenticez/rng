import { type DiceMagicState, DiceMagicStates } from '@dice-magic/models';

export const RoundEndState = {
    name: DiceMagicStates.RoundEnd,
    update: (_: DiceMagicState, newState: DiceMagicState) => {
        return DiceMagicStates.RoundEnd;
    },
};
