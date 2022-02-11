import { Boid } from "../../boid";
import { Game } from "../../game";
import { BoidState } from "../states";

export class TestAState extends BoidState {
  protected game = {} as Game;
  name = "test-a";
  enter() {}
  exit() {}
  render() {}
  update(boid: Boid, dt: number, ts: number) {}
}

export class TestBState extends BoidState {
  protected game = {} as Game;
  name = "test-b";
  enter() {}
  exit() {}
  render() {}
  update(boid: Boid, dt: number, ts: number) {}
}
