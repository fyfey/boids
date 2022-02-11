import { Color } from "./color.js";
import { Game } from "./game.js";
import { Portal } from "./state/Portal.js";
import { Vector2 } from "./vector2.js";

export class PortalManager {
  private start?: Portal;
  private end?: Portal;
  private next: "start" | "end" = "start";

  constructor(private game: Game, private color: Color) {}

  handleClick(x: number, y: number) {
    switch (this.next) {
      case "start":
        this.start = new Portal(this.game, new Vector2(x, y), this.color);
        this.next = "end";
        break;
      case "end":
        this.end = new Portal(this.game, new Vector2(x, y), this.color);
        this.next = "start";
        break;
    }
  }

  update() {
    if (!this.start || !this.end) {
      return;
    }

    // this.game.boids.forEach((boid) => {
    //   var dx = this!.start!.position.x + this.radius - (circle2.x + circle2.radius);
    //   var dy = circle1.y + circle1.radius - (circle2.y + circle2.radius);
    //   var distance = Math.sqrt(dx * dx + dy * dy);

    //   if (distance < circle1.radius + circle2.radius) {
    //     // collision detected!
    //     this.color = "green";
    //   } else {
    //     // no collision
    //     this.color = "blue";
    //   }
    // });
  }

  render() {
    if (this.start) {
      this.start.render();
    }
    if (this.end) {
      this.end.render();
    }
  }
}
