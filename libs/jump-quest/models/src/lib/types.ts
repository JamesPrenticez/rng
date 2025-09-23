export interface Position {
  x: number;
  y: number;
}

export interface Velocity {
  x: number;
  y: number;
}

export interface CollisionBlock {
  position: Position;
  width: number;
  height: number;
}

export interface Weapon {
  name: string;
  damage: number;
  frameScale: number;
  frameXOffset: number;
  frameYOffset: number;
  image: HTMLImageElement;
}

interface Player {
  position: Position;
  velocity: Velocity;
  hp: number;
  killCount: number;
  radius: number;
  speed: number;
  acceleration: number;
  maxSpeed: number;
  isOnGround: boolean;
  isCrouching: boolean;
  isJumping: boolean;
  facingRight: boolean;
  action: string;
  frameRow: number;
  frameCurrent: number;
  frameColumn: number;
  frameSpeed: number;
  frameLength: number;
  frameWidth: number;
  frameHeight: number;
  frameScale: number;
  frameXOffset: number;
  frameYOffset: number;
  sprite: HTMLImageElement | null;
  weapon: Weapon | null;
}

export interface GameState {
  player: Player;
  collisionBlocks: CollisionBlock[];
  keys: { [key: string]: boolean };
  isPlaying: boolean;
  frameRate: number;
  canvasSize: { width: number; height: number };
  
  // Actions
  setPlayer: (player: Partial<Player>) => void;
  updatePlayerPosition: (position: Position) => void;
  updatePlayerVelocity: (velocity: Velocity) => void;
  setKeyState: (key: string, pressed: boolean) => void;
  toggleGame: () => void;
  setFrameRate: (fps: number) => void;
  initializeGame: () => void;
}