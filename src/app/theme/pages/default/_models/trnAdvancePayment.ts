export class TrnAdvancePayment {
  id: number;
  advancePaymentNumber: string;
  advancePaymentDate: Date;
  customerId: number;
  materialQuotationId: number;
  amount: number;
  paymentMode: string;
  chequeNumber: string;
  chequeDate: Date;
  bankName: string;
  bankBranch: string;
}
