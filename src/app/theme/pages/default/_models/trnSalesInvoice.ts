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
    isApproved: boolean;
    isPaid: boolean;
    buyersOrderNumber: string = null;
    courierDockYardNumber: string = null;
    TrnGoodIssueNote: TrnGoodIssueNote;
    TrnSaleOrder: TrnSaleOrder;
    trnSalesInvoiceItems = [];
}