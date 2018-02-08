import { Supplier } from "./supplier";
import { Category } from "./category";

export class Collection {
  id: number;
  categoryId: number;
  supplierId: number;
  collectionCode: string;
  collectionName: string;
  purchaseDiscount: number;
  description: string;
  manufacturerName: string;
  categoryCode: string;
  MstSupplier: Supplier;
  MstCategory: Category;
}
