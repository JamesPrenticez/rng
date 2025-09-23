import { create } from 'zustand';
import { CollisionBlock, GameState } from '@jump-quest/models'

export const useGameStore = create<GameState>((set, get) => ({
  player: {
    position: { x: 512, y: 288 },
    velocity: { x: 0, y: 0 },
    hp: 10,
    killCount: 0,
    radius: 10,
    speed: 0,
    acceleration: 0.07,
    maxSpeed: 3,
    isOnGround: false,
    isCrouching: false,
    isJumping: false,
    facingRight: true,
    action: 'idle',
    frameRow: 0,
    frameCurrent: 0,
    frameColumn: 0,
    frameSpeed: 10,
    frameLength: 7,
    frameWidth: 512,
    frameHeight: 512,
    frameScale: 0.25,
    frameXOffset: 200,
    frameYOffset: 200,
    sprite: null,
    weapon: null
  },
  collisionBlocks: [],
  keys: {},
  isPlaying: false,
  frameRate: 0,
  canvasSize: { width: 1024, height: 576 },

  setPlayer: (playerUpdate) => set(state => ({
    player: { ...state.player, ...playerUpdate }
  })),

  updatePlayerPosition: (position) => set(state => ({
    player: { ...state.player, position }
  })),

  updatePlayerVelocity: (velocity) => set(state => ({
    player: { ...state.player, velocity }
  })),

  setKeyState: (key, pressed) => set(state => ({
    keys: { ...state.keys, [key]: pressed }
  })),

  toggleGame: () => set(state => ({ isPlaying: !state.isPlaying })),

  setFrameRate: (fps) => set({ frameRate: fps }),

  initializeGame: () => {
    const collisionsLevelOne = [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 292, 292, 292, 292, 292, 292, 292, 292, 292, 292, 292, 292, 292, 292, 0,
      0, 292, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 292, 0,
      0, 292, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 292, 0,
      0, 292, 292, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 292, 0,
      0, 292, 292, 292, 292, 292, 292, 292, 292, 292, 292, 292, 292, 292, 292, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ];

    // Parse 2D collision map
    const rows = [];
    for (let i = 0; i < collisionsLevelOne.length; i += 16) {
      rows.push(collisionsLevelOne.slice(i, i + 16));
    }

    // Create collision blocks
    const collisionBlocks: CollisionBlock[] = [];
    const tileSize = { w: 64, h: 64 };

    rows.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value === 292) {
          collisionBlocks.push({
            position: {
              x: x * tileSize.w,
              y: y * tileSize.h
            },
            width: tileSize.w,
            height: tileSize.h
          });
        }
      });
    });

    // Load player sprite
    const playerSprite = new Image();
    playerSprite.src = "./assets/sprites/player/player.png";
    
    playerSprite.onload = () => {
      set(state => ({
        player: { ...state.player, sprite: playerSprite }
      }));
    };
    
    playerSprite.onerror = () => {
      console.warn("Player sprite failed to load from ./assets/sprites/player/player.png");
    };

    set({ collisionBlocks });
  }
}));
