import { Category } from "./category";
import { Collection } from "./collection";
import { Hsn } from "./hsn";

export class Quality {
    id: number;
    categoryId: number;
    collectionId: number;
    qualityCode: string;
    qualityName: string;
    description: string;
    width: number;
    size: number;
    hsnId: number;
    cutRate: number;
    roleRate: number;
    rrp: number;
    maxCutRateDisc: number;
    maxRoleRateDisc: number;
    flatRate: number;
    maxflatCutRateDisc: number;
    maxflatRoleRateDisc: number;
    custRatePerSqFeet: number;
    purchaseRatePerMM: number;
    sellingRatePerMM: number;
    maxDiscout: number;
    MstCategory: Category;
    MstCollection: Collection;
    MstHsn: Hsn;
}