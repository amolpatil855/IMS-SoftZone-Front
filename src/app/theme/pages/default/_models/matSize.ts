import { Category } from "./category";
import { Collection } from "./collection";
import { MatThickness } from "./matThickness";
import { Quality } from "./quality";

export class MatSize {
  id: number;
  categoryId: number;
  collectionId: number;
  qualityId: number;
  thicknessId: number;
  sizeCode: string;
  rate: number;
  purchaseDiscount: number;
  purchaseRate: number;
  stockReorderLevel: number;
  MstCategory: Category;
  MstCollection: Collection;
  MstMatThickness: MatThickness;
  MstQuality: Quality;
}
