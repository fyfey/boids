import { Boid } from "../boid.js";
import { FADE_RATE } from "../config.js";
import { BoidState } from "./states.js";

export class DeadState extends BoidState {
  name = "dead";
  enter() {}
  exit() {}
  update(boid: Boid, dt: number, ts: number) {
    boid.alpha -= FADE_RATE;
  }
}
