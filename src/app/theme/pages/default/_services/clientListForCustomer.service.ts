import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response, URLSearchParams } from "@angular/http";
import { AppSettings } from '../../../../app-settings';

@Injectable()
export class ClientListForCustomerService {
  constructor(private http: Http) {
  }

  perPage: any = 25;
  currentPos: any = 0;
  currentPageNumber: any = 1;

  getAccessoryProducts(pageSize = 0, page = 0) {
    return this.http.get(AppSettings.API_ENDPOINT + 'CustomerLogin/GetAccessoryProducts?pageSize=' + pageSize + '&page=' + page, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getFabricProducts(pageSize = 0, page = 0) {
    return this.http.get(AppSettings.API_ENDPOINT + 'CustomerLogin/GetFabricProducts?pageSize=' + pageSize + '&page=' + page, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getFoamProducts(pageSize = 0, page = 0) {
    return this.http.get(AppSettings.API_ENDPOINT + 'CustomerLogin/GetFoamProducts?pageSize=' + pageSize + '&page=' + page, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getAccessoryProductsForExport() {
    return this.http.get(AppSettings.API_ENDPOINT + 'CustomerLogin/GetAccessoryProductsForExport', AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getFabricProductsForExport() {
    return this.http.get(AppSettings.API_ENDPOINT + 'CustomerLogin/GetFabricProductsForExport', AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getFoamProductsForExport() {
    return this.http.get(AppSettings.API_ENDPOINT + 'CustomerLogin/GetFoamProductsForExport', AppSettings.requestOptions()).map((response: Response) => response.json());
  }
  
}
