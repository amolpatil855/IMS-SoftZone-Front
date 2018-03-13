import { Agent } from "./agent";
import { Customer } from "./customer";
import { TrnMaterialQuotation } from "./trnMaterialQuotation";

export class TrnMaterialSelection {
    id: number;
    customerId: number;
    materialSelectionNumber: string;
    referById: number;
    materialSelectionDate: Date;
    isQuotationCreated: boolean;
    customerName: string;
    MstAgent: Agent;
    MstCustomer: Customer;
    TrnMaterialQuotations: TrnMaterialQuotation;
    TrnMaterialSelectionItems = [];
}