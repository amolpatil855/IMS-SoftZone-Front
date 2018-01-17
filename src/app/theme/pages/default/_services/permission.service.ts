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

  getAllMenu() {
    return this.http.get(AppSettings.API_ENDPOINT + 'Menu', AppSettings.requestOptions()).map((response: Response) => response.json());
  }

}
