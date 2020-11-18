export default class CursorTracker {
  x: number;
  y: number;
  active: boolean;
  constructor(element: HTMLElement) {
    this.x = 0;
    this.y = 0;
    this.active = false;
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
        this.x = event.touches[0].clientX;
        this.y = event.touches[0].clientY;
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
    if (event.type === "touchmove") {
      const touch = event as TouchEvent;
      const x = touch.touches[0].clientX;
      const y = touch.touches[0].clientY;

      if (x && y) {
        this.x = x;
        this.y = y;
      }
    } else if (event.type === "mousemove") {
      const move = event as MouseEvent;
      const x = move.clientX;
      const y = move.clientY;

      if (x && y) {
        this.x = x;
        this.y = y;
      }
    }
  }
}
