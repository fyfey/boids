import { Vector2 } from "./vector2.js";
import { MAX_FORCE, MAX_SPEED, MASS } from "./config.js";
import { Display } from "./display.js";

export class Boid {
  vel: Vector2 = new Vector2(-0.1, -0.2);
  radius = 10;
  color = "red";
  desired = new Vector2();
  steering = new Vector2();

  constructor(public pos: Vector2, public target: Vector2) {
  }

  update(ctx: CanvasRenderingContext2D, dt: number, fps: number) {
    //this.steering;
    const acceleration = this.steering.clone().divideScalar(MASS);

    this.vel = this.vel.add(this.steering).clone();
    this.pos = this.pos.add(this.vel);
  }

  render(display: Display) {
    display.drawCircle(this.pos.x, this.pos.y, this.radius, this.color, 'transparent');

    const angle = this.vel.angle();
    const direction = new Vector2(Math.cos(angle), Math.sin(angle));
    const newPoint = this.pos.clone();
    direction.multiplyScalar(20);
    newPoint.add(direction);
    display.drawLine(this.pos.x, this.pos.y, newPoint.x, newPoint.y, '#0f0');
  }
}
