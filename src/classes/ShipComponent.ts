import Item from "@/classes/Item";
import { stringify } from 'uuid';

export default class ShipComponent extends Item {
  active: boolean;
  power: number;
  baseEnergyUse: number;
  baseHeating: number;
  protected _effect: number;
  inactiveModifier: number;
  modelInfo = {
    type: "none",
    model: "none",
  }

  constructor(name: string, description: string, energyUse = 1, heating = 1) {
    super(name, description);
    this.baseEnergyUse = energyUse;
    this.baseHeating = heating;
    this.power = 0;
    this.active = false;
    this._effect = 1;
    this.inactiveModifier = 0.1;
  }

  update() {
    if (this.active) {
      return {
        effect: this.effect,
        heating: this.heating,
        energyUse: this.energyUse
      };
    } else {
      return {
        effect: 0,
        heating: this.heating,
        energyUse: this.energyUse
      };
    }
  }
  activate(state: boolean) {
    this.active = state;
  }

  upkeep() {
    // if (!this.enabled) return;

    return {
      heating: this.heating,
      energyUse: this.energyUse
    };
  }

  setPower(power: number) {
    this.power = power;
  }

  // enable(state: boolean) {
  //   console.log("enable component", state);
  //   this.enabled = state;
  // }

  use() {
    // if (!this.enabled) {
    //   console.log("Attempted to use disabled component", this.name);
    //   return;
    // }

    this.active = true;
    const effect = this.effect;

    return effect;
  }
  // if component is not in use, only use 10% power and heat
  get activityModifier() {
    return this.active ? 1 : this.inactiveModifier;
  }
  get effect() {
    // if (!this.enabled) return 0;
    return this._effect * this.power * this.activityModifier;
  }
  get energyUse() {
    // if (!this.enabled) return 0;
    return this.baseEnergyUse * this.power * this.activityModifier;
  }
  get heating() {
    // if (!this.enabled) return 0;
    return this.baseHeating * this.power * this.activityModifier;
  }
}
