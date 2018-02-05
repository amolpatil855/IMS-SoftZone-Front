import { Category } from "./category";
import { Collection } from "./collection";
import { FomDensity } from "./fomDensity";
import { Quality } from "./quality";

export class FomSuggestedMM {
  id: number;
  categoryId: number;
  collectionId: number;
  qualityId: number;
  fomDensityId: number;
  suggestedMM: number;
  MstCategory: Category;
  MstCollection: Collection;
  MstFomDensity: FomDensity;
  MstQuality: Quality;
}
