import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response, URLSearchParams } from "@angular/http";

import { Hsn } from "../_models/hsn";
import { AppSettings } from '../../../../app-settings';

@Injectable()
export class HsnService {
  constructor(private http: Http) {
  }

  perPage: any = 25;
  currentPos: any = 0;
  currentPageNumber: any = 1;

  getAllHsns(pageSize=0,page=0,search='') {
    return this.http.get(AppSettings.API_ENDPOINT + 'Hsn?pageSize='+pageSize+'&page='+page+'&search='+search, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getHsnById(id: number) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Hsn/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getHsnLookUp() {
    return this.http.get(AppSettings.API_ENDPOINT + 'Hsn/GetHsnLookUp', AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  createHsn(supplier: Hsn) {
    return this.http.post(AppSettings.API_ENDPOINT + 'Hsn', supplier, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  updateHsn(supplier: Hsn) {
    return this.http.put(AppSettings.API_ENDPOINT + 'Hsn/' + supplier.id, supplier, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  deleteHsn(id: number) {
    return this.http.delete(AppSettings.API_ENDPOINT + 'Hsn/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
}
