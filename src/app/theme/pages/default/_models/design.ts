import { Category } from "./category";
import { Collection } from "./collection";
import { Quality } from "./quality";

export class Design {
    id: number;
    categoryId: number;
    collectionId: number;
    qualityId: number;
    designCode: string;
    designName: string;
    description: string;
    MstCategory: Category;
    MstCollection: Collection;
    MstQuality: Quality;
}