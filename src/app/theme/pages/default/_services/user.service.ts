import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response, URLSearchParams } from "@angular/http";

import { User } from "../_models/index";
import { AppSettings } from '../../../../app-settings';

@Injectable()
export class UserService {
  constructor(private http: Http) {
  }

  perPage: any = 25;
  currentPos: any = 0;
  currentPageNumber: any = 1;

  getAllUsers() {
    return this.http.get(AppSettings.API_ENDPOINT + 'users', AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getUserById(id: number) {
    let params: URLSearchParams = new URLSearchParams();
    params.set('filter[include]', "school");
    let requestOptions = AppSettings.requestOptions();
    requestOptions.params = params;
    return this.http.get(AppSettings.API_ENDPOINT + 'users/' + id, requestOptions).map((response: Response) => response.json());
  }

  createUser(user: User) {
    return this.http.post(AppSettings.API_ENDPOINT + 'users/createUser', user, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  updateUser(user: User) {
    return this.http.put(AppSettings.API_ENDPOINT + 'users/updateUser/' + user.id, user, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  updateUserStatus(user: User) {
    return this.http.patch(AppSettings.API_ENDPOINT + 'users/' + user.id, user, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  deleteUser(id: number) {
    return this.http.delete(AppSettings.API_ENDPOINT + 'users/deleteRecord/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
  changePassword(data: any) {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return this.http.post(AppSettings.API_ENDPOINT + 'users/change-password?access_token=' + currentUser.token, data, AppSettings.requestOptions())
      .map((response: Response) =>
        response.text());
  }
  getAllUsersCount(url) {
    return this.http.get(AppSettings.API_ENDPOINT + 'users/count' + url, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
  getAllUsersList(url) {
    return this.http.get(AppSettings.API_ENDPOINT + 'users' + url, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getUsersForSuperuser(url) {
    return this.http.get(AppSettings.API_ENDPOINT + 'users' + url, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getUsersCountForSuperuser(url) {
    return this.http.get(AppSettings.API_ENDPOINT + 'users/count' + url, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  forgotPassword(email: any) {
    return this.http.post(AppSettings.LOGIN_API_ENDPOINT + 'request-password-reset', email, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
}
