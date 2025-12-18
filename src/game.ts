import { BOID_COUNT } from "./config.js";
import { BlurCircle } from "./BlurCircle.js";
import { Boid } from "./boid.js";
import { Color } from "./color.js";
import { Display } from "./display.js";
import { Food } from "./food.js";
import { PortalManager } from "./PortalManager.js";
import { Vector2 } from "./vector2.js";

export type RenderCallback = (display: Display, dt: number, t: number) => void;
export type UpdateCallback = (dt: number, t: number) => void;

export class Game {
  readonly canvas: HTMLCanvasElement;
  readonly ctx: CanvasRenderingContext2D;
  readonly display: Display;
  running = false;
  lastTime = 0;
  private targetFPS = 60;
  private frameInterval = 1000 / this.targetFPS;
  private update: UpdateCallback = () => {};
  private render: RenderCallback = () => {};
  boids: Boid[] = [];
  foods: Food[] = [];
  bgCircles: BlurCircle[] = [];
  portalManager = new PortalManager(this, new Color(0, 213, 255, 255));

  constructor(
    public width: number,
    public height: number,
    private container: HTMLElement,
    readonly bgColor = "#000000",
  ) {
    // Detect mobile and reduce particle count
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const bgCircleCount = isMobile ? 5 : 20;
    const boidCount = isMobile ? Math.floor(BOID_COUNT / 2) : BOID_COUNT;
    
    for (let i = 0; i < bgCircleCount; i++) {
      this.bgCircles.push(new BlurCircle(this));
    }
    for (let i = 0; i < Math.random() * 5 + 1; i++) {
      this.foods.push(new Food(this, this.randomPosition()));
    }
    for (let i = 0; i < boidCount; i++) {
      this.boids.push(new Boid(this, this.randomPosition()));
    }

    this.canvas = document.createElement("canvas") as HTMLCanvasElement;
    this.canvas.width = width;
    this.canvas.height = height;

    this.canvas.addEventListener("click", (e: MouseEvent) => {
      this.portalManager.handleClick(
        e.x + window.scrollX,
        e.y + window.scrollY,
      );
    });

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
    
    // Skip frame if we're behind
    if (dt < this.frameInterval - 1) {
      requestAnimationFrame(this._run.bind(this));
      return;
    }
    
    let fps = 1000 / dt;

    this.display.clear();
    this.update(dt, ts);
    this.lastTime = ts;
    // this.display.drawText(`FPS: ${fps.toLocaleString()}`, 10, 16, "#fff");
    this.render(this.display, dt, ts);
    this.portalManager.render();
    this.display.render();

    requestAnimationFrame(this._run.bind(this));
  }
}
