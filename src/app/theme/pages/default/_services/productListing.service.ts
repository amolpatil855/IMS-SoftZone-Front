import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response, URLSearchParams } from "@angular/http";

import { ProductListing } from "../_models/productListing";
import { AppSettings } from '../../../../app-settings';

@Injectable()
export class ProductListingService {
  constructor(private http: Http) {
  }

  perPage: any = 25;
  currentPos: any = 0;
  currentPageNumber: any = 1;

  getCategoryLookUp() {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetCategoryLookupForSO', AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getAccessoryProducts(pageSize = 0, page = 0, search = '') {
    return this.http.get(AppSettings.API_ENDPOINT + 'ProductList/GetAccessoryProducts?pageSize=' + pageSize + '&page=' + page + '&search=' + search, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getFabricProducts(pageSize = 0, page = 0, search = '') {
    return this.http.get(AppSettings.API_ENDPOINT + 'ProductList/GetFabricProducts?pageSize=' + pageSize + '&page=' + page + '&search=' + search, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getFoamProducts(pageSize = 0, page = 0, search = '') {
    return this.http.get(AppSettings.API_ENDPOINT + 'ProductList/GetFoamProducts?pageSize=' + pageSize + '&page=' + page + '&search=' + search, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getProductStock(categoryId, collectionId, parameterId) {
    return this.http.get(AppSettings.API_ENDPOINT + 'ProductList/GetProductStock?categoryId=' + categoryId + '&collectionId=' + collectionId + '&parameterId=' + parameterId, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

}
