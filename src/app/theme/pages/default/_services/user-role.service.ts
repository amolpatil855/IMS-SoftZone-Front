import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response, URLSearchParams } from "@angular/http";

import { User, Role } from "../_models/index";
import { AppSettings } from '../../../../app-settings';

@Injectable()
export class UserRoleService {
  constructor(private http: Http) {
  }

  getAllUsers() {
    return this.http.get(AppSettings.API_ENDPOINT + 'users', AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  addUserRole(mapping: any) {
    return this.http.post(AppSettings.API_ENDPOINT + 'RoleMappings', mapping, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
  revokeUserRole(role: any) {
  }
  getUserRole(id: any) {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let params: URLSearchParams = new URLSearchParams();
    params.set('filter[include]', "roles");
    let requestOptions = AppSettings.requestOptions();
    requestOptions.params = params;
    return this.http.get(AppSettings.API_ENDPOINT + 'users/' + id, requestOptions).map((response: Response) => response.json());
  }
}
