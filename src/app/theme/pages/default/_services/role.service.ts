import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response } from "@angular/http";

import { Role } from "../_models/role";
import { AppSettings } from '../../../../app-settings';

@Injectable()
export class RoleService {
  constructor(private http: Http) {
  }

  perPage: any = 25;
  currentPos: any = 0;
  currentPageNumber: any = 1;

  getAllRoles(pageSize=0,page=0,search='') {
    return this.http.get(AppSettings.API_ENDPOINT + 'Role?pageSize='+pageSize+'&page='+page+'&search='+search, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getRoleById(id: number) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Role/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getRoleMenuById(id: number) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Role/getRoleMenu/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
  createRole(role: Role) {
    return this.http.post(AppSettings.API_ENDPOINT + 'Role', role, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  updateRole(role: Role) {
    return this.http.put(AppSettings.API_ENDPOINT + 'Role', role, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  deleteRole(id: number) {
    return this.http.delete(AppSettings.API_ENDPOINT + 'Role/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
  getRolesCount(url) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Role/count' + url, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
  getAllRolesList(url) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Role' + url, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
}
