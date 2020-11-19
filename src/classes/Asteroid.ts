import Color from "@/classes/Color";
import CanvasObject from "@/classes/CanvasObject";

export default class Asteroid extends CanvasObject {
  points: number;
  radius: number;
  bufferCanvas: HTMLCanvasElement;
  baseColor: Color;
  color: Color;
  constructor(points: number, radius: number, color: CMYKColor) {
    super(
      {
        x: Math.random(),
        y: Math.random(),
        z: Math.random(),
        r: Math.random()
      },
      {
        x: (Math.random() - 0.5) * 0.0001,
        y: (Math.random() - 0.5) * 0.0001,
        z: (Math.random() - 0.5) * 0.00007,
        r: (Math.random() - 0.5) * 0.1
      },
      color
    );

    this.points = points;
    this.radius = radius;
    this.baseColor = new Color(color);
    this.color = new Color(color);
    this.bufferCanvas = this.createOffscreenCanvas(this.color.rgbString());
  }
  setColor(color: RGBColor | CMYKColor) {
    this.color.setColor(color);
    this.bufferCanvas = this.createOffscreenCanvas(this.color.rgbString());
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

    // console.log(mined);
    this.setColor({
      c: this.color.cmyk().c - mined.c,
      m: this.color.cmyk().m - mined.m,
      y: this.color.cmyk().y - mined.y,
      k: this.color.cmyk().k - mined.k
    });
    return mined;
  }
  createOffscreenCanvas(color: string) {
    const offScreenCanvas = document.createElement("canvas");
    offScreenCanvas.width = this.radius * 2;
    offScreenCanvas.height = this.radius * 2;
    const context = offScreenCanvas.getContext("2d");
    if (context) {
      // context.fillRect(0, 0, offScreenCanvas.width, offScreenCanvas.height);
      context.fillStyle = color;
      if (this.baseColor) context.strokeStyle = this.baseColor.rgbString();
      context.lineWidth = 4;
      context.beginPath();
      for (let i = 0; i < this.points; i++) {
        const x =
          this.radius +
          this.radius * 0.9 * Math.cos((2 * Math.PI * i) / this.points);
        const y =
          this.radius +
          this.radius * 0.9 * Math.sin((2 * Math.PI * i) / this.points);
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
  draw(context: CanvasRenderingContext2D, resolutionScale: number) {
    this.project(context, resolutionScale);
    context.save();
    // rotate
    context.translate(this.projected.x, this.projected.y);
    context.rotate((this.position.r * Math.PI) / 180);
    context.translate(-this.projected.x, -this.projected.y);
    // draw
    context.drawImage(
      this.bufferCanvas,
      Math.floor(this.projected.x - this.radius * this.projected.s),
      Math.floor(this.projected.y - this.radius * this.projected.s),
      this.radius * 2 * this.projected.s,
      this.radius * 2 * this.projected.s
    );
    context.restore();
    // center of rotation debug
    // context.fillRect(this.px - 2.5, this.py - 2.5, 5, 5);
  }
}
