import { Position } from '@jump-quest/models'

export class CollisionBlock {
  ctx: CanvasRenderingContext2D;
  position: Position;
  w: number = 64;
  h: number = 64;

  constructor(ctx: CanvasRenderingContext2D, position: Position) {
    this.ctx = ctx;
    this.position = position;
  }

  draw = () => {
    this.ctx.fillStyle = 'rgba(255, 0, 0, 0.7)';
    this.ctx.fillRect(this.position.x, this.position.y, this.w, this.h);
    this.ctx.strokeStyle = '#ff0000';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(this.position.x, this.position.y, this.w, this.h);
  }
}