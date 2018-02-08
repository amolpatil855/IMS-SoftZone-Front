import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response, URLSearchParams } from "@angular/http";

import { FinancialYear } from "../_models/financialYear";
import { AppSettings } from '../../../../app-settings';

@Injectable()
export class FinancialYearService {
  constructor(private http: Http) {
  }

  perPage: any = 25;
  currentPos: any = 0;
  currentPageNumber: any = 1;

  getAllFinancialYears(pageSize = 0, page = 0, search = '') {
    return this.http.get(AppSettings.API_ENDPOINT + 'FinancialYear?pageSize=' + pageSize + '&page=' + page + '&search=' + search, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getFinancialYearById(id: number) {
    return this.http.get(AppSettings.API_ENDPOINT + 'FinancialYear/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  createFinancialYear(financialYear: FinancialYear) {
    return this.http.post(AppSettings.API_ENDPOINT + 'FinancialYear', financialYear, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  updateFinancialYear(financialYear: FinancialYear) {
    return this.http.put(AppSettings.API_ENDPOINT + 'FinancialYear/' + financialYear.id, financialYear, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

}
