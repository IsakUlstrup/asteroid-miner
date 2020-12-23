export default class Vector2 {
  x: number;
  y: number;
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  distanceTo(target: Vector2) {
    const a = this.x - target.x;
    const b = this.y - target.y;
    return Math.hypot(a, b);
  }
  radianTo(target: Vector2) {
    const dx = target.x - this.x;
    const dy = target.y - this.y;
    return Math.atan2(dy, dx);
  }
  directTowards(target: Vector2) {
    const angle = this.radianTo(target);
    this.x = Math.cos(angle);
    this.y = Math.sin(angle);
  }
}
