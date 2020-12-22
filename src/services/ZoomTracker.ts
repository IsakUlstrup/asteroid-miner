import config from "@/config";

// https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events/Pinch_zoom_gestures
export default class ZoomTracker {
  evCache: PointerEvent[];
  prevDiff = -1;
  callback: Function;
  constructor(element: HTMLElement, callback: Function) {
    // this.init(element);
    this.evCache = [];
    this.callback = callback;
    // Install event handlers for the pointer target
    // var el=document.getElementById("target");
    // scroll event handler
    element.addEventListener(
      "wheel",
      event => {
        this.callback(event.deltaY * -config.scrollZoomSensitivity);
        event.preventDefault();
      },
      false
    );

    element.addEventListener("pointerdown", (event: PointerEvent) => {
      this.pointerdownHandler(event);
    });
    // element.onpointerdown = this.pointerdown_handler;
    // element.onpointermove = this.pointermove_handler;
    element.addEventListener("pointermove", (event: PointerEvent) => {
      this.pointermoveHandler(event);
    });

    // Use same handler for pointer{up,cancel,out,leave} events since
    // the semantics for these events - in this app - are the same.
    // element.onpointerup = this.pointerup_handler;
    element.addEventListener("pointerup", (event: PointerEvent) => {
      this.pointerupHandler(event);
    });
    // element.onpointercancel = this.pointerup_handler;
    element.addEventListener("pointercancel", (event: PointerEvent) => {
      this.pointerupHandler(event);
    });
    // element.onpointerout = this.pointerup_handler;
    element.addEventListener("pointerout", (event: PointerEvent) => {
      this.pointerupHandler(event);
    });
    // element.onpointerleave = this.pointerup_handler;
    element.addEventListener("pointerleave", (event: PointerEvent) => {
      this.pointerupHandler(event);
    });
  }
  removeEvent(ev: PointerEvent) {
    // Remove this event from the target's cache
    for (let i = 0; i < this.evCache.length; i++) {
      if (this.evCache[i].pointerId == ev.pointerId) {
        this.evCache.splice(i, 1);
        break;
      }
    }
  }
  pointerdownHandler(ev: PointerEvent) {
    // The pointerdown event signals the start of a touch interaction.
    // This event is cached to support 2-finger gestures
    this.evCache.push(ev);
    // log("pointerDown", ev);
  }
  pointermoveHandler(ev: PointerEvent) {
    ev.preventDefault();
    // This function implements a 2-pointer horizontal pinch/zoom gesture.
    //
    // If the distance between the two pointers has increased (zoom in),
    // the target element's background is changed to "pink" and if the
    // distance is decreasing (zoom out), the color is changed to "lightblue".
    //
    // This function sets the target element's border to "dashed" to visually
    // indicate the pointer's target received a move event.
    // log("pointerMove", ev);
    // ev.target.style.border = "dashed";
    // Find this event in the cache and update its record with this event
    for (let i = 0; i < this.evCache.length; i++) {
      if (ev.pointerId == this.evCache[i].pointerId) {
        this.evCache[i] = ev;
        break;
      }
    }

    // If two pointers are down, check for pinch gestures
    if (this.evCache.length == 2) {
      // Calculate the distance between the two pointers
      const curDiff = Math.abs(
        this.evCache[0].clientX - this.evCache[1].clientX
      );

      if (this.prevDiff > 0) {
        if (curDiff > this.prevDiff) {
          // The distance between the two pointers has increased
          // log("Pinch moving OUT -> Zoom in", ev);
          // ev.target.style.background = "pink";
          // console.log("in");
          this.callback(curDiff * config.pinchZoomSensitivity);
        }
        if (curDiff < this.prevDiff) {
          // The distance between the two pointers has decreased
          // log("Pinch moving IN -> Zoom out",ev);
          // ev.target.style.background = "lightblue";
          // console.log("out");
          this.callback(-curDiff * config.pinchZoomSensitivity);
        }
      }

      // Cache the distance for the next move event
      this.prevDiff = curDiff;
    }
  }
  pointerupHandler(ev: PointerEvent) {
    this.removeEvent(ev);

    // If the number of pointers down is less than two then reset diff tracker
    if (this.evCache.length < 2) {
      this.prevDiff = -1;
    }
  }
}
