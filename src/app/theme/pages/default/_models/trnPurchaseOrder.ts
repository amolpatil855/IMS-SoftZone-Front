import { CompanyLocation } from "./companyLocation";
import { Courier } from "./courier";
import { Supplier } from "./supplier";

export class TrnPurchaseOrder {
    id: number;
    courierId: number;
    courierMode: string;
    saleOrderId: number;
    saleOrderNumber: number;
    supplierId: number;
    orderNumber: number;
    orderDate: Date;
    locationId: number;
    remark: string;
    status: string;
    financialYear: string;
    MstCompanyLocation: CompanyLocation;
    MstCourier: Courier;
    MstSupplier: Supplier;
    courierName:string;
    supplierName:string;
    shippingAddress:string;
    TrnPurchaseOrderItems=[]
}