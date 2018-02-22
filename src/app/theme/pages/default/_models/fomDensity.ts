import { Category } from "./category";
import { Collection } from "./collection";
import { Quality } from "./quality";

export class FomDensity {
  id: number;
  categoryId: number;
  collectionId: number;
  qualityId: number;
  density: string;
  description: string;
  purchaseRatePerMM: number;
  purchaseRatePerKG: number;
  sellingRatePerMM: number;
  sellingRatePerKG: number;
  MstCategory: Category;
  MstCollection: Collection;
  MstQuality: Quality;
}
