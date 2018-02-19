import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response, URLSearchParams } from "@angular/http";

import { Accessory } from "../_models/accessory";
import { AppSettings } from '../../../../app-settings';

@Injectable()
export class AccessoryService {
  constructor(private http: Http) {
  }

  perPage: any = 25;
  currentPos: any = 0;
  currentPageNumber: any = 1;

  getAllAccessories(pageSize = 0, page = 0, search = '') {
    return this.http.get(AppSettings.API_ENDPOINT + 'Accessory?pageSize=' + pageSize + '&page=' + page + '&search=' + search, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getAccessoryById(id: number) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Accessory/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getCategoryLookUp() {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetCategoryLookUp', AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getUnitOfMeasureLookup() {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetUnitOfMeasureLookup', AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getHsnLookUp() {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetHsnLookUp', AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  createAccessory(accessory: Accessory) {
    return this.http.post(AppSettings.API_ENDPOINT + 'Accessory', accessory, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  updateAccessory(accessory: Accessory) {
    return this.http.put(AppSettings.API_ENDPOINT + 'Accessory/' + accessory.id, accessory, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  deleteAccessory(id: number) {
    return this.http.delete(AppSettings.API_ENDPOINT + 'Accessory/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
}
