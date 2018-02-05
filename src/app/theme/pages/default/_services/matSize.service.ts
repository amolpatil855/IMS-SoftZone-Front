import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response, URLSearchParams } from "@angular/http";

import { MatSize } from "../_models/matSize";
import { AppSettings } from '../../../../app-settings';

@Injectable()
export class MatSizeService {
  constructor(private http: Http) {
  }

  perPage: any = 25;
  currentPos: any = 0;
  currentPageNumber: any = 1;

  getAllMatSizes(pageSize = 0, page = 0, search = '') {
    return this.http.get(AppSettings.API_ENDPOINT + 'MatSize?pageSize=' + pageSize + '&page=' + page + '&search=' + search, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getMatSizeById(id: number) {
    return this.http.get(AppSettings.API_ENDPOINT + 'MatSize/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getMatCollectionLookUp() {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetMatCollectionLookUp', AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getQualityLookUpByCollection(collectionId) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetQualityLookUpByCollection?collectionId=' + collectionId, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getMatThicknessLookUp() {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetMatThicknessLookUp', AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  createMatSize(matSize: MatSize) {
    return this.http.post(AppSettings.API_ENDPOINT + 'MatSize', matSize, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  updateMatSize(matSize: MatSize) {
    return this.http.put(AppSettings.API_ENDPOINT + 'MatSize/' + matSize.id, matSize, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  deleteMatSize(id: number) {
    return this.http.delete(AppSettings.API_ENDPOINT + 'MatSize/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
}
