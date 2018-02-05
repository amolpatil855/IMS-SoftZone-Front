import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response, URLSearchParams } from "@angular/http";

import { FomSize } from "../_models/fomSize";
import { AppSettings } from '../../../../app-settings';

@Injectable()
export class FomSizeService {
  constructor(private http: Http) {
  }

  perPage: any = 25;
  currentPos: any = 0;
  currentPageNumber: any = 1;

  getAllFomSizes(pageSize = 0, page = 0, search = '') {
    return this.http.get(AppSettings.API_ENDPOINT + 'FomSize?pageSize=' + pageSize + '&page=' + page + '&search=' + search, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getFomSizeById(id: number) {
    return this.http.get(AppSettings.API_ENDPOINT + 'FomSize/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getFomCollectionLookUp() {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetFomCollectionLookUp', AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getQualityLookUpByCollection(collectionId) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetQualityLookUpByCollection?collectionId=' + collectionId, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getFomDensityLookUpByQuality(qualityId) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetFomDensityLookUpByQuality?qualityId=' + qualityId, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getFomSuggestedMMLookUpByFomDensity(fomDensityId) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetFomSuggestedMMLookUpByFomDensity?fomDensityId=' + fomDensityId, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  createFomSize(fomSize: FomSize) {
    return this.http.post(AppSettings.API_ENDPOINT + 'FomSize', fomSize, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  updateFomSize(fomSize: FomSize) {
    return this.http.put(AppSettings.API_ENDPOINT + 'FomSize/' + fomSize.id, fomSize, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  deleteFomSize(id: number) {
    return this.http.delete(AppSettings.API_ENDPOINT + 'FomSize/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
}
