import Module from "@/classes/Module";
import CanvasObject from "./CanvasObject";

export default class Ship extends CanvasObject {
  id = Math.random();
  // modules that don't need direct control
  internalModules: Module[] = [];
  internalModuleSlots: number;
  // main modules
  modules: Module[] = [];
  moduleSlots: number;
  position: Transform;
  constructor(
    internalModuleSlots = 4,
    moduleSlots = 4,
    position: Transform = { x: 0, y: 0, z: 0, r: 0, s: 0 },
    vector: Transform = { x: 0, y: 0, z: 0, r: 0, s: 0 },
    color: RGBColor = { r: 255, g: 0, b: 0 }
  ) {
    super(position, vector, color);
    this.internalModuleSlots = internalModuleSlots;
    this.moduleSlots = moduleSlots;
    this.position = position;

    // fill module slots with empty modules
    this.internalModules = new Array(this.internalModuleSlots).fill(
      new Module()
    );
    this.modules = new Array(this.moduleSlots).fill(new Module());
  }

  setModule(module: Module, slot: number, internal = false) {
    if (!internal) this.modules[slot] = module;
  }
  update(dt: number) {
    this.modules.forEach(m => {
      m.update(dt);
    });
  }
  draw(context: CanvasRenderingContext2D) {
    this.modules.forEach(m => {
      m.draw(context);
    });
  }
}
