// import colorString from "color-string";
import colorConvert from "color-convert";

export default class Color {
  state: RGBAColor;

  constructor(color: RGBColor | CMYKColor | RGBAColor, opacity = 1) {
    // set default state
    this.state = {
      r: 0,
      g: 0,
      b: 0,
      a: 0
    };

    this.setColor(color, opacity);
  }
  isRGB(color: RGBColor | CMYKColor): color is RGBColor {
    return (color as RGBColor).r !== undefined;
  }
  isCMYK(color: RGBColor | CMYKColor): color is CMYKColor {
    return (color as CMYKColor).c !== undefined;
  }
  setColor(color: RGBColor | CMYKColor | RGBAColor, opacity = 1) {
    let convertedColor: number[];

    if (this.isCMYK(color)) {
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
    } else if (this.isRGB(color)) {
      this.state = {
        r: color.r,
        g: color.g,
        b: color.b,
        a: opacity
      };
    }
  }
  darken(amount: number) {
    this.state.r -= amount;
    if (this.state.r < 0) this.state.r = 0;
    this.state.g -= amount;
    if (this.state.g < 0) this.state.g = 0;
    this.state.b -= amount;
    if (this.state.b < 0) this.state.b = 0;
    return this.state;
  }
  rgb() {
    return this.state;
  }
  rgbString() {
    return `rgb(${this.rgb().r}, ${this.rgb().g}, ${this.rgb().b})`;
  }
  cmykString() {
    return `cmyk(${this.cmyk().c}, ${this.cmyk().m}, ${this.cmyk().y}, ${
      this.cmyk().k
    })`;
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
    };
  }
}
