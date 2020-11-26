export default class CursorTracker {
  position: Vector3D;
  active: boolean;
  element: HTMLElement;
  constructor(element: HTMLElement) {
    this.position = {
      x: 0,
      y: 0,
      z: 0,
      r: 0
    };
    this.active = false;
    this.element = element;
    // this is ugly and I hate it, but I had some scopting issues
    element.addEventListener(
      "mousedown",
      () => {
        this.cursorActive();
      },
      false
    );
    element.addEventListener(
      "touchstart",
      (event: TouchEvent) => {
        event.preventDefault();
        this.position.x = event.touches[0].clientX;
        this.position.y = event.touches[0].clientY;
        this.cursorActive();
      },
      false
    );
    element.addEventListener(
      "mouseup",
      () => {
        this.cursorInactive();
      },
      false
    );
    element.addEventListener(
      "mouseleave",
      () => {
        this.cursorInactive();
      },
      false
    );
    element.addEventListener(
      "touchend",
      () => {
        this.cursorInactive();
      },
      false
    );
    element.addEventListener(
      "touchcanel",
      () => {
        this.cursorInactive();
      },
      false
    );
    element.addEventListener(
      "mousemove",
      (event: MouseEvent) => {
        this.cursorMove(event);
      },
      false
    );

    element.addEventListener(
      "touchmove",
      (event: TouchEvent) => {
        this.cursorMove(event);
      },
      false
    );
  }
  cursorActive() {
    this.active = true;
  }
  cursorInactive() {
    this.active = false;
  }
  cursorMove(event: MouseEvent | TouchEvent) {
    event.preventDefault();
    const rect = this.element.getBoundingClientRect();
    if (event.type === "touchmove") {
      const touch = event as TouchEvent;
      const x = touch.touches[0].clientX;
      const y = touch.touches[0].clientY;

      if (x && y) {
        this.position.x = x - rect.left;
        this.position.y = y - rect.top;
      }
    } else if (event.type === "mousemove") {
      const move = event as MouseEvent;
      const x = move.clientX;
      const y = move.clientY;

      if (x && y) {
        this.position.x = x - rect.left;
        this.position.y = y - rect.top;
      }
    }
  }
}
