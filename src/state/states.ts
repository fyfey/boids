import { Boid } from "../boid.js";
import { Game } from "../game.js";

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
    ts: number,
  ): string | { state: string; args?: any } | void;
}
