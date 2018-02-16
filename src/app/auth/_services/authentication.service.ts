import { Injectable } from "@angular/core";
import { Http, Response, RequestOptions, Headers } from "@angular/http";
import "rxjs/add/operator/map";
import { AppSettings } from '../../app-settings';

@Injectable()
export class AuthenticationService {

  constructor(private http: Http) {
  }
  login(username: string, password: string) {
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers });
    var data = "grant_type=password&username=" + username + "&password=" + password;

    return this.http.post(AppSettings.LOGIN_API_ENDPOINT + 'token', data, options)
      .map((response: Response) => {
        // login successful if there's a jwt token in the response
        let user = response.json();
        // if (user.access_token) {
        //   user['token'] = user.access_token;
        // }
        // if (user && user.token) {
        //   if (!user.permissions) {
        //     user.permissions = [];
        //   }
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('currentUser', JSON.stringify(user));
        //}
      });
  }
  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    localStorage.removeItem('location');
  }
}
