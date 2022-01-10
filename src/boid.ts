import { Vector2 } from "./vector2.js";
import {
  MAX_FORCE,
  MAX_SPEED,
  MASS,
  WANDER_DISTANCE,
  WANDER_RADIUS,
  SLOWING_RADIUS,
  FOOD_RADIUS,
  EAT_RATE,
} from "./config.js";
import { Display } from "./display.js";
import { Game } from "./game.js";
import { Food } from "./food.js";
const FEEDING_DISTANCE = 23;

export class Boid {
  vel: Vector2 = new Vector2(Math.random() * 2 - 1, Math.random() * 2 - 1);
  radius = 10;
  state = "wander";
  nextState = "";
  color = "#1691c9";
  desired = new Vector2();
  steering = new Vector2();
  food = 51 * Math.random() + 50;
  fleeTimeout = 0;
  wanderPoint = new Vector2();
  wanderTarget = new Vector2();
  feedingPosition = new Vector2();
  offset = 10;
  fleeing = false;
  target = new Vector2();
  foodTarget: Food | null = null;

  constructor(public game: Game, public pos: Vector2) {}

  private getNeighbors(boids: Boid[]) {
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
    const distance = desiredVelocity.length();
    if (distance < SLOWING_RADIUS + food.radius()) {
      this.nextState = "arrive";
    }

    return desiredVelocity.setLength(MAX_SPEED);
  }

  flee(target: Vector2): Vector2 {
    return this.pos.clone().sub(target).setLength(MAX_SPEED);
  }

  arrive(food: Food): Vector2 {
    this.feedingPosition = this.pos
      .clone()
      .sub(food.pos)
      .setLength(food.radius() + FEEDING_DISTANCE);
    const other = food.pos.clone().add(this.feedingPosition);
    //this.game.display.drawCircle(other.x, other.y, 10, "green", null);
    if (this.pos.distanceTo(other) <= 1) {
      this.nextState = "eat";
    }

    const desiredVelocity = other.clone().sub(this.pos);
    const distance = desiredVelocity.length();
    return desiredVelocity
      .setLength(MAX_SPEED)
      .multiplyScalar(distance / SLOWING_RADIUS);
  }

  eat(food: Food): Vector2 {
    food.feed(this);
    if (this.food >= 100) {
      this.nextState = "flee";
    }
    this.feedingPosition = this.pos
      .clone()
      .sub(food.pos)
      .setLength(food.radius() + FEEDING_DISTANCE);
    return food.pos.clone().add(this.feedingPosition);
  }

  burnFood(dt: number) {
    this.food -= (dt / 100) * this.vel.length();
  }

  seekNewFood() {
    if (this.state === "seek" || this.state === "arrive") {
      this.state = "wander";
    }
  }

  update(ctx: CanvasRenderingContext2D, dt: number, ts: number) {
    let desiredVelocity: Vector2;
    switch (this.state) {
      case "wander":
        desiredVelocity = this.wander();
        desiredVelocity.add(
          this.flee(this.findNearestFood(this.game.foods).pos).multiplyScalar(
            0.1
          )
        );
        this.burnFood(dt);
        break;
      case "flee":
        if (!this.fleeTimeout) {
          this.fleeTimeout = ts + 1000;
        } else if (ts > this.fleeTimeout) {
          if (this.food >= 50) {
            this.nextState = "wander";
          } else {
            this.seekNewFood();
            this.state = "seek";
          }
          this.fleeTimeout = 0;
        }
        desiredVelocity = new Vector2();
        if (!this.fleeing) {
          desiredVelocity = this.flee(this.foodTarget!.pos).multiplyScalar(2);
        }

        break;
      case "seek":
        desiredVelocity = this.seek(this.foodTarget!);
        desiredVelocity.add(this.wander());
        this.burnFood(dt);
        break;
      case "sleep":
        desiredVelocity = new Vector2();
        break;
      case "arrive":
        desiredVelocity = this.arrive(this.foodTarget!).maxScalar(0.5);
        this.burnFood(dt);
        break;
      case "eat":
        desiredVelocity = this.eat(this.foodTarget!);
        break;
      default:
        throw new Error(`Unknown state: ${this.state}`);
    }
    this.steering = desiredVelocity.sub(this.vel);
    const acceleration = this.steering.clone().divideScalar(MASS);

    // Update velocity and position
    if (this.state === "eat") {
      ///this.vel = desiredVelocity.normalize();
      this.pos = desiredVelocity;
    } else {
      this.vel.add(acceleration);
      this.pos.add(this.vel);
      // Decrease food
    }

    if (!["seek", "arrive", "eat"].includes(this.state) && this.food < 50) {
      this.foodTarget = this.findNearestFood(this.game.foods);
      this.nextState = "seek";
    }

    // Wrap boid around world
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

    if (this.food <= 0) {
      this.game.killBoid(this);
    }
    if (this.nextState) {
      this.state = this.nextState;
      this.nextState = "";
    }
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
    this.drawStatus(display);
    display.drawEllipse(
      this.pos.x,
      this.pos.y,
      this.radius,
      Math.max(1, this.radius * (this.food / 100)),
      this.vel.angle(),
      this.color,
      "#30b4f0"
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
      this.color
    );
    display.restore();
  }

  drawForces() {
    if (!this.game.drawForces) {
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
    display.drawText(`State: ${this.state}`, 10, 26, "#fff");
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
