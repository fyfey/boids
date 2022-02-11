import { Color } from "../color.js";
import { Game } from "../game.js";
import { Vector2 } from "../vector2.js";

export class Portal {
  radius = 30;

  constructor(private game: Game, position: Vector2, private color: Color) {}

  render() {
    // this.game.display.save();
    // this.game.display.drawCircle(
    //   this.position.x,
    //   this.position.y,
    //   this.radius,
    //   this.color.toHex(),
    //   this.color.toHex()
    // );
    // this.game.display.restore();
  }
}
