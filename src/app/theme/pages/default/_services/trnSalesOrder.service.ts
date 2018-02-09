import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response, URLSearchParams } from "@angular/http";

import { TrnSalesOrder } from "../_models/trnSalesOrder";
import { AppSettings } from '../../../../app-settings';

@Injectable()
export class TrnSalesOrderService {
  constructor(private http: Http) {
  }

  perPage: any = 25;
  currentPos: any = 0;
  currentPageNumber: any = 1;

  getAllTrnSalesOrders(pageSize = 0, page = 0, search = '') {
    return this.http.get(AppSettings.API_ENDPOINT + 'TrnSalesOrder?pageSize=' + pageSize + '&page=' + page + '&search=' + search, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getTrnSalesOrderById(id: number) {
    return this.http.get(AppSettings.API_ENDPOINT + 'TrnSalesOrder/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
  
  createTrnSalesOrder(trnSalesOrder: TrnSalesOrder) {
    return this.http.post(AppSettings.API_ENDPOINT + 'TrnSalesOrder', trnSalesOrder, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  updateTrnSalesOrder(trnSalesOrder: TrnSalesOrder) {
    return this.http.put(AppSettings.API_ENDPOINT + 'TrnSalesOrder/' + trnSalesOrder.id, trnSalesOrder, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

}
