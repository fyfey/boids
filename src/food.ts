import { FOOD_RADIUS } from "./config.js";
import { Display } from "./display.js";
import { Game } from "./game.js";
import { Vector2 } from "./vector2.js";

export class Food {
  private pos: Vector2;
  private food = 1;
  constructor(private game: Game) {
    this.pos = new Vector2(
      Math.random() * this.game.width,
      Math.random() * this.game.height
    );
  }

  update(dt: number) {}

  render(display: Display, dt: number) {
    display.drawCircle(
      this.pos.x,
      this.pos.y,
      FOOD_RADIUS * this.food,
      null,
      "#f00"
    );
  }
}
