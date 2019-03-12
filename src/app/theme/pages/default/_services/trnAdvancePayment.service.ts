import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response, URLSearchParams } from "@angular/http";

import { TrnAdvancePayment } from "../_models/trnAdvancePayment";
import { AppSettings } from '../../../../app-settings';

@Injectable()
export class TrnAdvancePaymentService {
  constructor(private http: Http) {
  }

  perPage: any = 25;
  currentPos: any = 0;
  currentPageNumber: any = 1;

  getAllTrnAdvancePayments(pageSize = 0, page = 0, search = '', quotationType) {
    return this.http.get(AppSettings.API_ENDPOINT + 'TrnAdvancePayment?pageSize=' + pageSize + '&page=' + page + '&search=' + search + '&quotationType=' + quotationType, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getTrnAdvancePaymentById(id: number) {
    return this.http.get(AppSettings.API_ENDPOINT + 'TrnAdvancePayment/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getMaterialQuotationLookup() {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetMaterialQuotationLookup', AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getCurtainQuotationLookup() {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetCurtainQuotationLookup', AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getCustomerLookupByMaterialQuotationId(materialQuotationId) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetCustomerLookupByMaterialQuotationId?materialQuotationId=' + materialQuotationId, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  createTrnAdvancePayment(trnAdvancePayment: TrnAdvancePayment) {
    return this.http.post(AppSettings.API_ENDPOINT + 'TrnAdvancePayment', trnAdvancePayment, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

}
