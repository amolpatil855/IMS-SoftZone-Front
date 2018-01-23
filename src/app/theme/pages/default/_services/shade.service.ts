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
    return this.http.get(AppSettings.API_ENDPOINT + 'Shade?pageSize='+pageSize+'&page='+page+'&search='+search, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getShadeById(id: number) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Shade/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getShadeLookUp() {
    return this.http.get(AppSettings.API_ENDPOINT + 'Shade/GetShadeLookUp', AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  createShade(shade: Shade) {
    return this.http.post(AppSettings.API_ENDPOINT + 'Shade', shade, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  updateShade(shade: Shade) {
    return this.http.put(AppSettings.API_ENDPOINT + 'Shade/' + shade.id, shade, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  deleteShade(id: number) {
    return this.http.delete(AppSettings.API_ENDPOINT + 'Shade/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
}
