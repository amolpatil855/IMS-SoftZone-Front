import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response, URLSearchParams } from "@angular/http";

import { Design } from "../_models/design";
import { AppSettings } from '../../../../app-settings';

@Injectable()
export class DesignService {
  constructor(private http: Http) {
  }

  perPage: any = 25;
  currentPos: any = 0;
  currentPageNumber: any = 1;

  getAllDesigns(pageSize=0,page=0,search='') {
    return this.http.get(AppSettings.API_ENDPOINT + 'Design?pageSize='+pageSize+'&page='+page+'&search='+search, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getDesignById(id: number) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Design/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getDesignLookupByQuality() {
    return this.http.get(AppSettings.API_ENDPOINT + 'Design/GetDesignLookupByQuality', AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getCategoryLookUp() {
    return this.http.get(AppSettings.API_ENDPOINT + 'Design/GetCategoryLookUp', AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getCollectionLookUp() {
    return this.http.get(AppSettings.API_ENDPOINT + 'Collection/GetCollectionLookUp', AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getQualityLookUpByCollection() {
    return this.http.get(AppSettings.API_ENDPOINT + 'Quality/GetQualityLookUpByCollection', AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  createDesign(design: Design) {
    return this.http.post(AppSettings.API_ENDPOINT + 'Design', design, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  updateDesign(design: Design) {
    return this.http.put(AppSettings.API_ENDPOINT + 'Design/' + design.id, design, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  deleteDesign(id: number) {
    return this.http.delete(AppSettings.API_ENDPOINT + 'Design/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
}
