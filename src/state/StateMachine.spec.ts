import { Game } from "../game";
import { StateMachine } from "./StateMachine";
import { WanderState } from "./states";

describe("StateMachine", () => {
  it("adds states", () => {
    const container = document.createElement("div");
    const game = new Game(800, 600, container);
    const sm = new StateMachine(game);

    sm.add(WanderState);
    sm.start("wander");

    expect(sm.getState()).toBe("wander");
  });
  it("cannot start invalid state", () => {
    const container = document.createElement("div");
    const game = new Game(800, 600, container);
    const sm = new StateMachine(game);

    expect(() => {
      sm.start("wander");
    }).toThrow();
  });
});
