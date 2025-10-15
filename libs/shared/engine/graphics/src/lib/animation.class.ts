export class Animation {
  frameCount: number;
  frameWidth: number;
  frameHeight: number;
  frameSpeed: number;
  currentFrame = 0;
  elapsed = 0;
  loop: boolean;

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
    this.elapsed += delta;
    if (this.elapsed >= this.frameSpeed) {
      this.currentFrame++;
      if (this.currentFrame >= this.frameCount) {
        this.currentFrame = this.loop ? 0 : this.frameCount - 1;
      }
      this.elapsed = 0;
    }
  }

  draw(ctx: CanvasRenderingContext2D, x: number, y: number, scale = 1) {
    const sx = this.currentFrame * this.frameWidth;
    ctx.drawImage(
      this.image,
      sx, 0, this.frameWidth, this.frameHeight,
      x, y,
      this.frameWidth * scale,
      this.frameHeight * scale
    );
  }

  reset() {
    this.currentFrame = 0;
    this.elapsed = 0;
  }
}
