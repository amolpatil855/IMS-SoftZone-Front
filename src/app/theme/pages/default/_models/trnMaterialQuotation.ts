import { Agent } from "./agent";
import { TrnMaterialSelection } from "./trnMaterialSelection";

export class TrnMaterialQuotation {
  id: number;
  materialSelectionId: number;
  materialQuotationNumber: string;
  materialQuotationDate: Date;
  customerId: number;
  referById: number;
  status: string;
  totalAmount: number;
  MstAgent: Agent;
  TrnMaterialSelection: TrnMaterialSelection;
  TrnMaterialQuotationItems = [];
}
