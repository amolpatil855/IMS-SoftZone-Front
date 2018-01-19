import { User } from "./user";

export class Customer {
    id: number;
    code: string;
    name: string;
    nickName: string;
    gstin: string;
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
    createdBy: number;
    updatedBy: number;
    MstUser: User;
}