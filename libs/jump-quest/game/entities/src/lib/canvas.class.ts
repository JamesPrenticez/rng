export class Canvas {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  bgColor: string = '#222';
  
  // Frame Rate
  currentFrameTime: number = Date.now();
  lastFrameTime: number = 0;
  frameCount: number = 0;
  currentSecond: number = 0;
  framesLastSecond: number = 0;

  constructor(element: HTMLCanvasElement, width: number, height: number) {
    this.canvas = element;
    this.width = width;
    this.height = height;

    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.ctx = this.canvas.getContext("2d")!;
    this.ctx.imageSmoothingEnabled = true;
  }

  clear = () => {
    this.ctx.fillStyle = this.bgColor;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawFrameRate() {
    this.updateFrameRate();
    this.ctx.font = "500 10px Arial";
    this.ctx.fillStyle = "#dadada";
    this.ctx.fillText(this.framesLastSecond.toString(), this.canvas.width - 30, 15);
  }

  updateFrameRate() {
    let sec = Math.floor(Date.now() / 1000);

    if (sec != this.currentSecond) {
      this.currentSecond = sec;
      this.framesLastSecond = this.frameCount;
      this.frameCount = 1;
    } else {
      this.frameCount++;
    }
  }
}