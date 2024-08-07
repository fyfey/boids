import { Color } from "./color.js";
import { Display } from "./display.js";
import { Game } from "./game.js";
import { Vector2 } from "./vector2.js";

export class BlurCircle {
  position: Vector2;
  blur = Math.random() * 10 + 10;
  color: Color;
  radius = Math.random() * 50 + 50;

  constructor(game: Game) {
    const [x, y] = game.randomPosition().toArray();
    this.color = Color.randomPastel().withAlpha(Math.random() * 0.5);
    this.position = new Vector2(x, y);
  }

  render(display: Display) {
    display.save();
    display.filter(`blur(${this.blur}px)`);
    display.drawCircle(
      this.position.x,
      this.position.y,
      this.radius,
      this.color.toHex(),
      this.color.toHex(),
    );
    display.restore();
  }
}
