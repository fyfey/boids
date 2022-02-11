import { Boid } from "../boid.js";
import { BoidState } from "../state/states.js";
import { Vector2 } from "../vector2.js";

export class FleeState extends BoidState {
  name = "flee";
  target = new Vector2();
  timeout = 0;

  enter(boid: Boid, target: Vector2): void {
    this.timeout = 0;
    this.target = target;
  }
  exit(boid: Boid): void {}
  update(boid: Boid, dt: number, ts: number) {
    if (!this.timeout) {
      this.timeout = ts + 500;
    }
    if (ts > this.timeout) {
      return "wander";
    }
    const vel = boid.flee(this.target);
    vel.add(boid.wander());
    boid.applyForce(vel, dt);
  }
}
