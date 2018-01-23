import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response } from "@angular/http";

//import { Categories } from "../_models/index";
import { AppSettings } from '../../../../app-settings';

@Injectable()
export class CommonService {
  constructor(private http: Http) {
  }
  perPage: any = 25;
  currentPos: any = 0;
  currentPageNumber: any = 1;
  getGender() {
    let gender = ["Male", "Female", "Other"];
    return gender;
    //return this.http.get(AppSettings.API_ENDPOINT + 'categories', AppSettings.requestOptions()).map((response: Response) => response.json());  
  }

  getCategoryCodes() {
    return this.http.get(AppSettings.API_ENDPOINT + 'Collection/GetCategoryLookup', AppSettings.requestOptions()).map((response: Response) => response.json());
  }
 
}
