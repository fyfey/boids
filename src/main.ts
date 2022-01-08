import { Game } from "./game.js";
import { Boid } from "./boid.js";
import { Vector2 } from "./vector2.js";
import { SLOWING_RADIUS, MAX_SPEED } from "./config.js";

window.onload = async function () {
  const game = new Game(500, 500, "canvas-container");

  const target = new Vector2(
    Math.random() * game.canvas.width + 1,
    Math.random() * game.canvas.height + 1
  );
  const boid = new Boid(new Vector2(250, 250), target);
  const playerImage = new Image();
  playerImage.src = "shadow_dog.png";

  window.addEventListener("mousedown", function (e) {
    console.log(e.clientX, e.clientY);
    boid.target.set(e.clientX, e.clientY);
  });

  game.onUpdate(() => {
    // Apply seek
    let desiredVelocity = target.clone().sub(boid.pos);
    const distance = desiredVelocity.length();
    console.log({ distance });
    if (distance < SLOWING_RADIUS) {
      desiredVelocity = desiredVelocity
        .setLength(MAX_SPEED)
        .multiplyScalar(distance / SLOWING_RADIUS);
    } else {
      // Outside the slowing area.
      desiredVelocity.setLength(MAX_SPEED);
    }

    // Set the steering based on this
    boid.steering = desiredVelocity.sub(boid.vel);

    // const distance = targetOffset.length();

    // let slowingRation = distance / SLOWING_RADIUS;
    // if (slowingRation < 0.01) {
    //   slowingRation = 0;
    // }
    // if (slowingRation < 1) {
    //   console.log(slowingRation);
    // }
    // const rampedSpeed = MAX_SPEED * slowingRation;
    // const clippedSpeed = Math.min(rampedSpeed, MAX_SPEED);
    // let desired = new Vector2();
    // if (distance > 0) {
    //   desired = targetOffset.multiplyScalar(clippedSpeed / distance);
    // }
    // boid.steering = desired.sub(boid.vel);

    boid.update(game.ctx, 1, 60);
  });
  game.onRender((display, dt, fps) => {

    display.clear();
    display.drawText(`FPS: ${fps.toLocaleString()}`, 10, 16, '#000');

    // render mouse
    display.drawCircle(target.x, target.y, 10, '#8b95d9', null);
    display.setDashedStorke();
    display.drawCircle(target.x, target.y, SLOWING_RADIUS, null, '#0f00f0');

    display.setSolidStroke();
    boid.render(display);
  });

  game.run();
};
