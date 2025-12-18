import { TWO_PI } from "./config.js";
import { Game } from "./game.js";
import { Color } from "./color.js";

export class Display {
  public width: number;
  public height: number;

  constructor(
    public ctx: CanvasRenderingContext2D,
    public game: Game,
  ) {
    this.width = game.width;
    this.height = game.height;
  }

  setDashedStorke() {
    this.ctx.setLineDash([2, 10]);
  }
  setSolidStroke() {
    this.ctx.setLineDash([]);
  }

  lineCap(cap: CanvasLineCap) {
    this.ctx.lineCap = cap;
  }

  filter(filter: string) {
    this.ctx.filter = filter;
  }

  clear() {
    this.ctx.fillStyle = Color.fromHex(this.game.bgColor)
      .withAlpha(1)
      .toHex();
    this.ctx.fillRect(0, 0, this.game.width, this.game.height);
  }

  drawText(text: string, x: number, y: number, color: string) {
    this.ctx.fillStyle = color;
    this.ctx.fillText(text, x, y);
  }

  drawLine(x1: number, y1: number, x2: number, y2: number, color: string) {
    this.ctx.save();
    this.ctx.strokeStyle = color;
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
    this.ctx.restore();
  }

  save() {
    this.ctx.save();
  }

  restore() {
    this.ctx.restore();
  }

  lineWidth(width: number) {
    this.ctx.lineWidth = width;
  }

  drawCircle(
    x: number,
    y: number,
    radius: number,
    fillStyle: string | null,
    strokeStyle: string | null,
  ) {
    this.ctx.save();
    if (fillStyle) {
      this.ctx.fillStyle = fillStyle;
    }
    if (strokeStyle) {
      this.ctx.strokeStyle = strokeStyle;
    }
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, TWO_PI);
    if (strokeStyle) {
      this.ctx.stroke();
    }
    if (fillStyle) {
      this.ctx.fill();
    }
    this.ctx.restore();
  }

  drawEllipse(
    x: number,
    y: number,
    radiusX: number,
    radiusY: number,
    rotation: number,
    fillStyle: string | null,
    strokeStyle: string | null,
  ) {
    this.ctx.save();
    if (fillStyle) {
      this.ctx.fillStyle = fillStyle;
    }
    if (strokeStyle) {
      this.ctx.strokeStyle = strokeStyle;
    }
    this.ctx.beginPath();
    this.ctx.ellipse(x, y, radiusX, radiusY, rotation, 0, TWO_PI);
    if (strokeStyle) {
      this.ctx.stroke();
    }
    if (fillStyle) {
      this.ctx.fill();
    }
    this.ctx.restore();
  }

  render() {
    // No longer needed - drawing directly to canvas
  }
}
