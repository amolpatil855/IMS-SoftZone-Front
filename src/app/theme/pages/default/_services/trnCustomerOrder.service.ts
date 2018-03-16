import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response, URLSearchParams } from "@angular/http";

import { TrnCustomerOrder } from "../_models/trnCustomerOrder";
import { AppSettings } from '../../../../app-settings';

@Injectable()
export class TrnCustomerOrderService {
  constructor(private http: Http) {
  }

  perPage: any = 25;
  currentPos: any = 0;
  currentPageNumber: any = 1;

  getAllTrnCustomerOrders(pageSize = 0, page = 0, search = '') {
    return this.http.get(AppSettings.API_ENDPOINT + 'TrnCustomerOrder?pageSize=' + pageSize + '&page=' + page + '&search=' + search, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getTrnCustomerOrderById(id: number) {
    return this.http.get(AppSettings.API_ENDPOINT + 'TrnCustomerOrder/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
  
  createTrnCustomerOrder(trnCustomerOrder: TrnCustomerOrder) {
    return this.http.post(AppSettings.API_ENDPOINT + 'TrnCustomerOrder', trnCustomerOrder, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  updateTrnCustomerOrder(trnCustomerOrder: TrnCustomerOrder) {
    return this.http.put(AppSettings.API_ENDPOINT + 'TrnCustomerOrder/' + trnCustomerOrder.id, trnCustomerOrder, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  cancelPurchaseOrder(trnCustomerOrder: TrnCustomerOrder) {
    return this.http.put(AppSettings.API_ENDPOINT + 'TrnCustomerOrder/CancelPO/' + trnCustomerOrder.id, trnCustomerOrder, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  approvePurchaseOrder(trnCustomerOrder: TrnCustomerOrder) {
    return this.http.put(AppSettings.API_ENDPOINT + 'TrnCustomerOrder/ApprovePO/' + trnCustomerOrder.id, trnCustomerOrder, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

}
