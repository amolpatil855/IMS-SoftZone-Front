import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response, URLSearchParams } from "@angular/http";

import { TrnProductStock } from "../_models/trnProductStock";
import { AppSettings } from '../../../../app-settings';

@Injectable()
export class TrnProductStockService {
  constructor(private http: Http) {
  }

  perPage: any = 25;
  currentPos: any = 0;
  currentPageNumber: any = 1;

  getProductDetails(pageSize = 0, page = 0, search = '') {
    return this.http.get(AppSettings.API_ENDPOINT + 'TrnProductStockDetail?pageSize=' + pageSize + '&page=' + page + '&search=' + search, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
  
  getAllTrnProductStocks(categoryId, collectionId, parameterId, qualityId, matThicknessId, matSizeCode) {
    return this.http.get(AppSettings.API_ENDPOINT + 'TrnProductStock/GetProductDetails?categoryId=' + categoryId + '&collectionId=' + collectionId + '&parameterId=' + parameterId + '&qualityId=' + qualityId + '&matThicknessId=' + matThicknessId + '&matSizeCode=' + matSizeCode, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getTrnProductStockById(id: number) {
    return this.http.get(AppSettings.API_ENDPOINT + 'TrnProductStockDetail/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getCategoryLookUp() {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetCategoryLookUp', AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getAccessoryLookUp() {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetAccessoryLookUp', AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getCompanyLocationLookUp() {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetCompanyLocationLookUp', AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getCollectionLookUpByCategory(categoryId) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetCollectionLookUpByCategoryId?categoryId=' + categoryId, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getSerialNumberLookUpByCollection(collectionId) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetSerialNumberLookUpByCollection?collectionId=' + collectionId, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getMatSizeLookUpByCollection(collectionId) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetMatSizeLookUpByCollection?collectionId=' + collectionId, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getFomSizeLookUpByCollection(collectionId) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetFomSizeLookUpByCollection?collectionId=' + collectionId, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  createTrnProductStock(trnProductStock: TrnProductStock) {
    return this.http.post(AppSettings.API_ENDPOINT + 'TrnProductStockDetail', trnProductStock, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  updateTrnProductStock(trnProductStock: TrnProductStock) {
    return this.http.put(AppSettings.API_ENDPOINT + 'TrnProductStockDetail/' + trnProductStock.id, trnProductStock, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

}
