import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response, URLSearchParams } from "@angular/http";

import { TrnPurchaseOrder } from "../_models/trnPurchaseOrder";
import { AppSettings } from '../../../../app-settings';

@Injectable()
export class TrnPurchaseOrderService {
  constructor(private http: Http) {
  }

  perPage: any = 25;
  currentPos: any = 0;
  currentPageNumber: any = 1;

  getAllTrnPurchaseOrders(pageSize = 0, page = 0, search = '') {
    return this.http.get(AppSettings.API_ENDPOINT + 'TrnPurchaseOrder?pageSize=' + pageSize + '&page=' + page + '&search=' + search, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getCourierLookUp() {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetCourierLookup', AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getCollectionBySuppliernCategoryId(supplierId, categoryId) {
    return this.http.get(AppSettings.API_ENDPOINT + 'TrnPurchaseOrder/GetCollectionBySuppliernCategoryId?supplierId=' + supplierId + '&categoryId=' + categoryId, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getTrnPurchaseOrderById(id: number) {
    return this.http.get(AppSettings.API_ENDPOINT + 'TrnPurchaseOrder/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
  
  createTrnPurchaseOrder(trnPurchaseOrder: TrnPurchaseOrder) {
    return this.http.post(AppSettings.API_ENDPOINT + 'TrnPurchaseOrder', trnPurchaseOrder, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  updateTrnPurchaseOrder(trnPurchaseOrder: TrnPurchaseOrder) {
    return this.http.put(AppSettings.API_ENDPOINT + 'TrnPurchaseOrder/' + trnPurchaseOrder.id, trnPurchaseOrder, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  cancelPurchaseOrder(trnPurchaseOrder: TrnPurchaseOrder) {
    return this.http.put(AppSettings.API_ENDPOINT + 'TrnPurchaseOrder/CancelPO/' + trnPurchaseOrder.id, trnPurchaseOrder, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  approvePurchaseOrder(trnPurchaseOrder: TrnPurchaseOrder) {
    return this.http.put(AppSettings.API_ENDPOINT + 'TrnPurchaseOrder/ApprovePO/' + trnPurchaseOrder.id, trnPurchaseOrder, AppSettings.requestOptions()).map((response: Response) => response.json());
  }


  getshadeIdPurchaseOrders(id) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetSerialNumberLookUpByCollection?collectionId=' + id , AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getFoamSizePurchaseOrders(id) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetFomSizeLookUpByCollection?collectionId=' + id , AppSettings.requestOptions()).map((response: Response) => response.json());
  }
  
  getMatsizePurchaseOrders(id) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetMatSizeLookUpByCollection?collectionId=' + id , AppSettings.requestOptions()).map((response: Response) => response.json());
  }

}
