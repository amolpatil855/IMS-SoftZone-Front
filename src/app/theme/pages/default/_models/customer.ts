import { User } from "./user";
import { CustomerAddress } from "./customerAddress";

export class Customer {
    id: number;
    code: string;
    name: string;
    nickName: string;
    email: string;
    phone: string;
    alternateEmail1: string;
    alternateEmail2: string;
    alternatePhone1: string;
    alternatePhone2: string;
    pan: string;
    isWholesaleCustomer: boolean;
    accountPersonName: string;
    accountPersonEmail: string;
    accountPersonPhone: string;
    userId: number;
    userName: string;
    MstUser: User;
    MstCustomerAddresses: CustomerAddress;
}