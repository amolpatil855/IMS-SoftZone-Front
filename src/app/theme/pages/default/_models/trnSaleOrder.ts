import { Agent } from "./agent";
import { Courier } from "./courier";
import { Customer } from "./customer";

export class TrnSaleOrder {
  id: number;
  orderNumber: string;
  customerId: number;
  shippingAddress: string;
  courierId: number;
  courierMode: string;
  referById: number;
  orderDate: Date;
  expectedDeliveryDate: Date;
  totalAmount: number;
  paymentMode: string;
  chequeNumber: string;
  chequeDate: Date;
  bankName: string;
  bankBranch: string;
  remark: string;
  status: string;
  financialYear: string;
  MstAgent: Agent;
  MstCourier: Courier;
  MstCustomer: Customer;
}
