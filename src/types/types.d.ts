import { ItemType, ModuleType } from "./enums";

export interface Item {
  name: string;
  id: string;
  itemType: ItemType;
}

export interface ModuleStats {
  moduleType: ModuleType;
  name?: string;
  id?: string;
  effect?: number;
  energyUse?: number;
  fuelUse?: number;
  fuelBufferSize?: number;
}
