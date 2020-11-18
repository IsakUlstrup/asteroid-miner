declare interface RGBColor {
  r: number;
  g: number;
  b: number;
}

declare interface CMYKColor {
  c: number;
  m: number;
  y: number;
  k: number;
}

declare interface RGBAColor extends RGBColor {
  a: number;
}
