import { TWO_PI } from "./config.js";
import { Game } from "./game.js";

export class Display {
  private canvas: HTMLCanvasElement;
  private buffer: CanvasRenderingContext2D;

  constructor(private context: CanvasRenderingContext2D, private game: Game) {
    this.canvas = document.createElement("canvas");
    this.canvas.width = this.game.width;
    this.canvas.height = this.game.height;
    const ctx = this.canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Failed to get context");
    }
    this.buffer = ctx;
  }

  setDashedStorke() {
    this.buffer.setLineDash([2, 10]);
  }
  setSolidStroke() {
    this.buffer.setLineDash([]);
  }

  clear() {
    this.buffer.fillStyle = this.game.bgColor;
    this.buffer.fillRect(0, 0, this.game.width, this.game.height);
  }

  drawText(text: string, x: number, y: number, color: string) {
    this.buffer.fillStyle = color;
    this.buffer.fillText(text, x, y);
  }

  drawLine(x1: number, y1: number, x2: number, y2: number, color: string) {
    this.buffer.save();
    this.buffer.strokeStyle = color;
    this.buffer.beginPath();
    this.buffer.moveTo(x1, y1);
    this.buffer.lineTo(x2, y2);
    this.buffer.stroke();
    this.buffer.restore();
  }

  save() {
    this.buffer.save();
  }

  restore() {
    this.buffer.restore();
  }

  lineWidth(width: number) {
    this.buffer.lineWidth = width;
  }

  drawCircle(
    x: number,
    y: number,
    radius: number,
    fillStyle: string | null,
    strokeStyle: string | null
  ) {
    this.buffer.save();
    if (fillStyle) {
      this.buffer.fillStyle = fillStyle;
    }
    if (strokeStyle) {
      this.buffer.strokeStyle = strokeStyle;
    }
    this.buffer.beginPath();
    this.buffer.arc(x, y, radius, 0, TWO_PI);
    if (strokeStyle) {
      this.buffer.stroke();
    }
    if (fillStyle) {
      this.buffer.fill();
    }
    this.buffer.restore();
  }

  drawEllipse(
    x: number,
    y: number,
    radiusX: number,
    radiusY: number,
    rotation: number,
    fillStyle: string | null,
    strokeStyle: string | null
  ) {
    this.buffer.save();
    if (fillStyle) {
      this.buffer.fillStyle = fillStyle;
    }
    if (strokeStyle) {
      this.buffer.strokeStyle = strokeStyle;
    }
    this.buffer.beginPath();
    this.buffer.ellipse(x, y, radiusX, radiusY, rotation, 0, TWO_PI);
    if (strokeStyle) {
      this.buffer.stroke();
    }
    if (fillStyle) {
      this.buffer.fill();
    }
    this.buffer.restore();
  }

  render() {
    this.context.drawImage(this.canvas, 0, 0);
  }
}
