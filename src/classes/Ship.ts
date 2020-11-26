import { ShipType, ModuleType, OreType } from "../types/enums";
import Module from "./Module";

export default class Ship {
  modules: Module[];
  moduleSlots: number;
  internalModules: Module[] = [];
  internalModuleSlots: number;
  name: string;
  type: ShipType;
  position: number;
  vector: number;
  inventory: CMYKColor;
  inventorySize: number;
  surplusEnergy: number;

  constructor(name: string, slots: number, internalSlots = 4) {
    this.name = name;
    this.moduleSlots = slots;
    this.internalModuleSlots = internalSlots;
    this.modules = new Array(slots);
    this.modules.fill(new Module({ moduleType: ModuleType.none }));
    this.type = ShipType.eve;
    this.position = 0;
    this.vector = 0;
    this.inventory = {
      c: 0,
      m: 0,
      y: 0,
      k: 0
    };
    this.inventorySize = 2000;
    this.surplusEnergy = 0;
  }
  get reactors() {
    return this.internalModules.filter(e => e && e.type === ModuleType.reactor);
  }
  get engines() {
    return this.internalModules.filter(e => e && e.type === ModuleType.engine);
  }
  setModule(module: Module, slot: number) {
    if (slot > this.moduleSlots) return;
    this.modules[slot] = module;
  }
  setInternalModule(module: Module, slot: number) {
    if (slot > this.internalModuleSlots) return;
    this.internalModules[slot] = module;
  }
  setReactorPower(power: number) {
    this.reactors.forEach(reactor => reactor.setPower(power));
  }
  setEnginePower(power: number) {
    this.engines.forEach(engine => engine.setPower(power));
  }
  lootOre(type: OreType, amount: number) {
    if (this.availableInventorySpace < amount) return false;
    switch (type) {
      case OreType.cyan:
        this.inventory.c += amount;
        break;
      case OreType.magenta:
        this.inventory.m += amount;
        break;
      case OreType.yellow:
        this.inventory.y += amount;
        break;
      case OreType.black:
        this.inventory.k += amount;
        break;
      default:
        break;
    }
    return true;
  }
  generateEnergy() {
    let energy = 0;
    this.reactors.forEach(reactor => {
      energy += reactor.use();
    });
    return energy;
  }
  chargeEquipment(amount: number) {
    let energyLeft = amount;
    this.poweredEquipment.forEach(eq => {
      energyLeft -= eq.setEnergy(energyLeft / this.poweredEquipment.length);
    });
    this.surplusEnergy = energyLeft;
  }
  update(dt: number) {
    // energy distribution
    if (this.poweredEquipment.length > 0) {
      const energy = this.generateEnergy();
      // energy distribution
      this.chargeEquipment(energy);
    }
    // vector / movement
    this.engines.forEach(engine => {
      this.vector += engine.use() * dt;
      console.log(engine.use() * dt);
    });
    this.position += this.vector;
  }
  get availableInventorySpace() {
    return (
      this.inventorySize -
      this.inventory.c -
      this.inventory.m -
      this.inventory.y -
      this.inventory.k
    );
  }
  get poweredEquipment() {
    // get non-reactor equipment that wants energy, sort by energy amount
    return [...this.modules, ...this.internalModules]
      .filter(e => e && e.type !== ModuleType.reactor && e.desiredEnergy > 0)
      .sort((n1, n2) => {
        if (n1 && n2 && n1.state.powerModifier > n2.state.powerModifier) {
          return 1;
        }
        if (n1 && n2 && n1.state.powerModifier < n2.state.powerModifier) {
          return -1;
        }
        return 0;
      });
  }
}
