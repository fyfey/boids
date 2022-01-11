export class Rgba {
  constructor(
    public r: number,
    public g: number,
    public b: number,
    public a: number
  ) {}

  static fromHex(hex: string) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    let a = 255;
    if (hex.length === 9) {
      a = parseInt(hex.slice(7, 9), 16);
    }
    return new Rgba(r, g, b, a);
  }

  withAlpha(alpha: number) {
    return new Rgba(this.r, this.g, this.b, alpha * 255);
  }

  toHex() {
    const alpha = this.a > 0 ? this.a / 255 : 0;
    return `rgba(${this.r}, ${this.g}, ${this.b}, ${alpha.toLocaleString(
      undefined,
      { maximumFractionDigits: 2 }
    )})`;
  }
}
