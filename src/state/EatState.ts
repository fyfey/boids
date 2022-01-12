import { Food } from "../food.js";
import { Boid } from "../boid.js";
import { BoidState } from "../state/states.js";
import { EAT_RATE, FEEDING_DISTANCE } from "../config.js";

export class EatState extends BoidState {
  name = "eat";
  target: Food | undefined;

  enter(boid: Boid, target: Food): void {
    this.target = target;
  }
  exit(boid: Boid): void {}
  update(boid: Boid, dt: number, ts: number) {
    if (!this.target) {
      return { state: "seek", args: boid.findNearestFood(this.game.foods) };
    }
    if (this.target.food <= 0) {
      this.game.killFood(this.target!);
      return { state: "seek", args: boid.findNearestFood(this.game.foods) };
    }
    // eat food
    boid.vel = this.target.pos.clone().sub(boid.pos).setLength(0.001);
    if (this.target!.food < EAT_RATE) {
      this.target!.food = 0;
      boid.food += this.target!.food;
    } else {
      this.target!.food -= EAT_RATE;
      boid.food += EAT_RATE;
    }
    if (boid.food >= 100) {
      return { state: "flee", args: this.target!.pos };
    }
    const feedingPosition = boid.pos
      .clone()
      .sub(this.target!.pos)
      .setLength(this.target!.radius() + FEEDING_DISTANCE);

    boid.pos = this.target!.pos.clone().add(feedingPosition);
  }
}
