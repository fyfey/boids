import { Boid } from "../boid.js";
import { Game } from "../game.js";
import { BoidState, IBoidState } from "./states.js";

export class StateMachine {
  private states: { [state: string]: BoidState } = {};
  private state = "";
  private started = false;

  constructor(private game: Game) {}

  add(State: IBoidState): StateMachine {
    const state = new State(this.game);
    if (state.name in this.states) {
      throw new Error(`State ${state.name} already exists`);
    }
    this.states[state.name] = state;
    return this;
  }

  getState() {
    return this.state;
  }

  start(state: string) {
    this.setState(state);
    this.started = true;
  }

  update(boid: Boid, dt: number, ts: number): string | void {
    if (!this.started) {
      throw new Error("StateMachine not started");
    }
    let state = this.states[this.state].update(boid, dt, ts);
    if (!state) {
      return;
    }
    let args = null;
    if (typeof state === "object" && "state" in state) {
      args = state.args;
      state = state.state;
    }
    this.enterState(state, boid, args);
  }

  private setState(state: string) {
    if (!(state in this.states)) {
      throw new Error(`State "${state}" does not exist`);
    }
    this.state = state;
  }

  enterState(state: string, boid: Boid, args?: any) {
    this.states[this.state].exit(boid);
    this.setState(state);
    this.states[this.state].enter(boid, args);
  }
}
