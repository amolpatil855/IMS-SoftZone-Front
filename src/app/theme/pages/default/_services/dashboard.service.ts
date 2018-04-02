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

  getAllFinancialYears(pageSize = 0, page = 0, search = '') {
    return this.http.get(AppSettings.API_ENDPOINT + 'FinancialYear?pageSize=' + pageSize + '&page=' + page + '&search=' + search, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getRecordsForSOCount(pageSize = 0, page = 0, search = '') {
    return this.http.get(AppSettings.API_ENDPOINT + 'Dashboard/GetRecordsForSOCount?pageSize=' + pageSize + '&page=' + page + '&search=' + search, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getRecordsForPOCount(pageSize = 0, page = 0, search = '') {
    return this.http.get(AppSettings.API_ENDPOINT + 'Dashboard/GetRecordsForPOCount?pageSize=' + pageSize + '&page=' + page + '&search=' + search, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

}
