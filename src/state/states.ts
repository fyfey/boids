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
