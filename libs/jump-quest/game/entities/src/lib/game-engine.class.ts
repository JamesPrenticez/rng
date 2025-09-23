import { Canvas } from "./canvas.class";
import { CollisionBlock } from "./collision-block.class";
import { GameMap } from "./map.class";
import { Player } from "./player.class";
import { Weapon } from "./weapon.class";

export class GameEngine {
  canvas: Canvas;
  player: Player;
  weapon: Weapon;
  map: GameMap;
  collisionBlocks: CollisionBlock[];
  isPlaying: boolean = false;
  animationId: number | null = null;

  constructor(canvasElement: HTMLCanvasElement) {
    const tileSize = { w: 64, h: 64 };
    
    // Initialize canvas
    this.canvas = new Canvas(canvasElement, tileSize.w * 16, tileSize.h * 9);

    // Create collision blocks
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
    const parsedCollisions: number[][] = [];
    for (let i = 0; i < collisionsLevelOne.length; i += 16) {
      parsedCollisions.push(collisionsLevelOne.slice(i, i + 16));
    }

    // Create collision blocks
    this.collisionBlocks = [];
    parsedCollisions.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value === 292) {
          this.collisionBlocks.push(new CollisionBlock(this.canvas.ctx, {
            x: x * tileSize.w,
            y: y * tileSize.h
          }));
        }
      });
    });

    // Create map
    this.map = new GameMap(
      this.canvas.ctx,
      "level1",
      tileSize,
      this.canvas.width / 2,
      this.canvas.height / 2,
      parsedCollisions,
      this.collisionBlocks
    );

    // Create player
    this.player = new Player(
      this.canvas.ctx,
      "player1",
      this.canvas.width / 2,
      this.canvas.height / 2,
      this.collisionBlocks
    );

    // Create weapon
    this.weapon = new Weapon(
      'bow',
      5,
      0.15,
      -16,
      -16,
      "./weapon.spritesheet.png"
    );

    this.player.pickUpWeapon(this.weapon);
  }

  gameLoop = () => {
    if (!this.isPlaying) return;

    this.canvas.clear();
    this.canvas.ctx.imageSmoothingEnabled = true;
    this.canvas.drawFrameRate();

    // Update and draw map
    this.map.update();

    // Update and draw player
    this.player.update();

    // Request next animation frame
    this.animationId = requestAnimationFrame(this.gameLoop);
  }

  startGame = () => {
    if (!this.isPlaying) {
      this.isPlaying = true;
      this.gameLoop();
    }
  }

  pauseGame = () => {
    if (this.isPlaying) {
      this.isPlaying = false;
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
      }
    }
  }

  toggleGame = () => {
    if (this.isPlaying) {
      this.pauseGame();
    } else {
      this.startGame();
    }
  }

  handleKeyDown = (e: KeyboardEvent) => {
    this.player.setKeyState(e.code, true);
  }

  handleKeyUp = (e: KeyboardEvent) => {
    this.player.setKeyState(e.code, false);
  }
}