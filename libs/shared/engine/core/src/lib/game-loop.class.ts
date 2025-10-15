export interface IUpdatable {
  update(delta: number): void;
  draw(ctx: CanvasRenderingContext2D): void;
}

export class GameLoop {
  private running = false;
  private lastTime = 0;
  private frameId?: number;
  private updateable?: IUpdatable;

  constructor(private ctx: CanvasRenderingContext2D) {}

  attach(updateable: IUpdatable) {
    this.updateable = updateable;
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this.frame();
  }

  stop() {
    this.running = false;
    if (this.frameId) cancelAnimationFrame(this.frameId);
  }

  private frame = (time: number = 0) => {
    if (!this.running || !this.updateable) return;
    const delta = time - this.lastTime;
    this.lastTime = time;

    this.updateable.update(delta);
    this.updateable.draw(this.ctx);

    this.frameId = requestAnimationFrame(this.frame);
  };
}
