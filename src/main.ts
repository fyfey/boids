// import "./style.css";

// import {
//   CANVAS_HEIGHT,
//   CANVAS_WIDTH,
//   MAX_SPEED,
//   SLOWING_RADIUS,
//   WANDER_DISTANCE,
//   WANDER_RADIUS,
// } from "./config.js";
//
// import { Boid } from "./boid.js";
// import { Food } from "./food.js";
import { Game } from "./game.js";
// import { Vector2 } from "./vector2.js";

interface Trigger {
  time: number;
  callback: (ts: number) => void;
}

window.onload = async function () {
  const app = document.getElementById("app");
  if (!app) {
    throw new Error("No app element found");
  }

  // Use window dimensions for mobile
  const game = new Game(window.innerWidth, window.innerHeight, app, "#000000");

  // Handle window resize and orientation changes
  function resizeCanvas() {
    game.canvas.width = window.innerWidth;
    game.canvas.height = window.innerHeight;
    game.width = window.innerWidth;
    game.height = window.innerHeight;
    game.display.width = window.innerWidth;
    game.display.height = window.innerHeight;
  }

  window.addEventListener("resize", resizeCanvas);
  window.addEventListener("orientationchange", () => {
    // Small delay to ensure orientation change is complete
    setTimeout(resizeCanvas, 100);
  });

  // Also listen for screen rotation via matchMedia
  const portrait = window.matchMedia("(orientation: portrait)");
  portrait.addEventListener("change", () => {
    setTimeout(resizeCanvas, 100);
  });

  // Add reload button functionality
  const reloadBtn = document.getElementById("reload-btn");
  if (reloadBtn) {
    reloadBtn.addEventListener("click", () => {
      window.location.reload();
    });
  }

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
    for (let i = 0; i < game.bgCircles.length; i++) {
      game.bgCircles[i].render(display);
    }
    for (let i = 0; i < game.foods.length; i++) {
      game.foods[i].render(display, dt);
    }
    for (let i = 0; i < game.boids.length; i++) {
      game.boids[i].render(display, dt);
    }
  });

  game.run();
};
