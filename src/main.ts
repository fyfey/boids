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
  const game = new Game(500, 500, "canvas-container", "#081e6e");

  let target = new Vector2(
    Math.random() * game.canvas.width + 1,
    Math.random() * game.canvas.height + 1
  );
  const boid = new Boid(new Vector2(250, 250), target);
  const playerImage = new Image();

  let foods: Food[] = [new Food(game)];

  let triggers: Trigger[] = [];
  playerImage.src = "shadow_dog.png";
  console.log(boid.state);

  let wanderPoint = boid.vel.clone().setLength(WANDER_DISTANCE).add(boid.pos);

  let wanderTarget = new Vector2();
  wanderTarget.copy(wanderPoint);
  //wanderTarget.add(new Vector2(wanderPoint.x, 0));

  // window.addEventListener("mousedown", function (e) {
  //   boid.target.set(e.clientX, e.clientY);
  // });

  game.onUpdate((dt: number, ts: number) => {
    for (let i = 0; i < triggers.length; i++) {
      if (triggers[i].time <= ts) {
        triggers[i].callback(ts);
        triggers.splice(i, 1);
      }
    }
    let desiredVelocity = new Vector2();
    switch (boid.state) {
      case "wander":
        wanderPoint = boid.vel.clone().setLength(WANDER_DISTANCE).add(boid.pos);

        const offset = 10;
        const vOffset = new Vector2();
        vOffset.random().setLength(offset * 0.5);
        wanderTarget.add(vOffset);

        //wanderTarget.add(vOffset);

        let v = wanderTarget.clone().sub(wanderPoint);
        v.setLength(WANDER_RADIUS);

        wanderTarget.copy(wanderPoint.clone().add(v));

        // Draw forces
        if (game.drawForces) {
          game.display.drawCircle(
            wanderPoint.x,
            wanderPoint.y,
            WANDER_RADIUS,
            "transparent",
            "#0f0"
          );
          game.display.drawLine(
            boid.pos.x,
            boid.pos.y,
            wanderPoint.x,
            wanderPoint.y,
            "#00ff00"
          );

          game.display.drawCircle(
            wanderTarget.x,
            wanderTarget.y,
            offset,
            "transparent",
            "#0f0"
          );
          game.display.drawLine(
            boid.pos.x,
            boid.pos.y,
            wanderTarget.x,
            wanderTarget.y,
            "#00ff00"
          );
        }

        desiredVelocity = wanderTarget.clone().sub(boid.pos);
        desiredVelocity.setLength(MAX_SPEED);
        break;
      case "seek":
        desiredVelocity = target.clone().sub(boid.pos);
        const distance = desiredVelocity.length();
        if (distance < 0.1) {
          boid.state = "sleep";
          triggers.push({
            callback: (ts) => {
              boid.state = "flee";
              triggers.push({
                callback: (ts) => {
                  boid.state = "wander";
                },
                time: ts + 1000,
              });
            },
            time: ts + 2000,
          });
        }
        if (distance < SLOWING_RADIUS) {
          desiredVelocity = desiredVelocity
            .setLength(MAX_SPEED)
            .multiplyScalar(distance / SLOWING_RADIUS);
        } else {
          desiredVelocity.setLength(MAX_SPEED);
        }
        break;
      case "flee":
        desiredVelocity = boid.pos.clone().sub(target);
        desiredVelocity.setLength(MAX_SPEED);
        break;
    }
    boid.steering = desiredVelocity.sub(boid.vel);
    boid.update(game.ctx, 1, 60);
    if (boid.pos.x > game.canvas.width) {
      boid.pos.x = 0;
    }
    if (boid.pos.y > game.canvas.height) {
      boid.pos.y = 0;
    }
    if (boid.pos.x < 0) {
      boid.pos.x = game.canvas.width;
    }
    if (boid.pos.y < 0) {
      boid.pos.y = game.canvas.height;
    }
  });
  game.onRender((display, dt, fps) => {
    display.drawText(`State: ${boid.state}`, 10, 26, "#fff");

    // render mouse
    display.drawCircle(target.x, target.y, 10, "#8b95d9", null);
    display.setDashedStorke();
    display.drawCircle(target.x, target.y, SLOWING_RADIUS, null, "#ccc");

    display.setSolidStroke();
    boid.render(display);
  });

  game.run();
};
