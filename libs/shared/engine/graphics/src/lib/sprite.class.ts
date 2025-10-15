import { Animation } from './animation.class';

export class Sprite {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  scale: number;
  currentAnimation?: Animation;
  animations: Record<string, Animation> = {};

  constructor(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    scale = 1
  ) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.scale = scale;
  }

  addAnimation(name: string, animation: Animation) {
    this.animations[name] = animation;
    if (!this.currentAnimation) {
      this.currentAnimation = animation;
    }
  }

  play(name: string, reset = false) {
    const anim = this.animations[name];
    if (!anim) {
      console.warn(`Animation '${name}' not found`);
      return;
    }
    if (this.currentAnimation !== anim) {
      this.currentAnimation = anim;
      if (reset) anim.reset();
    }
  }

  update(delta: number) {
    this.currentAnimation?.update(delta);
  }

  draw() {
    if (!this.currentAnimation) return;
    this.currentAnimation.draw(this.ctx, this.x, this.y, this.scale);
  }
}
