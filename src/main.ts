import { Game } from "./game.js";
import { Boid } from "./boid.js";
import { Vector2 } from "./vector2.js";
import {
  SLOWING_RADIUS,
  MAX_SPEED,
  WANDER_DISTANCE,
  WANDER_RADIUS,
} from "./config.js";
import { Food } from "./food.js";

interface Trigger {
  time: number;
  callback: (ts: number) => void;
}

window.onload = async function () {
  const container = document.getElementById("canvas-container");
  const game = new Game(500, 500, container!, "#081e6e");

  let triggers: Trigger[] = [];

  game.onUpdate((dt: number, ts: number) => {
    for (let i = 0; i < triggers.length; i++) {
      if (triggers[i].time <= ts) {
        triggers[i].callback(ts);
        triggers.splice(i, 1);
      }
    }
    for (let i = 0; i < game.boids.length; i++) {
      game.boids[i].update(game.ctx, dt, ts);
    }
  });
  game.onRender((display, dt, fps) => {
    for (let i = 0; i < game.foods.length; i++) {
      game.foods[i].render(display, dt);
    }
    for (let i = 0; i < game.boids.length; i++) {
      game.boids[i].render(display, dt);
    }
  });

  game.run();
};
