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
    MstCategory: Category;
    MstCollection: Collection; 
    MstQuality: Quality;
}