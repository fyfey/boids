import { Food } from "../food.js";
import { Boid } from "../boid.js";
import { BoidState } from "../state/states.js";
import { SLOWING_RADIUS } from "../config.js";

export class SeekState extends BoidState {
  name = "seek";
  target: Food | undefined;

  enter(boid: Boid): void {
    this.target = boid.findNearestFood(this.game.foods);
  }
  exit(boid: Boid): void {}
  update(boid: Boid, dt: number, ts: number) {
    const vel = boid.seek(this.target!);

    const distance = this.target!.pos.clone().sub(boid.pos).length();
    if (distance < SLOWING_RADIUS + this.target!.radius()) {
      return { state: "arrive", args: this.target };
    }

    vel.add(boid.wander());
    boid
      .getNeighbors(this.game.boids)
      .forEach((neighbour) =>
        vel.add(boid.flee(neighbour.boid.pos).multiplyScalar(0.2))
      );
    boid.applyForce(vel);
    boid.burnFood(dt);
  }
}
