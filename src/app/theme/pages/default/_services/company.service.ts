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

  createCompanyInfo(company: Company,image:any) {
    let reqObj = AppSettings.requestOptions();
    reqObj.headers["_headers"].delete("content-type");
    //reqObj.body=company;
    return this.http.post(AppSettings.API_ENDPOINT + 'CompanyInfo', image, reqObj).map((response: Response) => response.json());
  }

  updateCompanyInfo(company: any) {
    let reqObj = AppSettings.requestOptions();
    reqObj.headers["_headers"].delete("content-type");
//reqObj.headers["_headers"].delete("Accept");
   // reqObj.body.append('mstCompanyInfo', company);
    return this.http.put(AppSettings.API_ENDPOINT + 'CompanyInfo', company, reqObj).map((response: Response) => response.json());
  }

}
