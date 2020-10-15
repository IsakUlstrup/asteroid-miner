import Item from "@/classes/Item";

export default class ShipComponent extends Item {
  enabled:boolean;
  active:boolean;
  power:number;
  baseEnergyUse:number;
  baseHeating:number;
  protected _effect:number;
  inactiveModifier:number;

  constructor(name:string, description:string, energyUse=1, heating=1) {
    super(name, description);
    this.baseEnergyUse = energyUse;
    this.baseHeating = heating;
    this.power = 1;
    this.active = false;
    this.enabled = false;
    this._effect = 1;
    this.inactiveModifier = 0.1;
  }

  update() {
    if (this.active) {
      return {
        effect: this.effect,
        heating: this.heating,
        energyUse: this.energyUse
      }
    } else {
      return {
        effect: 0,
        heating: this.heating,
        energyUse: this.energyUse
      }
    }
  }

  upkeep() {
    if (! this.enabled) return;

    return {
      heating: this.heating,
      energyUse: this.energyUse
    }
  }

  use() {
    if (! this.enabled) {
      console.log("Attempted to use disabled component", this.name);
      return;
    };

    this.active = true;
    const effect = this.effect;

    return effect;
  }
  
  // public get power() {
  //   return this._power;
  // }
  // public set power(p: number) {
  //   if (p < 0 || p > 1) {
  //     console.log("invalid power value! Value must be between 0 and 1");
  //     return;
  //   }
  //   this.power = p;
  // }


  // if component is not in use, only use 10% power and heat
  get activityModifier() {
    return (this.active? 1: this.inactiveModifier);
  }
  get effect() {
    if (! this.enabled) return 0;
    return this._effect * this.power * this.activityModifier;
  }
  get energyUse() {
    if (! this.enabled) return 0;
    return this.baseEnergyUse * this.power * this.activityModifier;
  }
  get heating() {
    if (! this.enabled) return 0;
    return this.baseHeating * this.power * this.activityModifier;
  }
}