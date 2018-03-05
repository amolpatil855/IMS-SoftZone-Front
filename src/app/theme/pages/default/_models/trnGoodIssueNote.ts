import { Customer } from "./customer";

export class TrnGoodIssueNote{
    id: number;
    ginDate:Date;
    totalAmount:number;
    customerId:number;
    ginNumber:number;
    status:string;
    trnGoodIssueNoteItems=[];
    mstCustomer:Customer;
}