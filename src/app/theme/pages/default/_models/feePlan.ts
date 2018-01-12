export class FeePlan {
  id: number;
  schoolId: number;
  feePlanName: string;
  academicYear: string;
  feePlanDescription: string;
}

export class FeePlanDetails {
  id: number;
  feePlanId: number;
  feeHeadId: number;
  feeCharges: number;
  sequenceNumber: number;
  dueDate: Date;
  academicYear: string;
  isTransactionProcessed: number;
  schoolId: number;
}
