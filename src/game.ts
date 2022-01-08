import { Display } from "./display.js";

export type GameCallback = (display: Display, dt: number, fps: number) => void;

export class Game {
  readonly canvas: HTMLCanvasElement;
  readonly ctx: CanvasRenderingContext2D;
  readonly display: Display;
  running = false;
  lastTime = 0;
  private update: GameCallback = () => {};
  private render: GameCallback = () => {};

  constructor(
    public width: number,
    public height: number,
    containerId: string,
    readonly bgColor = "#fff"
  ) {
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error("Container not found");
    }

    this.canvas = document.createElement('canvas') as HTMLCanvasElement;
    this.canvas.width = width;
    this.canvas.height = height;

    container.appendChild(this.canvas);
    const ctx = this.canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Failed to get context");
    }
    this.ctx = ctx;
    this.display = new Display(this.ctx, this);

  }

  onUpdate(cb: GameCallback) {
    this.update = cb;
  }

  onRender(cb: GameCallback) {
    this.render = cb;
  }

  run() {
    this.running = true;
    this._run(0);
  }

  _run(ts: number) {
    this.running = true;
    if (this.lastTime === 0) {
      this.lastTime = ts;
    }
    let dt = ts - this.lastTime;
    let fps = 1000 / dt;

    this.update(this.display, dt, fps);
    this.lastTime = ts;
    this.display.clear();
    this.render(this.display, dt, fps);
    this.display.render();

    requestAnimationFrame(this._run.bind(this));
  }
}
