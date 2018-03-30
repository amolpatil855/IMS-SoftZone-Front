import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response, URLSearchParams } from "@angular/http";

import { TrnSalesInvoice } from "../_models/trnSalesInvoice";
import { AppSettings } from '../../../../app-settings';

@Injectable()
export class TrnSalesInvoiceService {
  constructor(private http: Http) {
  }

  perPage: any = 25;
  currentPos: any = 0;
  currentPageNumber: any = 1;

  getAllTrnSalesInvoices(pageSize = 0, page = 0, search = '') {
    return this.http.get(AppSettings.API_ENDPOINT + 'TrnSalesInvoice?pageSize=' + pageSize + '&page=' + page + '&search=' + search, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getSalesInvoicesForLoggedInUser(pageSize = 0, page = 0, search = '') {
    return this.http.get(AppSettings.API_ENDPOINT + 'CustomerLogin/GetSalesInvoicesForLoggedInUser?pageSize=' + pageSize + '&page=' + page + '&search=' + search, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getPOListForSelectedItem(categoryId, collectionId, parameterId, matSizeCode) {
    return this.http.get(AppSettings.API_ENDPOINT + 'TrnSalesInvoice/GetPOListForSelectedItem?categoryId=' + categoryId + '&collectionId=' + collectionId + '&parameterId=' + parameterId + '&matSizeCode=' + matSizeCode, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getTrnSalesInvoiceById(id: number) {
    return this.http.get(AppSettings.API_ENDPOINT + 'TrnSalesInvoice/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getSalesInvoiceByIdForCustomerUser(id: number) {
    return this.http.get(AppSettings.API_ENDPOINT + 'CustomerLogin/GetSalesInvoiceByIdForCustomerUser/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
  
  getshadeIdTrnSalesInvoices(id) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetSerialNumberLookUpForGRN?collectionId=' + id , AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getFoamSizeTrnSalesInvoices(id) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetFomSizeLookUpForGRN?collectionId=' + id , AppSettings.requestOptions()).map((response: Response) => response.json());
  }
  
  getMatsizeTrnSalesInvoices(id) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetMatSizeLookUpForGRN?collectionId=' + id , AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getAccessoryLookUp() {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetAccessoryLookUpForGRN', AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getCompanyLocationLookUp() {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetCompanyLocationLookUp', AppSettings.requestOptions()).map((response: Response) => response.json());
  }
  
  createTrnSalesInvoice(trnSalesInvoice: TrnSalesInvoice) {
    return this.http.post(AppSettings.API_ENDPOINT + 'TrnSalesInvoice', trnSalesInvoice, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  updateTrnSalesInvoice(trnSalesInvoice: TrnSalesInvoice) {
    return this.http.put(AppSettings.API_ENDPOINT + 'TrnSalesInvoice/' + trnSalesInvoice.id, trnSalesInvoice, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
}
