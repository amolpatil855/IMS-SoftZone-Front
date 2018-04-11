import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response, URLSearchParams } from "@angular/http";

import { TrnCurtainQuotation } from "../_models/trnCurtainQuotation";
import { AppSettings } from '../../../../app-settings';

@Injectable()
export class TrnCurtainQuotationService {
  constructor(private http: Http) {
  }

  perPage: any = 25;
  currentPos: any = 0;
  currentPageNumber: any = 1;

  getAllTrnCurtainQuotations(pageSize = 0, page = 0, search = '') {
    return this.http.get(AppSettings.API_ENDPOINT + 'TrnCurtainQuotation?pageSize=' + pageSize + '&page=' + page + '&search=' + search, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getTrnCurtainQuotationById(id: number) {
    return this.http.get(AppSettings.API_ENDPOINT + 'TrnCurtainQuotation/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  approveCurtainQuotation(trnCurtainQuotation: TrnCurtainQuotation) {
    return this.http.put(AppSettings.API_ENDPOINT + 'TrnCurtainQuotation/ApproveCurtainQuotation/' + trnCurtainQuotation.id, trnCurtainQuotation, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  cancelCurtainQuotation(trnCurtainQuotation: TrnCurtainQuotation) {
    return this.http.put(AppSettings.API_ENDPOINT + 'TrnCurtainQuotation/CancelCurtainQuotation/' + trnCurtainQuotation.id, trnCurtainQuotation, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  createTrnCurtainQuotation(trnCurtainQuotation: TrnCurtainQuotation) {
    return this.http.post(AppSettings.API_ENDPOINT + 'TrnCurtainQuotation', trnCurtainQuotation, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  updateTrnCurtainQuotation(trnCurtainQuotation: TrnCurtainQuotation) {
    return this.http.put(AppSettings.API_ENDPOINT + 'TrnCurtainQuotation/' + trnCurtainQuotation.id, trnCurtainQuotation, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
}
