import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response, URLSearchParams } from "@angular/http";
import { AppSettings } from '../../../../app-settings';

@Injectable()
export class DashboardService {
  constructor(private http: Http) {
  }

  getDashboard() {
    return this.http.get(AppSettings.API_ENDPOINT + 'Dashboard', AppSettings.requestOptions()).map((response: Response) => response.json());
  }

}
