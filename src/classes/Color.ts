// import colorString from "color-string";
import colorConvert from "color-convert";

export enum ColorMode {
  rgb = "rgb",
  cmyk = "cmyk"
}

interface RGBColor {
  mode: ColorMode.rgb;
  r: number;
  g: number;
  b: number;
}

interface CMYKColor {
  mode: ColorMode.cmyk;
  c: number;
  m: number;
  y: number;
  k: number;
}

interface RGBAColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

export default class Color {
  state: RGBAColor;

  constructor(color: RGBColor | CMYKColor, opacity = 1) {
    // set default state
    this.state = {
      r: 0,
      g: 0,
      b: 0,
      a: 0
    };

    this.setColor(color, opacity);
  }

  setColor(color: RGBColor | CMYKColor, opacity = 1) {
    // convert color to rgb if needed
    let convertedColor: number[];
    switch (color.mode) {
      case ColorMode.rgb:
        this.state = {
          r: color.r,
          g: color.g,
          b: color.b,
          a: opacity
        };
        break;
      case ColorMode.cmyk:
        convertedColor = colorConvert.cmyk.rgb(
          color.c,
          color.m,
          color.y,
          color.k
        );
        this.state = {
          r: convertedColor[0],
          g: convertedColor[1],
          b: convertedColor[2],
          a: opacity
        };
        break;
      default:
        break;
    }
  }
  rgb() {
    return this.state;
  }
  cmyk() {
    const cmyk = colorConvert.rgb.cmyk(
      this.state.r,
      this.state.g,
      this.state.b
    );
    return {
      c: cmyk[0],
      m: cmyk[1],
      y: cmyk[2],
      k: cmyk[3]
    }
  }
}
