import { Canvas, GameLoop } from '@shared/engine/core';
import { Sprite, Animation } from '@shared/engine/graphics';

export class CoinFlipGame {
  canvas: Canvas;
  loop: GameLoop;
  coin: Sprite;
  flipping = false;

  constructor(canvasEl: HTMLCanvasElement) {
    this.canvas = new Canvas(canvasEl, 400, 400);
    this.loop = new GameLoop(this.canvas.ctx);

    const coinImg = new Image();
    coinImg.src = './coin-flip-spritesheet.png';

    const flipAnim = new Animation(coinImg, 128, 128, 24, 80, false);
    const idleAnim = new Animation(coinImg, 128, 128, 1, 1000, true);

    this.coin = new Sprite(this.canvas.ctx, 150, 150, 1);
    this.coin.addAnimation('idle', idleAnim);
    this.coin.addAnimation('flip', flipAnim);
    this.coin.play('idle');

    this.loop.attach(this);
  }

  update(delta: number) {
    this.coin.update(delta);
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.canvas.clear();
    this.coin.draw();
  }

  flip() {
    if (this.flipping) return; // prevent multiple flips
    this.flipping = true;

    const flipAnim = this.coin.animations['flip'];
    flipAnim.reset();

    // When done flipping, go back to idle
    flipAnim.onComplete = () => {
      this.coin.play('idle', true);
      this.flipping = false;
    };

    this.coin.play('flip');
  }

  start() {
    this.loop.start();
  }
}
