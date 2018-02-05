import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response, URLSearchParams } from "@angular/http";

import { Quality } from "../_models/Quality";
import { AppSettings } from '../../../../app-settings';

@Injectable()
export class QualityService {
  constructor(private http: Http) {
  }

  perPage: any = 25;
  currentPos: any = 0;
  currentPageNumber: any = 1;

  getAllQualitys(pageSize = 0, page = 0, search = '') {
    return this.http.get(AppSettings.API_ENDPOINT + 'Quality?pageSize=' + pageSize + '&page=' + page + '&search=' + search, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getQualityById(id: number) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Quality/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getQualityLookUp() {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetQualityLookUp', AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  createQuality(Quality: Quality) {
    return this.http.post(AppSettings.API_ENDPOINT + 'Quality', Quality, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  updateQuality(Quality: Quality) {
    return this.http.put(AppSettings.API_ENDPOINT + 'Quality/' + Quality.id, Quality, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  deleteQuality(id: number) {
    return this.http.delete(AppSettings.API_ENDPOINT + 'Quality/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
}
