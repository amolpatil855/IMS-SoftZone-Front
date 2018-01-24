<<<<<<< HEAD
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
=======
export class Quality{
    id: number;
    collectionId:string;
    qualityCode: string;
    categoryId: number;
    qualityName: string;
    description: string;
    hsnId:number;
    width:number;
    size:number;
    cutRate:number;
    roleRate:number;
    rrp:number;
    maxCutRateDisc:number;
    maxRoleRateDisc:number;
    flatRate:number;
    maxflatCutRateDisc:number;
    maxflatRoleRateDisc:number;
    custRatePerSqFeet:number;
    purchaseRatePerMM:number;
    sellingRatePerMM:number;
    maxDiscout:number;
>>>>>>> 528e79119bdf712b76b76b3ac9f39568818f3fc7
}