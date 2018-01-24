import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response, URLSearchParams } from "@angular/http";

import { Shade } from "../_models/shade";
import { AppSettings } from '../../../../app-settings';

@Injectable()
export class ShadeService {
  constructor(private http: Http) {
  }

  perPage: any = 25;
  currentPos: any = 0;
  currentPageNumber: any = 1;

  getAllShades(pageSize=0,page=0,search='') {
    return this.http.get(AppSettings.API_ENDPOINT + 'FWRShade?pageSize='+pageSize+'&page='+page+'&search='+search, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getShadeById(id: number) {
    return this.http.get(AppSettings.API_ENDPOINT + 'FWRShade/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getCollectionLookUp(categoryId) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetCollectionLookUpByCategoryId?categoryId=' + categoryId , AppSettings.requestOptions()).map((response: Response) => response.json());
  }
  
  getCategoryLookup() {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetCategoryLookup', AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getSerialNumberLookUpByDesign(designId) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetSerialNumberLookUpByDesign?designId=' + designId, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getDesignLookupByQuality(qualityid) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetDesignLookupByQuality?qualityid=' + qualityid, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getSerialNumberLookUpByCollection(collectionId) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetSerialNumberLookUpByCollection?collectionId=' + collectionId, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getQualityLookUpByCollection(collectionId) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetQualityLookUpByCollection?collectionId=' + collectionId, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  createShade(shade: Shade) {
    return this.http.post(AppSettings.API_ENDPOINT + 'FWRShade', shade, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  updateShade(shade: Shade) {
    return this.http.put(AppSettings.API_ENDPOINT + 'FWRShade/' + shade.id, shade, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  deleteShade(id: number) {
    return this.http.delete(AppSettings.API_ENDPOINT + 'FWRShade/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
}
