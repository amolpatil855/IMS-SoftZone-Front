import { Headers, Http, RequestOptions, Response } from "@angular/http";

export class AppSettings {

  public static API_ENDPOINT = 'http://192.168.101.21:8053/IMSBack/api/';
  public static LOGIN_API_ENDPOINT = 'http://192.168.101.21:8053/IMSBack/';
  public static IMAGE_API_ENDPOINT = 'http://192.168.101.21:8053/IMSBack/';

  public static requestOptions() {
    let headers = new Headers({ 'Content-Type': 'application/json' });

    // create authorization header with jwt token
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.access_token) {
      headers.append('Authorization', 'Bearer ' + currentUser.access_token);
    }
    let options = new RequestOptions({ headers: headers });
    return new RequestOptions({ headers: headers });
  }
}
