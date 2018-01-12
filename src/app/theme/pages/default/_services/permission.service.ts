import { Injectable, EventEmitter } from "@angular/core";
import { Headers, Http, RequestOptions, Response, URLSearchParams } from "@angular/http";
import { Observable } from 'rxjs/Rx';
import { User, Role } from "../_models/index";
import { AppSettings } from '../../../../app-settings';

@Injectable()
export class PermissionService {
  list1Event: EventEmitter<any> = new EventEmitter();
  permissionsList: Observable<any[]>;
  isRequestSent: boolean;
  constructor(private http: Http) {
  }

  getAllPermissions() {
    return this.http.get(AppSettings.API_ENDPOINT + 'permissions', AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  managePermission(id) {
    return this.getLoggedInUserPermissionsByRole(id);
  }

  getperMissionList() {
    return this.permissionsList;
  }
  getLoggedInUserPermissionsByRole(id: any) {
    return this.http.get(AppSettings.API_ENDPOINT + 'roles/' + id + '/permission', AppSettings.requestOptions()).map((response: Response) => response.json());
  }
  addPermissionToRole(permissions: any) {
    return this.http.post(AppSettings.API_ENDPOINT + 'RolepermissionDetails', permissions, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
  revokePermission(id: any) {
    return this.http.delete(AppSettings.API_ENDPOINT + 'RolepermissionDetails/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
  getPermissionsByRole(id: any) {
    return this.http.get(AppSettings.API_ENDPOINT + 'roles/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
  getMenus() {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return this.http.get(AppSettings.API_ENDPOINT + 'roles/' + currentUser.roles[0].id + '/roleMenu', AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getPermissionsByMenuId(menuId: number) {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return this.http.get(AppSettings.API_ENDPOINT + 'Permissions?&filter[where][roleId]=' + currentUser.roles[0].id + '&filter[where][menuId]=' + menuId, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
}
