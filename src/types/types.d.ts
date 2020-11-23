import { ItemType, EquipmentType } from "./enums";

export interface Item {
  name: string;
  id: string;
  itemType: ItemType;
}

export interface EquipmentStats {
  equipmentType: EquipmentType;
  name?: string;
  id?: string;
  effect?: number;
  energyUse?: number;
  fuelUse?: number;
  fuelBufferSize?: number;
}
