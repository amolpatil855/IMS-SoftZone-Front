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
    return this.http.get(AppSettings.API_ENDPOINT + 'Reports/GetAccessoryProductsForCL?pageSize=' + pageSize + '&page=' + page, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getFabricProducts(pageSize = 0, page = 0) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Reports/GetFabricProductsForCL?pageSize=' + pageSize + '&page=' + page, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getFoamProducts(pageSize = 0, page = 0) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Reports/GetFoamProductsForCL?pageSize=' + pageSize + '&page=' + page, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getAccessoryProductsForExport() {
    return this.http.get(AppSettings.API_ENDPOINT + 'Reports/GetAccessoryProductsForCLExport', AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getFabricProductsForExport() {
    return this.http.get(AppSettings.API_ENDPOINT + 'Reports/GetFabricProductsForCLExport', AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getFoamProductsForExport() {
    return this.http.get(AppSettings.API_ENDPOINT + 'Reports/GetFoamProductsForCLExport', AppSettings.requestOptions()).map((response: Response) => response.json());
  }
  
}
