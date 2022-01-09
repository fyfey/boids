import { Vector2 } from "./vector2.js";
import { MAX_FORCE, MAX_SPEED, MASS } from "./config.js";
import { Display } from "./display.js";

export class Boid {
  vel: Vector2 = new Vector2(-0.1, -0.2);
  radius = 10;
  state = "wander";
  color = "red";
  desired = new Vector2();
  steering = new Vector2();
  food = 1;

  constructor(public pos: Vector2, public target: Vector2) {}

  update(ctx: CanvasRenderingContext2D, dt: number, fps: number) {
    const acceleration = this.steering.clone().divideScalar(MASS);

    this.vel = this.vel.add(acceleration).clone();
    this.pos = this.pos.add(this.vel);
    this.food -= (dt / 6000) * this.vel.length();
    if (this.state === "wander" && this.food < 0.5) {
      this.state = "seek";
    }
  }

  render(display: Display) {
    // Draw body
    display.drawText(
      `Food: ${this.food.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      10,
      36,
      "#fff"
    );
    display.drawText(
      `Speed: ${this.vel
        .length()
        .toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
      10,
      46,
      "#fff"
    );
    display.drawEllipse(
      this.pos.x,
      this.pos.y,
      this.radius,
      Math.max(1, this.radius * this.food),
      this.vel.angle(),
      this.color,
      "transparent"
    );

    const angle = this.vel.angle();
    const direction = new Vector2(Math.cos(angle), Math.sin(angle));
    const startPoint = this.pos.clone();
    direction.multiplyScalar(11);
    startPoint.add(direction);
    const newPoint = startPoint.clone();
    newPoint.add(direction);
    display.drawLine(
      startPoint.x,
      startPoint.y,
      newPoint.x,
      newPoint.y,
      "#0f0"
    );
  }
}
