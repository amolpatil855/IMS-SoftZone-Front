import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response, URLSearchParams } from "@angular/http";

import { Courier } from "../_models/courier";
import { AppSettings } from '../../../../app-settings';

@Injectable()
export class CourierService {
  constructor(private http: Http) {
  }

  perPage: any = 25;
  currentPos: any = 0;
  currentPageNumber: any = 1;

  getAllCouriers(pageSize = 0, page = 0, search = '') {
    return this.http.get(AppSettings.API_ENDPOINT + 'Courier?pageSize=' + pageSize + '&page=' + page + '&search=' + search, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getCourierById(id: number) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Courier/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getCourierLookUp() {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetCourierLookup', AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  createCourier(courier: Courier) {
    return this.http.post(AppSettings.API_ENDPOINT + 'Courier', courier, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  updateCourier(courier: Courier) {
    return this.http.put(AppSettings.API_ENDPOINT + 'Courier/' + courier.id, courier, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  deleteCourier(id: number) {
    return this.http.delete(AppSettings.API_ENDPOINT + 'Courier/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
}
