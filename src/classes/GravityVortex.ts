import CanvasObject from "@/classes/CanvasObject";
import TargetedModule, {
  TargetMode,
  HitScanType
} from "@/classes/TargetedModule";
import Ore from "./Ore";
import CanvasWrapper from "@/classes/CanvasWrapper";

export default class GravityVortex extends TargetedModule {
  constructor(
    name: string,
    canvasObjects: CanvasObject[],
    targetMode: TargetMode,
    effect: number
  ) {
    super(name, effect, targetMode, canvasObjects, HitScanType.radius);
  }

  filterTargets() {
    return this.canvasObjects.filter(o => o instanceof Ore) as Ore[];
  }
  isValidTarget(target: Ore) {
    if (!target.isOffscreen && target.visible && target.amount > 0) {
      return true;
    }
    return false;
  }
  use(targets: Ore[], effect: number) {
    targets.forEach(t => {
      const gathered = t.gather(0.5);
    });
  }
  drawCircle(x: number, y: number, r: number, canvas: CanvasWrapper) {
    canvas.context.beginPath();
    canvas.context.arc(x, y, r, 0, 2 * Math.PI, false);
    canvas.context.lineWidth = 1;
    canvas.context.strokeStyle = "#222";
    canvas.context.stroke();
  }
  draw(canvas: CanvasWrapper, index: number, slotAmount: number) {
    // const spacing = canvas.size.width / slotAmount;
    // this.position = spacing * index;
    if (this.targetMode === TargetMode.auto && this.targets.length > 0) {
      this.drawCircle(
        this.targets[0].projected.x,
        this.targets[0].projected.y,
        this.effect,
        canvas
      );
      // this.laserTo(this.target.projected.x, this.target.projected.y, canvas);
    }
    if (this.targetMode === TargetMode.manual && canvas.cursor.active) {
      this.drawCircle(
        canvas.cursor.position.x,
        canvas.cursor.position.y,
        this.effect,
        canvas
      );
      // this.laserTo(canvas.cursor.position.x, canvas.cursor.position.y, canvas);
    }
  }
}
