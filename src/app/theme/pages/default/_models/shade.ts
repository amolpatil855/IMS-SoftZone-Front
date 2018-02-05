import { Category } from "./category";
import { Collection } from "./collection";
import { Design } from "./design";
import { Quality } from "./quality";

export class Shade {
  id: number;
  categoryId: number;
  collectionId: number;
  qualityId: number;
  designId: number;
  shadeCode: string;
  shadeName: string;
  serialNumber: number;
  description: string;
  stockReorderLevel: number;
  MstCategory: Category;
  MstCollection: Collection;
  MstDesign: Design;
  MstQuality: Quality;
}
