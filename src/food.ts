import { Boid } from "./boid.js";
import { Color } from "./color.js";
import { EAT_RATE, FOOD_RADIUS, SLOWING_RADIUS } from "./config.js";
import { Display } from "./display.js";
import { Game } from "./game.js";
import { Vector2 } from "./vector2.js";

export class Food {
  capacity: number;
  color = Color.fromHex("#1691c9").withHue(Math.random() * 200);
  food: number;
  killed = false;
  constructor(private game: Game, public pos: Vector2) {
    this.capacity = Math.random() * 500 + 100;
    this.food = this.capacity;
  }

  update(dt: number) {}

  feed(boid: Boid) {
    if (this.food > 0) {
    } else {
      //boid.state = "flee";
      //this.game.boids.forEach((b) => b.seekNewFood());
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
      this.color.withAlpha(0.7).toHex(),
      this.color.toHex()
    );
    display.restore();
  }
}
