import { useMemo } from 'react';
import { useGameContext } from '@dice-magic/contexts';

import {
  PlayerData
} from '@dice-magic/models';

export const usePlayersBySeat = () => {
  const { gameState } = useGameContext();

  return useMemo(() => {
    const map = new Map<number, PlayerData>();
    for (const player of gameState.players) {
      map.set(player.seat, player);
    }
    console.log("recalc")
    return map;
  }, [gameState.players]);
};
