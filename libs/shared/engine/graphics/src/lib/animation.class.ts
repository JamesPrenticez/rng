export class Animation {
  frameCount: number;
  frameWidth: number;
  frameHeight: number;
  frameSpeed: number;
  currentFrame = 0;
  elapsed = 0;
  loop: boolean;
  playing = true;
  onComplete?: () => void;

  constructor(
    public image: HTMLImageElement,
    frameWidth: number,
    frameHeight: number,
    frameCount: number,
    frameSpeed = 100,
    loop = true
  ) {
    this.frameCount = frameCount;
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
    this.frameSpeed = frameSpeed;
    this.loop = loop;
  }

  update(delta: number) {
    if (!this.playing) return;

    this.elapsed += delta;
    if (this.elapsed >= this.frameSpeed) {
      this.elapsed = 0;
      this.currentFrame++;

      if (this.currentFrame >= this.frameCount) {
        if (this.loop) {
          this.currentFrame = 0;
        } else {
          this.currentFrame = this.frameCount - 1;
          this.playing = false;
          if (this.onComplete) this.onComplete();
        }
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D, x: number, y: number, scale = 1) {
    const cols = Math.floor(this.image.width / this.frameWidth);

    const frameX = this.currentFrame % cols;
    const frameY = Math.floor(this.currentFrame / cols);

    const sx = frameX * this.frameWidth;
    const sy = frameY * this.frameHeight;

    ctx.drawImage(
      this.image,
      sx, sy, this.frameWidth, this.frameHeight,
      x, y,
      this.frameWidth * scale,
      this.frameHeight * scale
    );
  }

  reset() {
    this.currentFrame = 0;
    this.elapsed = 0;
    this.playing = true;
  }
}
