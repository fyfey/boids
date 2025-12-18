import { hslToRgb, rgbToHsl } from "./colors.js";

export class Color {
  h: number = 0;
  s: number = 0;
  l: number = 0;
  private _hslComputed = false;
  private _cachedRgbaString: string | null = null;

  constructor(
    public r: number,
    public g: number,
    public b: number,
    public a: number,
  ) {}

  private ensureHsl() {
    if (!this._hslComputed) {
      const [h, s, l] = rgbToHsl(this.r, this.g, this.b);
      this.h = h;
      this.s = s;
      this.l = l;
      this._hslComputed = true;
    }
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

  set(r: number, g: number, b: number, a: number) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
    this._hslComputed = false;
    this._cachedRgbaString = null;
  }

  setAlpha(alpha: number) {
    this.a = alpha * 255;
    this._cachedRgbaString = null;
  }

  setHue(hue: number) {
    this.ensureHsl();
    const [r, g, b] = hslToRgb(hue, this.s, this.l);
    this.r = r;
    this.g = g;
    this.b = b;
    this.h = hue;
    this._cachedRgbaString = null;
  }

  withAlpha(alpha: number) {
    return new Color(this.r, this.g, this.b, alpha * 255);
  }

  withHue(hue: number) {
    this.ensureHsl();
    const [r, g, b] = hslToRgb(hue, this.s, this.l);
    return new Color(r, g, b, this.a);
  }

  toHex() {
    if (!this._cachedRgbaString) {
      const alpha = this.a > 0 ? this.a / 255 : 0;
      this._cachedRgbaString = `rgba(${this.r}, ${this.g}, ${this.b}, ${alpha.toFixed(2)})`;
    }
    return this._cachedRgbaString;
  }

  toHsl() {
    return this.toHex();
  }
}
