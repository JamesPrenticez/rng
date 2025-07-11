import { IPlayerScore } from "../player.type";

export const calculateScore = (
    roll: number,
    distance: number
): IPlayerScore => {
  return {
    score:  roll + distance
  }
}