import { CompanyLocation } from "./companyLocation";
import { Supplier } from "./supplier";
import { TrnGoodReceiveNoteItem } from "./trnGoodReceiveNoteItem";

export class TrnGoodReceiveNote {
  id: number;
  grnNumber: string;
  grnDate: Date;
  supplierId: number;
  locationId: number;
  totalAmount: number;
  supplierName: string;
  TrnGoodReceiveNoteItems = [];
  courierDetails: string;
  dockAtNumber: string;
}
