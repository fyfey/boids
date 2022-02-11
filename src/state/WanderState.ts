import { Boid } from "../boid.js";
import { BoidState } from "./states.js";
import { Vector2 } from "../vector2.js";

export class WanderState extends BoidState {
  name = "wander";

  offset = 10;
  wanderTarget = new Vector2();

  enter(boid: Boid) {}
  exit(boid: Boid) {}
  update(boid: Boid, dt: number, ts: number) {
    const vel = boid.wander();
    const food = boid.findNearestFood(this.game.foods);
    if (food.pos.distanceTo(boid.pos) < food.radius() + 50) {
      vel.add(boid.flee(food.pos).multiplyScalar(0.7));
    }
    boid.applyForce(vel, dt);
    boid.burnFood(dt);

    if (boid.food < 50) {
      return "seek";
    }
  }
}
