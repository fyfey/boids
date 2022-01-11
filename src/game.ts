import { Boid } from "./boid.js";
import { Display } from "./display.js";
import { Food } from "./food.js";
import { Vector2 } from "./vector2.js";

export type RenderCallback = (display: Display, dt: number, t: number) => void;
export type UpdateCallback = (dt: number, t: number) => void;

export class Game {
  readonly canvas: HTMLCanvasElement;
  readonly ctx: CanvasRenderingContext2D;
  readonly display: Display;
  running = false;
  lastTime = 0;
  private update: UpdateCallback = () => {};
  private render: RenderCallback = () => {};
  boids: Boid[] = [];
  foods: Food[] = [];

  constructor(
    public width: number,
    public height: number,
    private container: HTMLElement,
    readonly bgColor = "#fff"
  ) {
    for (let i = 0; i < 10; i++) {
      this.boids.push(new Boid(this, this.randomPosition()));
    }
    for (let i = 0; i < 1; i++) {
      this.foods.push(new Food(this, this.randomPosition()));
    }

    this.canvas = document.createElement("canvas") as HTMLCanvasElement;
    this.canvas.width = width;
    this.canvas.height = height;

    if (typeof process !== "undefined" && process.env.NODE_ENV === "test") {
      this.ctx = {} as CanvasRenderingContext2D;
      this.display = {} as Display;
      return;
    }

    const ctx = this.canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Failed to get context");
    }
    this.ctx = ctx;
    this.display = new Display(this.ctx, this);
  }

  randomPosition(): Vector2 {
    return new Vector2(this.width * Math.random(), this.height * Math.random());
  }

  onUpdate(cb: UpdateCallback) {
    this.update = cb;
  }

  killFood(food: Food) {
    if (food.killed) {
      return;
    }
    food.killed = true;
    this.foods = this.foods.filter((f) => f !== food);
    this.foods.push(new Food(this, this.randomPosition()));
  }

  killBoid(boid: Boid) {
    this.boids = this.boids.filter((b) => b !== boid);
  }

  onRender(cb: RenderCallback) {
    this.render = cb;
  }

  run() {
    this.container.appendChild(this.canvas);
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
