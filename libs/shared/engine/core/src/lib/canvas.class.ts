export class Canvas {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  fps: number = 60;
  private _frameCount = 0;
  private _lastTime = 0;
  private _loopCallback?: (delta: number) => void;
  private _rafId?: number;

  constructor(canvas: HTMLCanvasElement, width: number, height: number) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.width = width;
    this.height = height;

    // Prevent scaling issues
    this.ctx.imageSmoothingEnabled = false;
    (this.ctx as any).mozImageSmoothingEnabled = false;
    (this.ctx as any).webkitImageSmoothingEnabled = false;

    this.resize(width, height);
  }

  resize(width: number, height: number) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.width = width;
    this.height = height;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  startLoop(callback: (delta: number) => void) {
    this._loopCallback = callback;
    this._lastTime = performance.now();
    this._frame();
  }

  stopLoop() {
    if (this._rafId) cancelAnimationFrame(this._rafId);
  }

  private _frame = (time: number = 0) => {
    const delta = time - this._lastTime;
    this._lastTime = time;
    this._frameCount++;

    if (this._loopCallback) {
      this._loopCallback(delta);
    }

    this._rafId = requestAnimationFrame(this._frame);
  };
}
