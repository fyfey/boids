import { Food } from "../food.js";
import { Boid } from "../boid.js";
import { BoidState } from "../state/states.js";
import { FEEDING_DISTANCE, MAX_SPEED, SLOWING_RADIUS } from "../config.js";

export class ArriveState extends BoidState {
  name = "arrive";
  target: Food | undefined;

  enter(boid: Boid, target: Food): void {
    this.target = target;
  }
  exit(boid: Boid): void {}
  update(boid: Boid, dt: number, ts: number) {
    const feedingPosition = boid.pos
      .clone()
      .sub(this.target!.pos)
      .setLength(this.target!.radius() + FEEDING_DISTANCE);
    const other = this.target!.pos.clone().add(feedingPosition);
    //this.game.display.drawCircle(other.x, other.y, 10, "green", null);
    if (boid.pos.distanceTo(other) <= 2) {
      return { state: "eat", args: this.target };
    }

    const desiredVelocity = other.clone().sub(boid.pos);
    const distance = desiredVelocity.length();
    boid.applyForce(
      desiredVelocity
        .setLength(MAX_SPEED)
        .multiplyScalar(distance / SLOWING_RADIUS)
        .maxScalar(0.4)
    );
  }
}
