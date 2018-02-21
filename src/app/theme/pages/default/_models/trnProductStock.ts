import { Category } from "./category";
import { Collection } from "./collection";
import { FomSize } from "./fomSize";
import { Shade } from "./shade";
import { MatSize } from "./matSize";

export class TrnProductStock {
  id: number;
  categoryId: number;
  collectionid: number;
  fwrShadeId: number;
  matSizeId: number;
  fomSizeId: number;
  accessoryId: number;
  locationId: number;
  stock: number;
  stockInKg: number;
  kgPerUnit: number;
  MstCategory: Category;
  MstCollection: Collection;
  MstFomSize: FomSize;
  MstFWRShade: Shade;
  MstMatSize: MatSize;
}
