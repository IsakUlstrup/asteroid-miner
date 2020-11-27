import { ItemType, ModuleType, TargetMode } from "../types/enums";
import { Item, ModuleStats } from "../types/types";
import Asteroid from "./Asteroid";
import Color from "./Color";
import Ore from "./Ore";

export default class Module implements Item {
  // metadata
  name: string;
  id: string;
  itemType: ItemType.module;
  type: ModuleType;
  targetMode: TargetMode;
  target: Asteroid | Ore | undefined;

  // stats
  effect: number;
  energyUse: number;
  fuelUse: number;
  fuelBufferSize: number;

  // state
  state: {
    powerModifier: number;
    energy: number;
    fuel: number;
  };

  color: Color;

  // derived stats
  get derivedStats() {
    return {
      effect:
        this.state.energy >= this.energyUse * this.state.powerModifier
          ? this.effect * this.state.powerModifier
          : this.effect *
            ((this.state.energy / this.energyUse) * this.state.powerModifier),
      energyUse: this.energyUse * this.state.powerModifier,
      fuelUse: this.fuelUse * this.state.powerModifier
    };
  }

  constructor(stats: ModuleStats) {
    // set metadata
    this.name = stats.name !== undefined ? stats.name : "unnamed equipment";
    this.id = stats.id !== undefined ? stats.id : "89345-43534-234";
    this.itemType = ItemType.module;

    // set base stats
    this.type = stats.moduleType;
    this.effect = stats.effect !== undefined ? stats.effect : 1;
    this.energyUse = stats.energyUse !== undefined ? stats.energyUse : 1;
    this.fuelUse = stats.fuelUse !== undefined ? stats.fuelUse : 0;
    this.fuelBufferSize =
      stats.fuelBufferSize !== undefined ? stats.fuelBufferSize : 0;

    // Initialize state
    this.state = {
      powerModifier: 0,
      energy: 0,
      fuel: this.fuelBufferSize
    };

    // init color
    this.color = new Color({
      r: 0,
      g: 0,
      b: 0
    });
    this.targetMode = TargetMode.manual;
  }
  setEnergy(amount: number) {
    this.state.energy = amount;
    if (this.state.energy > this.derivedStats.energyUse) {
      this.state.energy = this.derivedStats.energyUse;
    }
    return this.state.energy;
  }
  setTargetingMode(mode: TargetMode) {
    this.targetMode = mode;
  }
  setTarget(target: Asteroid | Ore | undefined) {
    this.target = target;
  }
  useFuel(amount: number) {
    if (amount <= 0) return;
    this.state.fuel -= amount;
    if (this.state.fuel < 0) this.state.fuel = 0;
  }
  setPower(power: number) {
    this.state.powerModifier = power;
  }
  setColor(color: RGBColor | CMYKColor) {
    this.color.setColor(color);
  }
  use() {
    if (this.state.fuel < this.derivedStats.fuelUse) return 0;
    this.useFuel(this.derivedStats.fuelUse);
    return this.derivedStats.effect;
  }
  get desiredEnergy() {
    return this.derivedStats.energyUse;
  }
}
