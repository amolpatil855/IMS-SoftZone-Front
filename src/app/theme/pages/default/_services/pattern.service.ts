import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response, URLSearchParams } from "@angular/http";

import { Pattern } from "../_models/pattern";
import { AppSettings } from '../../../../app-settings';

@Injectable()
export class PatternService {
  constructor(private http: Http) {
  }

  perPage: any = 25;
  currentPos: any = 0;
  currentPageNumber: any = 1;

  getAllPatterns(pageSize = 0, page = 0, search = '') {
    return this.http.get(AppSettings.API_ENDPOINT + 'Pattern?pageSize=' + pageSize + '&page=' + page + '&search=' + search, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getPatternById(id: number) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Pattern/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  createPattern(pattern: Pattern) {
    return this.http.post(AppSettings.API_ENDPOINT + 'Pattern', pattern, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  updatePattern(pattern: Pattern) {
    return this.http.put(AppSettings.API_ENDPOINT + 'Pattern/' + pattern.id, pattern, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  deletePattern(id: number) {
    return this.http.delete(AppSettings.API_ENDPOINT + 'Pattern/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
}
