import { Boid } from "./boid.js";
import { EAT_RATE, FOOD_RADIUS, SLOWING_RADIUS } from "./config.js";
import { Display } from "./display.js";
import { Game } from "./game.js";
import { Vector2 } from "./vector2.js";

export class Food {
  capacity: number;
  food: number;
  killed = false;
  constructor(private game: Game, public pos: Vector2) {
    this.capacity = Math.random() * 500 + 100;
    this.food = this.capacity;
  }

  update(dt: number) {}

  feed(boid: Boid) {
    if (this.food > 0) {
      if (this.food < EAT_RATE) {
        this.food = 0;
        boid.food += this.food;
      } else {
        this.food -= EAT_RATE;
        boid.food += EAT_RATE;
      }
    } else {
      boid.state = "flee";
      this.game.boids.forEach((b) => b.seekNewFood());
      if (this.killed) {
        return;
      }
      this.game.killFood(this);
      this.killed = true;
    }
  }

  radius() {
    return FOOD_RADIUS * (this.food / this.capacity);
  }

  render(display: Display, dt: number) {
    display.save();
    display.lineWidth(4);
    display.drawCircle(
      this.pos.x,
      this.pos.y,
      this.radius(),
      "#2444b5",
      "#395ddb"
    );
    display.restore();
  }
}
