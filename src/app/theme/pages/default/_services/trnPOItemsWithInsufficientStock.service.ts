import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response, URLSearchParams } from "@angular/http";
import { AppSettings } from '../../../../app-settings';

@Injectable()
export class TrnPOItemsWithInsufficientStockService {
  constructor(private http: Http) {
  }

  perPage: any = 25;
  currentPos: any = 0;
  currentPageNumber: any = 1;

  getSupplierListForPO() {
    return this.http.get(AppSettings.API_ENDPOINT + 'TrnPurchaseOrder/GetSupplierListForPO', AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getPOItemsWithStockInsufficient() {
    return this.http.get(AppSettings.API_ENDPOINT + 'TrnPurchaseOrder/GetItemsWithStockInsufficient', AppSettings.requestOptions()).map((response: Response) => response.json());
  }

}
