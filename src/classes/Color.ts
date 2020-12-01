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
  isWithinRange(value: number, min: number, max: number) {
    return value >= min && value <= max;
  }
  isValidCMYKChanel(value: number) {
    return this.isWithinRange(value, 0, 100);
  }
  validateChanel(chanel: number, min: number, max: number) {
    if (chanel < min) {
      return min;
    }
    if (chanel > max) {
      return max;
    }
    return chanel;
  }
  validateCMYKChanel(chanel: number) {
    return this.validateChanel(chanel, 0, 100);
  }
  validateRGBChanel(chanel: number) {
    return this.validateChanel(chanel, 0, 255);
  }
  setColor(color: RGBColor | CMYKColor | RGBAColor, opacity = 1) {
    let convertedColor: number[];

    if (this.isCMYK(color)) {
      convertedColor = colorConvert.cmyk.rgb(
        this.validateCMYKChanel(color.c),
        this.validateCMYKChanel(color.m),
        this.validateCMYKChanel(color.y),
        this.validateCMYKChanel(color.k)
      );
      this.state = {
        r: convertedColor[0],
        g: convertedColor[1],
        b: convertedColor[2],
        a: opacity
      };
    } else if (this.isRGB(color)) {
      this.state = {
        r: this.validateRGBChanel(color.r),
        g: this.validateRGBChanel(color.g),
        b: this.validateRGBChanel(color.b),
        a: opacity
      };
    }
  }
  darken(amount: number): RGBColor {
    let r = this.state.r,
      g = this.state.g,
      b = this.state.b;

    r -= amount;
    if (r < 0) r = 0;
    g -= amount;
    if (g < 0) g = 0;
    b -= amount;
    if (b < 0) b = 0;
    return {
      r,
      g,
      b
    };
  }
  rgb() {
    return {
      r: this.state.r,
      g: this.state.g,
      b: this.state.b
    };
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
