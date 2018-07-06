export class Color {

  static lerp(c1, c2, n) {
    return new Color(
      (c2.r - c1.r) * n + c1.r,
      (c2.g - c1.g) * n + c1.g,
      (c2.b - c1.b) * n + c1.b,
      (c2.a - c1.a) * n + c1.a);
  }

  static fromHex(hex) {
    return new Color(
      parseInt(hex.substr(1, 2), 16),
      parseInt(hex.substr(3, 2), 16),
      parseInt(hex.substr(5, 2), 16));
  }

  constructor(r = 0, g = 0, b = 0, a = 1) {
    Object.assign(this, { r, g, b, a });
  }

  toString() {
    return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
  }

}

const SCALE_COLOR_RED = Color.fromHex('#EA9999');
const SCALE_COLOR_YELLOW = Color.fromHex('#FFE599');
const SCALE_COLOR_GREEN = Color.fromHex('#93C47D');

export function mapValueToColorScale(value, { red, yellow, green }) {
  const ratioA = ratioBetween(value, red, yellow);
  const ratioB = ratioBetween(value, yellow, green);
  if (ratioA <= 0) {
    return SCALE_COLOR_RED;
  }
  if (ratioA < 1) {
    return Color.lerp(SCALE_COLOR_RED, SCALE_COLOR_YELLOW, ratioA);
  }
  if (ratioB <= 0) {
    return SCALE_COLOR_YELLOW;
  }
  if (ratioB < 1) {
    return Color.lerp(SCALE_COLOR_YELLOW, SCALE_COLOR_GREEN, ratioB);
  }
  return SCALE_COLOR_GREEN;
}

function ratioBetween(value, a, b) {
  return (value - a) / (b - a);
}
