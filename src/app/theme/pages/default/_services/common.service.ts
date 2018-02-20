import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response } from "@angular/http";

//import { Categories } from "../_models/index";
import { AppSettings } from '../../../../app-settings';

@Injectable()
export class CommonService {
  constructor(private http: Http) {
    this.getStateList();
    this.getCourierMode();
  }
  perPage: any = 25;
  currentPos: any = 0;
  currentPageNumber: any = 1;
  states = [];
  stateData = ['Andra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Madya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Orissa', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Tripura', 'Uttaranchal', 'Uttar Pradesh', 'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh', 'Dadar and Nagar Haveli', 'Daman and Diu', 'Delhi', 'Lakshadeep', 'Pondicherry'];
  courierMode = [];
  courierModeData = ['Surface','Air'];
  getStateList() {
    let stateList = this.states;
    stateList.push({ label: '--Select--', value: '0' });
    this.stateData.forEach(function(element) {
      stateList.push({ label: element, value: element });
    });
  }

  getCourierMode() {
    let courierMode = this.courierMode;
    courierMode.push({ label: '--Select--', value: '0' });
    this.courierModeData.forEach(function(element) {
      courierMode.push({ label: element, value: element });
    });
  }

  getGender() {
    let gender = ["Male", "Female", "Other"];
    return gender;
    //return this.http.get(AppSettings.API_ENDPOINT + 'categories', AppSettings.requestOptions()).map((response: Response) => response.json());  
  }

  getCategoryCodes() {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetCategoryLookup', AppSettings.requestOptions()).map((response: Response) => response.json());
  }
  getCategoryWithoutAccessory() {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetCategoryWithoutAccessory', AppSettings.requestOptions()).map((response: Response) => response.json());
  }
  getLocation() {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetCompanyLocationLookUp', AppSettings.requestOptions()).map((response: Response) => response.json());
  }
  getLocationById(id) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetCompanyLocationById?locationId='+id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getAccessoryLookUp() {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetAccessoryLookUp', AppSettings.requestOptions()).map((response: Response) => response.json());
  }
}
