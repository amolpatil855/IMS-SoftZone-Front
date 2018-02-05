import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response, URLSearchParams } from "@angular/http";

import { MatThickness } from "../_models/matThickness";
import { AppSettings } from '../../../../app-settings';

@Injectable()
export class MatThicknessService {
  constructor(private http: Http) {
  }

  perPage: any = 25;
  currentPos: any = 0;
  currentPageNumber: any = 1;

  getAllMatThicknesss(pageSize = 0, page = 0, search = '') {
    return this.http.get(AppSettings.API_ENDPOINT + 'MatThickness?pageSize=' + pageSize + '&page=' + page + '&search=' + search, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getMatThicknessById(id: number) {
    return this.http.get(AppSettings.API_ENDPOINT + 'MatThickness/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  createMatThickness(matThickness: MatThickness) {
    return this.http.post(AppSettings.API_ENDPOINT + 'MatThickness', matThickness, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  updateMatThickness(matThickness: MatThickness) {
    return this.http.put(AppSettings.API_ENDPOINT + 'MatThickness/' + matThickness.id, matThickness, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  deleteMatThickness(id: number) {
    return this.http.delete(AppSettings.API_ENDPOINT + 'MatThickness/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
}
