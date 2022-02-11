import { hslToRgb, rgbToHsl } from "./colors.js";

export class Color {
  h: number;
  s: number;
  l: number;
  hex = "";

  constructor(
    public r: number,
    public g: number,
    public b: number,
    public a: number
  ) {
    const [h, s, l] = rgbToHsl(r, g, b);
    this.h = h;
    this.s = s;
    this.l = l;
    const alpha = this.a > 0 ? this.a / 255 : 0;
    this.hex = `rgba(${this.r}, ${this.g}, ${this.b}, ${alpha.toLocaleString(
      undefined,
      { maximumFractionDigits: 2 }
    )})`;
  }

  static fromHex(hex: string) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    let a = 255;
    if (hex.length === 9) {
      a = parseInt(hex.slice(7, 9), 16);
    }
    return new Color(r, g, b, a);
  }

  static randomPastel() {
    const hue = Math.random() * 360;
    const saturation = 100;
    const lightness = 50;
    const [r, g, b] = hslToRgb(hue, saturation, lightness);
    return new Color(r, g, b, 255);
  }

  withAlpha(alpha: number) {
    return new Color(this.r, this.g, this.b, alpha * 255);
  }

  withHue(hue: number) {
    const [r, g, b] = hslToRgb(hue, this.s, this.l);
    return new Color(r, g, b, this.a);
  }

  toHex() {
    const alpha = this.a > 0 ? this.a / 255 : 0;
    return `rgba(${this.r}, ${this.g}, ${this.b}, ${alpha.toLocaleString(
      undefined,
      { maximumFractionDigits: 2 }
    )})`;
  }

  toHsl() {
    return this.hex;
  }
}
