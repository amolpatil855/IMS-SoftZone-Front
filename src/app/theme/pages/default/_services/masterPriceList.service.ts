import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response, URLSearchParams } from "@angular/http";
import { AppSettings } from '../../../../app-settings';

@Injectable()
export class MasterPriceListService {
  constructor(private http: Http) {
  }

  perPage: any = 25;
  currentPos: any = 0;
  currentPageNumber: any = 1;

  getCategoryLookUp() {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetCategoryLookup', AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getAccessoryProducts(pageSize = 0, page = 0) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Reports/GetAccessoryProducts?pageSize=' + pageSize + '&page=' + page, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getFabricProducts(pageSize = 0, page = 0) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Reports/GetFabricProducts?pageSize=' + pageSize + '&page=' + page, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getFoamProducts(pageSize = 0, page = 0) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Reports/GetFoamProducts?pageSize=' + pageSize + '&page=' + page, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getMattressProducts(pageSize = 0, page = 0) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Reports/GetMattressProducts?pageSize=' + pageSize + '&page=' + page, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getRugProducts(pageSize = 0, page = 0) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Reports/GetRugProducts?pageSize=' + pageSize + '&page=' + page, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getWallpaperProducts(pageSize = 0, page = 0) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Reports/GetWallpaperProducts?pageSize=' + pageSize + '&page=' + page, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
  
}
