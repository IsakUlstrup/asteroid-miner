import Color from "@/classes/Color";
import CanvasObject from "@/classes/CanvasObject";
import config from "@/config";
import trianglify from "trianglify";

export default class Asteroid extends CanvasObject {
  points: number;
  bufferCanvas: HTMLCanvasElement;
  baseColor: string;
  color: Color;
  minedBuffer: CMYKColor;
  constructor(
    points: number,
    radius: number,
    color: CMYKColor,
    cameraPosition = 0
  ) {
    super(
      {
        x: Math.random() - 0.5,
        y: Math.random() - 0.5,
        z: cameraPosition + Math.random() * 5
      },
      {
        x: (Math.random() - 0.5) * 0.00001,
        y: (Math.random() - 0.5) * 0.00001,
        z: (Math.random() - 0.5) * 0.00007
      },
      radius * 2,
      Math.random() - 0.5 * 0.01,
      color
    );

    this.points = points;
    this.baseColor = new Color(color).rgbString();
    this.color = new Color(color);
    this.bufferCanvas = this.render(this.color.rgbString());
    this.minedBuffer = {
      c: 0,
      m: 0,
      y: 0,
      k: 0
    };
  }
  setColor(color: RGBColor | CMYKColor) {
    this.color.setColor(color);
    this.bufferCanvas = this.render(this.color.rgbString());
  }
  mine(color: CMYKColor): CMYKColor {
    const currentColor = this.color.cmyk();
    const mined = {
      c: 0,
      m: 0,
      y: 0,
      k: 0
    };

    // get amount mined
    mined.c = currentColor.c > color.c ? color.c : currentColor.c;
    mined.m = currentColor.m > color.m ? color.m : currentColor.m;
    mined.y = currentColor.y > color.y ? color.y : currentColor.y;
    mined.k = currentColor.k > color.k ? color.k : currentColor.k;

    // set mined buffer
    this.minedBuffer.c += mined.c;
    this.minedBuffer.m += mined.m;
    this.minedBuffer.y += mined.y;
    this.minedBuffer.k += mined.k;

    this.setColor({
      c: this.color.cmyk().c - mined.c > 0 ? this.color.cmyk().c - mined.c : 0,
      m: this.color.cmyk().m - mined.m > 0 ? this.color.cmyk().m - mined.m : 0,
      y: this.color.cmyk().y - mined.y > 0 ? this.color.cmyk().y - mined.y : 0,
      k: this.color.cmyk().k - mined.k > 0 ? this.color.cmyk().k - mined.k : 0
    });

    // store color to return
    const returnColor = {
      c: this.minedBuffer.c > 10 ? this.minedBuffer.c : 0,
      m: this.minedBuffer.m > 10 ? this.minedBuffer.m : 0,
      y: this.minedBuffer.y > 10 ? this.minedBuffer.y : 0,
      k: this.minedBuffer.k > 10 ? this.minedBuffer.k : 0
    };

    // subtract return color from buffer
    this.minedBuffer.c -= returnColor.c;
    this.minedBuffer.m -= returnColor.m;
    this.minedBuffer.y -= returnColor.y;
    this.minedBuffer.k -= returnColor.k;

    return returnColor;
  }
  fancyRender(color: Color) {
    const width = this.size;
    const height = this.size;

    // generate a spiral using polar coordinates
    const points = [];
    const NUM_POINTS = this.points;
    const darkenedColor = color.darken(50);
    let r = 0;
    const rStep = width / 2 / NUM_POINTS;
    let theta = 0;
    const thetaStep = (Math.PI / NUM_POINTS) * 18;
    for (let i = 0; i < NUM_POINTS; i++) {
      const x = width / 2 + r * Math.cos(theta);
      const y = height / 2 + r * Math.sin(theta);
      const point = [x, y];
      points.push(point);
      r += rStep;
      theta = (theta + thetaStep) % (2 * Math.PI);
    }

    // apply trianglify to convert the points to polygons and apply the color
    // gradient
    const pattern = trianglify({
      height,
      width,
      points,
      xColors: [
        color.rgbString(),
        `rgb(${darkenedColor.r}, ${darkenedColor.g}, ${darkenedColor.b})`
      ],
      yColors: "match",
      colorFunction: trianglify.colorFunctions.shadows(0.2),
      variance: 0
    });
    return pattern.toCanvas();
  }
  render(color: string) {
    const offScreenCanvas = document.createElement("canvas");
    offScreenCanvas.width = this.size;
    offScreenCanvas.height = this.size;
    const context = offScreenCanvas.getContext("2d");
    if (context) {
      if (config.debug)
        context.fillRect(0, 0, offScreenCanvas.width, offScreenCanvas.height);

      context.fillStyle = color;
      if (this.baseColor) context.strokeStyle = this.baseColor;
      context.lineWidth = 3;
      context.beginPath();
      for (let i = 0; i < this.points; i++) {
        const x =
          this.size / 2 +
          (this.size / 2) * 0.9 * Math.cos((2 * Math.PI * i) / this.points);
        const y =
          this.size / 2 +
          (this.size / 2) * 0.9 * Math.sin((2 * Math.PI * i) / this.points);
        context.lineTo(Math.floor(x), Math.floor(y));
      }
      context.closePath();
      // context.globalAlpha = 0.5;
      context.fill();
      // context.globalAlpha = 1;
      context.stroke();
    }
    return offScreenCanvas;
  }
}
