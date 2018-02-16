import { Category } from "./category";
import { Hsn } from "./hsn";
import { UnitOfMeasure } from "./unitOfMeasure";

export class Accessory {
    id: number;
    categoryId: number;
    name: string;
    itemCode: string;
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