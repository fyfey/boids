import { Vector2 } from "./vector2.js";
import {
  MAX_SPEED,
  MASS,
  WANDER_DISTANCE,
  WANDER_RADIUS,
  DRAW_FORCES,
} from "./config.js";
import { Display } from "./display.js";
import { Game } from "./game.js";
import { Food } from "./food.js";
import { Color } from "./color.js";
import { StateMachine } from "./state/StateMachine.js";
import {
  ArriveState,
  DeadState,
  EatState,
  FleeState,
  SeekState,
  WanderState,
} from "./state/index.js";

export class Boid {
  vel: Vector2 = new Vector2(Math.random() * 2 - 1, Math.random() * 2 - 1);
  radius = 10;
  //state = "wander";
  nextState = "";
  states = new StateMachine(this.game);
  color = Color.fromHex("#1691c9").withHue(Math.random() * 200);
  offset = 2;
  desired = new Vector2();
  steering = new Vector2();
  food = 51 * Math.random() + 50;
  // fleeTimeout = 0;
  wanderTarget = new Vector2();
  wanderPoint = new Vector2();
  alpha = 0.8;
  // feedingPosition = new Vector2();
  // fleeing = false;
  // target = new Vector2();
  // foodTarget: Food | null = null;

  constructor(public game: Game, public pos: Vector2) {
    this.states
      .add(WanderState)
      .add(SeekState)
      .add(ArriveState)
      .add(EatState)
      .add(FleeState)
      .add(DeadState)
      .start("wander");
  }

  getNeighbors(boids: Boid[]) {
    const neighbors = [];
    for (let i = 0; i < boids.length; i++) {
      const other = boids[i];
      if (other !== this) {
        const d = this.pos.distanceTo(other.pos);
        if (d < 100) {
          neighbors.push({ boid: other, distance: d });
        }
      }
    }
    return neighbors;
  }

  wander(): Vector2 {
    this.wanderPoint = this.vel
      .clone()
      .setLength(WANDER_DISTANCE)
      .add(this.pos);

    const vOffset = new Vector2();
    vOffset.random().setLength(this.offset * 0.5);
    this.wanderTarget.add(vOffset);

    let v = this.wanderTarget
      .clone()
      .sub(this.wanderPoint)
      .setLength(WANDER_RADIUS);

    this.wanderTarget.copy(this.wanderPoint.clone().add(v));

    return this.wanderTarget.clone().sub(this.pos).setLength(MAX_SPEED);
  }

  seek(food: Food): Vector2 {
    const desiredVelocity = food.pos.clone().sub(this.pos);
    return desiredVelocity.setLength(MAX_SPEED);
  }

  flee(target: Vector2): Vector2 {
    return this.pos.clone().sub(target).setLength(MAX_SPEED);
  }

  burnFood(dt: number) {
    this.food -= (dt / 100) * this.vel.length();
  }

  // seekNewFood() {
  //   if (this.state === "seek" || this.state === "arrive") {
  //     this.state = "wander";
  //   }
  // }

  update(ctx: CanvasRenderingContext2D, dt: number, ts: number) {
    this.states.update(this, dt, ts);
    if (this.food <= 0) {
      this.states.enterState("dead", this);
    }
    if (this.pos.x > this.game.canvas.width) {
      this.pos.x = 0;
    }
    if (this.pos.y > this.game.canvas.height) {
      this.pos.y = 0;
    }
    if (this.pos.x < 0) {
      this.pos.x = this.game.canvas.width;
    }
    if (this.pos.y < 0) {
      this.pos.y = this.game.canvas.height;
    }
  }

  applyForce(desiredVelocity: Vector2) {
    this.steering = desiredVelocity.sub(this.vel);
    const acceleration = this.steering.clone().divideScalar(MASS);
    this.vel.add(acceleration);
    this.pos.add(this.vel);
  }

  findNearestFood(food: Food[]): Food {
    let nearestFood = food[0];
    let nearestDistance = this.pos.distanceTo(nearestFood.pos);
    for (let i = 1; i < food.length; i++) {
      const other = food[i];
      const d = this.pos.distanceTo(other.pos);
      if (d < nearestDistance) {
        nearestFood = other;
        nearestDistance = d;
      }
    }
    return nearestFood;
  }

  render(display: Display, dt: number) {
    // Draw body
    display.save();
    display.lineWidth(3);
    //this.drawStatus(display);
    display.drawEllipse(
      this.pos.x,
      this.pos.y,
      this.radius,
      Math.max(1, this.radius * (this.food / 100)),
      this.vel.angle(),
      this.color.withAlpha(this.alpha).toHex(),
      this.color.withAlpha(this.alpha + 0.1).toHex()
    );

    const angle = this.vel.angle();
    const direction = new Vector2(Math.cos(angle), Math.sin(angle));
    const startPoint = this.pos.clone();
    direction.multiplyScalar(11);
    startPoint.add(direction);
    const newPoint = startPoint.clone();
    newPoint.add(direction);
    display.lineWidth(2);
    display.drawLine(
      startPoint.x,
      startPoint.y,
      newPoint.x,
      newPoint.y,
      this.color.withAlpha(this.alpha).toHex()
    );
    display.restore();
    this.drawForces();
  }

  drawForces() {
    if (!DRAW_FORCES) {
      return;
    }
    this.game.display.drawCircle(
      this.wanderPoint.x,
      this.wanderPoint.y,
      WANDER_RADIUS,
      "transparent",
      "#0f0"
    );
    this.game.display.drawLine(
      this.pos.x,
      this.pos.y,
      this.wanderPoint.x,
      this.wanderPoint.y,
      "#00ff00"
    );

    this.game.display.drawCircle(
      this.wanderTarget.x,
      this.wanderTarget.y,
      this.offset,
      "transparent",
      "#0f0"
    );
    this.game.display.drawLine(
      this.pos.x,
      this.pos.y,
      this.wanderTarget.x,
      this.wanderTarget.y,
      "#00ff00"
    );
  }
  drawStatus(display: Display) {
    display.drawText(`State: ${this.states.getState()}`, 10, 26, "#fff");
    display.drawText(
      `Food: ${this.food.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      10,
      36,
      "#fff"
    );
    display.drawText(
      `Speed: ${this.vel.length().toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      10,
      46,
      "#fff"
    );
  }
}
