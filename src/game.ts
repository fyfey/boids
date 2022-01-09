import { Display } from "./display.js";

export type RenderCallback = (display: Display, dt: number, t: number) => void;
export type UpdateCallback = (dt: number, t: number) => void;

export class Game {
  readonly canvas: HTMLCanvasElement;
  readonly ctx: CanvasRenderingContext2D;
  readonly display: Display;
  drawForces = false;
  running = false;
  lastTime = 0;
  private update: UpdateCallback = () => {};
  private render: RenderCallback = () => {};

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

    this.canvas = document.createElement("canvas") as HTMLCanvasElement;
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

  onUpdate(cb: UpdateCallback) {
    this.update = cb;
  }

  onRender(cb: RenderCallback) {
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

    this.display.clear();
    this.update(dt, ts);
    this.lastTime = ts;
    this.display.drawText(`FPS: ${fps.toLocaleString()}`, 10, 16, "#fff");
    this.render(this.display, dt, ts);
    this.display.render();

    requestAnimationFrame(this._run.bind(this));
  }
}
