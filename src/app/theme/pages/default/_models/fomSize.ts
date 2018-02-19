import { Category } from "./category";
import { Collection } from "./collection";
import { FomDensity } from "./fomDensity";
import { Quality } from "./quality";
import { FomSuggestedMM } from "./fomSuggestedMM";

export class FomSize {
  id: number;
  categoryId: number;
  collectionId: number;
  qualityId: number;
  fomDensityId: number;
  fomSuggestedMMId: number;
  width: number;
  length: number;
  sizeCode: string;
  itemCode: string;
  stockReorderLevel: number;
  MstCategory: Category;
  MstCollection: Collection;
  MstFomDensity: FomDensity;
  MstQuality: Quality;
  MstFomSuggestedMM: FomSuggestedMM;
}
