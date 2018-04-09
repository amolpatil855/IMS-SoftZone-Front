import { Accessory } from "./accessory";

export class UnitOfMeasure {
  id: number;
  uomCode: string;
  uomName: string;
  MstAccessories: Array<Accessory>;
}
