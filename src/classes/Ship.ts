import Module from "@/classes/Module";
import CanvasObject from "./CanvasObject";
import CanvasWrapper from "@/classes/CanvasWrapper";

export default class Ship extends CanvasObject {
  id = Math.random();
  // modules that don't need direct control
  internalModules: Module[] = [];
  internalModuleSlots: number;
  // main modules
  modules: Module[] = [];
  moduleSlots: number;
  inventory = {
    c: 0,
    m: 0,
    y: 0,
    k: 0
  };
  constructor(
    internalModuleSlots = 4,
    moduleSlots = 4,
    position: Vector3 = { x: 0, y: 0, z: 0 },
    vector: Vector3 = { x: 0, y: 0, z: 0 },
    color: RGBColor = { r: 255, g: 0, b: 0 }
  ) {
    super(position, vector, 1, 0, color);
    this.internalModuleSlots = internalModuleSlots;
    this.moduleSlots = moduleSlots;

    // fill module slots with empty modules
    this.internalModules = new Array(this.internalModuleSlots).fill(
      new Module("empty module", 1)
    );
    this.modules = new Array(this.moduleSlots).fill(
      new Module("empty module", 1)
    );
  }

  setModule(module: Module, slot: number, internal = false) {
    if (!internal) this.modules[slot] = module;
  }
  update(dt: number, canvas: CanvasWrapper) {
    this.transform.z += this.vector.z * dt;

    this.modules.forEach(m => {
      m.update(dt, canvas);
    });
  }
  draw(canvas: CanvasWrapper) {
    for (let index = 0; index < this.modules.length; index++) {
      const module = this.modules[index];
      module.draw(canvas, index, this.modules.length);
    }
  }
}
