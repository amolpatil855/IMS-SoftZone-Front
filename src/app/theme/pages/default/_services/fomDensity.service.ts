import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response, URLSearchParams } from "@angular/http";

import { FomDensity } from "../_models/fomDensity";
import { AppSettings } from '../../../../app-settings';

@Injectable()
export class FomDensityService {
  constructor(private http: Http) {
  }

  perPage: any = 25;
  currentPos: any = 0;
  currentPageNumber: any = 1;

  getAllFomDensitys(pageSize = 0, page = 0, search = '') {
    return this.http.get(AppSettings.API_ENDPOINT + 'FomDensity?pageSize=' + pageSize + '&page=' + page + '&search=' + search, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getFomDensityById(id: number) {
    return this.http.get(AppSettings.API_ENDPOINT + 'FomDensity/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getFomCollectionLookUp() {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetFomCollectionLookUp', AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getQualityLookUpByCollection(collectionId) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetQualityLookUpByCollection?collectionId=' + collectionId, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getFomDensityLookUp() {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetFomDensityLookUp', AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  createFomDensity(fomDensity: FomDensity) {
    return this.http.post(AppSettings.API_ENDPOINT + 'FomDensity', fomDensity, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  updateFomDensity(fomDensity: FomDensity) {
    return this.http.put(AppSettings.API_ENDPOINT + 'FomDensity/' + fomDensity.id, fomDensity, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  deleteFomDensity(id: number) {
    return this.http.delete(AppSettings.API_ENDPOINT + 'FomDensity/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
}
