import { Boid } from "../boid.js";
import {
  EAT_RATE,
  FADE_RATE,
  FEEDING_DISTANCE,
  MAX_SPEED,
  SLOWING_RADIUS,
  WANDER_DISTANCE,
  WANDER_RADIUS,
} from "../config.js";
import { Food } from "../food.js";
import { Game } from "../game.js";
import { Vector2 } from "../vector2.js";

export interface IBoidState {
  new (game: Game): BoidState;
  name: string;
}

export abstract class BoidState {
  constructor(protected game: Game) {}
  abstract name: string;
  abstract enter(boid: Boid, args: any): void;
  abstract exit(boid: Boid): void;
  abstract update(
    boid: Boid,
    dt: number,
    ts: number
  ): string | { state: string; args?: any } | void;
}

export class WanderState extends BoidState {
  name = "wander";

  offset = 10;
  wanderTarget = new Vector2();

  enter(boid: Boid) {}
  exit(boid: Boid) {}
  update(boid: Boid, dt: number, ts: number) {
    boid.applyForce(boid.wander());
    boid.burnFood(dt);

    if (boid.food < 50) {
      return "seek";
    }
  }
}

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
    boid.applyForce(vel);
  }
}

export class DeadState extends BoidState {
  name = "dead";
  enter() {}
  exit() {}
  update(boid: Boid, dt: number, ts: number) {
    boid.alpha -= FADE_RATE;
  }
}
