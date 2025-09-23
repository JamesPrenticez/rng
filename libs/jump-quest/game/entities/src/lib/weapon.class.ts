export class Weapon {
  name: string;
  damage: number;
  frameWidth: number = 512;
  frameHeight: number = 512;
  frameXOffset: number;
  frameYOffset: number;
  frameScale: number;
  image: HTMLImageElement;

  constructor(name: string, damage: number, frameScale: number, frameXOffset: number, frameYOffset: number, imageSrc: string) {
    this.name = name;
    this.damage = damage;
    this.frameXOffset = frameXOffset;
    this.frameYOffset = frameYOffset;
    this.frameScale = frameScale;

    this.image = new Image();
    this.image.src = imageSrc;
  }

  draw(ctx: CanvasRenderingContext2D, x: number, y: number, facingRight: boolean) {
    const sourceX = x + this.frameXOffset;
    const sourceY = y + this.frameYOffset;
    const w = this.frameWidth * this.frameScale;
    const h = this.frameHeight * this.frameScale;

    ctx.save();
    if (facingRight) {
      ctx.scale(1, 1);
      ctx.drawImage(this.image, sourceX, sourceY, w, h);
    } else {
      ctx.scale(-1, 1);
      ctx.drawImage(this.image, -sourceX - 32, sourceY, w, h);
    }
    ctx.restore();
  }
}