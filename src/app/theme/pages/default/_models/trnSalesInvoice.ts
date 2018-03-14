import { TrnGoodIssueNote } from "./trnGoodIssueNote";
import { TrnSaleOrder } from "./trnSaleOrder";

export class TrnSalesInvoice {
    id: number;
    goodIssueNoteId: number;
    expectedDeliveryDate:Date;
    salesOrderId: number;
    invoiceNumber: string;
    invoiceDate: Date;
    totalAmount: number;
    amountPaid: number;
    status: string;
    buyersOrderNumber: string;
    courierDockYardNumber: string;
    TrnGoodIssueNote: TrnGoodIssueNote;
    TrnSaleOrder: TrnSaleOrder;
    trnSalesInvoiceItems = [];
}