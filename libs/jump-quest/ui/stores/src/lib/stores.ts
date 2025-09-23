import { create } from 'zustand';
import { Player } from "@jump-quest/models"

interface GameStore {
  // Game State
  screen: 'menu' | 'playing' | 'levelSelect';
  currentLevel: number;
  
  // Player State
  player: Player;
  
  // Input State
  keys: Set<string>;
  
  // Actions
  setScreen: (screen: 'menu' | 'playing' | 'levelSelect') => void;
  setLevel: (level: number) => void;
  updatePlayer: (player: Player) => void;
  resetPlayer: () => void;
  addKey: (key: string) => void;
  removeKey: (key: string) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial State
  keys: new Set<string>(),
  screen: 'menu',
  currentLevel: 1,
  player: {
    position: { x: 50, y: 400 },
    velocity: { x: 0, y: 0 },
    size: { x: 20, y: 25 },
    onGround: false
  },
  
  // Actions
  setScreen: (screen) => set({ screen }),
  
  setLevel: (level) => set({ currentLevel: level }),
  
  updatePlayer: (player) => set({ player }),
  
  resetPlayer: () => set({
    player: {
      position: { x: 50, y: 400 },
      velocity: { x: 0, y: 0 },
      size: { x: 20, y: 25 },
      onGround: false
    }
  }),
  
  addKey: (key) => set((state) => ({
    keys: new Set(state.keys).add(key)
  })),
  
  removeKey: (key) => set((state) => {
    const newKeys = new Set(state.keys);
    newKeys.delete(key);
    return { keys: newKeys };
  })
}));