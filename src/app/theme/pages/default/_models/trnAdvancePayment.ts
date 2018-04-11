export class TrnAdvancePayment {
  id: number;
  advancePaymentNumber: string;
  advancePaymentDate: Date;
  customerId: number;
  materialQuotationId: number;
  curtainQuotationId: number;
  quotationType: string;
  amount: number;
  paymentMode: string;
  chequeNumber: string;
  chequeDate: Date;
  bankName: string;
  bankBranch: string;
}
