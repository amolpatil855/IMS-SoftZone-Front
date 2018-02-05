import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response, URLSearchParams } from "@angular/http";

import { FomSuggestedMM } from "../_models/fomSuggestedMM";
import { AppSettings } from '../../../../app-settings';

@Injectable()
export class FomSuggestedMMService {
  constructor(private http: Http) {
  }

  perPage: any = 25;
  currentPos: any = 0;
  currentPageNumber: any = 1;

  getAllFomSuggestedMMs(pageSize = 0, page = 0, search = '') {
    return this.http.get(AppSettings.API_ENDPOINT + 'FomSuggestedMM?pageSize=' + pageSize + '&page=' + page + '&search=' + search, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getFomSuggestedMMById(id: number) {
    return this.http.get(AppSettings.API_ENDPOINT + 'FomSuggestedMM/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
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

  createFomSuggestedMM(fomSuggestedMM: FomSuggestedMM) {
    return this.http.post(AppSettings.API_ENDPOINT + 'FomSuggestedMM', fomSuggestedMM, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  updateFomSuggestedMM(fomSuggestedMM: FomSuggestedMM) {
    return this.http.put(AppSettings.API_ENDPOINT + 'FomSuggestedMM/' + fomSuggestedMM.id, fomSuggestedMM, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  deleteFomSuggestedMM(id: number) {
    return this.http.delete(AppSettings.API_ENDPOINT + 'FomSuggestedMM/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
}
