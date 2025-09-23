import { TileSize } from '@jump-quest/models'
import { CollisionBlock } from './collision-block.class';

export class GameMap {
  ctx: CanvasRenderingContext2D;
  name: string;
  tileSize: TileSize;
  x: number;
  y: number;
  collisionBlocks: CollisionBlock[];
  collisionValues: number[][];

  constructor(ctx: CanvasRenderingContext2D, name: string, tileSize: TileSize, x: number, y: number, collisionValues: number[][], collisionBlocks: CollisionBlock[]) {
    this.ctx = ctx;
    this.name = name;
    this.tileSize = tileSize;
    this.x = x;
    this.y = y;
    this.collisionBlocks = collisionBlocks;
    this.collisionValues = collisionValues;
  }

  update = () => {
    this.drawCollisions();
  }

  drawCollisions = () => {
    this.collisionBlocks.forEach((block) => {
      block.draw();
    });
  }
}