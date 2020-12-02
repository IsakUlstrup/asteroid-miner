import CanvasWrapper from "@/classes/CanvasWrapper";
import Color from "@/classes/Color";
import Asteroid from "./Asteroid";
import Ore, { OreType } from "@/classes/Ore";
import TargetedModule, {
  TargetMode,
  HitScanType
} from "@/classes/TargetedModule";
import CanvasObject from "./CanvasObject";

export default class Laser extends TargetedModule {
  perspective = 1;
  color: Color;
  position: number;
  target: Asteroid | undefined;
  constructor(
    name = "a laser",
    canvasObjects: CanvasObject[],
    targetMode: TargetMode,
    effect: number
  ) {
    super(name, effect, targetMode, canvasObjects, HitScanType.point);
    this.color = new Color({ c: 100, m: 0, y: 0, k: 0 });
    this.position = 0;
  }

  setColor(color: RGBColor | CMYKColor) {
    this.color.setColor(color);
  }
  laserTo(x: number, y: number, canvas: CanvasWrapper) {
    canvas.context.fillStyle = this.color.rgbString();
    canvas.context.lineCap = "round";
    canvas.context.beginPath();
    canvas.context.lineJoin = "round";
    canvas.context.moveTo(this.position, canvas.size.height);
    canvas.context.lineTo(x - this.perspective, y);
    canvas.context.lineTo(x + this.perspective, y);
    canvas.context.lineTo(this.position + 10, canvas.size.height);
    canvas.context.fill();
  }
  mine(target: Asteroid, effect: number) {
    const miningColor = this.color.cmyk();
    const mined = target.mine({
      c: miningColor.c * effect,
      m: miningColor.m * effect,
      y: miningColor.y * effect,
      k: miningColor.k * effect
    });

    if (mined.c > 0) {
      this.canvasObjects.push(
        this.generateOre(target.transform, target.vector, OreType.cyan, mined.c)
      );
    }

    if (mined.m > 0) {
      this.canvasObjects.push(
        this.generateOre(
          target.transform,
          target.vector,
          OreType.magenta,
          mined.m
        )
      );
    }

    if (mined.y > 0) {
      this.canvasObjects.push(
        this.generateOre(
          target.transform,
          target.vector,
          OreType.yellow,
          mined.y
        )
      );
    }

    if (mined.k > 0) {
      this.canvasObjects.push(
        this.generateOre(
          target.transform,
          target.vector,
          OreType.black,
          mined.k
        )
      );
    }
  }
  generateOre(
    transform: Vector3,
    vector: Vector3,
    type: OreType,
    amount: number
  ) {
    return new Ore(
      {
        x: transform.x + (Math.random() - 0.5) * 0.1,
        y: transform.y + (Math.random() - 0.5) * 0.1,
        z: transform.z
      },
      vector,
      type,
      amount
    );
  }
  isValidTarget(target: CanvasObject) {
    if (target.isOffscreen) return false;
    const targetColor = target.color.cmyk();
    const miningColor = this.color.cmyk();
    if (
      (miningColor.c > 0 && targetColor.c <= 0) ||
      (miningColor.m > 0 && targetColor.m <= 0) ||
      (miningColor.y > 0 && targetColor.y <= 0) ||
      (miningColor.k > 0 && targetColor.k <= 0)
    )
      return false;

    return true;
  }
  use(targets: Asteroid[], effect: number) {
    // this.mine(target, effect)
    this.target = targets[0];
    this.mine(this.target, effect);
  }
  filterTargets() {
    return this.canvasObjects.filter(o => o instanceof Asteroid) as Asteroid[];
  }
  draw(canvas: CanvasWrapper, index: number, slotAmount: number) {
    const spacing = canvas.size.width / slotAmount;
    this.position = spacing * index;
    if (this.targetMode === TargetMode.auto && this.target) {
      this.laserTo(this.target.projected.x, this.target.projected.y, canvas);
    }
    if (this.targetMode === TargetMode.manual && canvas.cursor.active) {
      this.laserTo(canvas.cursor.position.x, canvas.cursor.position.y, canvas);
    }
  }
}
