import { Category } from "./category";
import { Hsn } from "./hsn";
import { UnitOfMeasure } from "./unitOfMeasure";

export class Accessory {
    id: number;
    categoryId: number;
    name: string;
    itemCode: string;
    supplierId: number;
    hsnId: number;
    uomId: number;
    sellingRate: number;
    purchaseRate: number;
    size: string;
    description: string;
    MstCategory: Category;
    MstHsn: Hsn;
    MstUnitOfMeasure: UnitOfMeasure;

}