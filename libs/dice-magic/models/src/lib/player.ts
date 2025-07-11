import { IDiceMagicPlayer, DiceMagicPlayerState } from "./player.type";
import { calculateScore } from "./utils/calculate-score.util";

export const DiceMagicPlayer = (
    id: string,
    name: string,
    seat: number,
    data: Partial<DiceMagicPlayerState> = {}
): IDiceMagicPlayer => {
    return {
      id,
      name,
      seat,
      // score: () => calculateScore(data.roll ?? 0, data.distance ?? 0),
    }
}