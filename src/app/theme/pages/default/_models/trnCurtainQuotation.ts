import { Agent } from "./agent";
import { Customer } from "./customer";
import { TrnCurtainSelection } from "./trnCurtainSelection";

export class TrnCurtainQuotation {
    id: number;
    globalDiscount:number;
    curtainSelectionId: number;
    curtainQuotationNumber: string;
    curtainQuotationDate: Date;
    customerId: number;
    referById: number;
    totalAmount: number;
    financialYear: string;
    status: string;
    customerName: string;
    agentName: string;
    curtainSelectionNo: string;
    advanceAmount: number;
    MstAgent: Agent;
    MstCustomer: Customer;
    TrnCurtainSelection: TrnCurtainSelection;
    TrnCurtainQuotationItems = [];
    areaList=[];
    rodAccessoryId:number
}