import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response, URLSearchParams } from "@angular/http";

import { Tailor } from "../_models/tailor";
import { AppSettings } from '../../../../app-settings';

@Injectable()
export class TailorService {
  constructor(private http: Http) {
  }

  perPage: any = 25;
  currentPos: any = 0;
  currentPageNumber: any = 1;

  getAllTailors(pageSize = 0, page = 0, search = '') {
    return this.http.get(AppSettings.API_ENDPOINT + 'Tailor?pageSize=' + pageSize + '&page=' + page + '&search=' + search, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getTailorById(id: number) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Tailor/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getPatternLookup() {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetPatternDetailsForTailor', AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  createTailor(tailor: Tailor) {
    return this.http.post(AppSettings.API_ENDPOINT + 'Tailor', tailor, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  updateTailor(tailor: Tailor) {
    return this.http.put(AppSettings.API_ENDPOINT + 'Tailor/' + tailor.id, tailor, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  deleteTailor(id: number) {
    return this.http.delete(AppSettings.API_ENDPOINT + 'Tailor/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
}
