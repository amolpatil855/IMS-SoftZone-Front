import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response } from "@angular/http";

import { Company } from "../_models/company";
import { AppSettings } from '../../../../app-settings';

@Injectable()
export class CompanyService {
  constructor(private http: Http) {
  }

  perPage: any = 25;
  currentPos: any = 0;
  currentPageNumber: any = 1;

  getAllCompanyInfo() {
    return this.http.get(AppSettings.API_ENDPOINT + 'CompanyInfo', AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  createCompanyInfo(company: Company) {
    return this.http.post(AppSettings.API_ENDPOINT + 'CompanyInfo', company, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  updateCompanyInfo(company: Company) {
    return this.http.put(AppSettings.API_ENDPOINT + 'CompanyInfo', company, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

}
