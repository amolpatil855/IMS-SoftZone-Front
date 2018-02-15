import { Role } from "./role";

export class User {
  id: number;
  roleId: number;
  userTypeId: number;
  locationId: number;
  userName: string;
  email: string;
  phone: string;
  password: string;
  createdBy: number;
  lastLogin: Date;
  isActive: boolean;
  MstRole: Role;
  oldPassword: string;
}
