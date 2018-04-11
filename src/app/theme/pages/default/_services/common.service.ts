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
  courierModeData = ['Surface', 'Air'];
  getStateList() {
    let stateList = this.states;
<<<<<<< HEAD
    stateList.push({ label: '--Select--', value: '0' });
    this.stateData.forEach(function (element) {
=======
    stateList.push({ label: '--Select--', value: null });
    this.stateData.forEach(function(element) {
>>>>>>> a0c0d88ba4c0ef1ffd9678b7d79f8e1fa4b425a2
      stateList.push({ label: element, value: element });
    });
  }

  getCourierMode() {
    let courierMode = this.courierMode;
    courierMode.push({ label: '--Select--', value: '0' });
    this.courierModeData.forEach(function (element) {
      courierMode.push({ label: element, value: element });
    });
  }

  getGender() {
    let gender = ["Male", "Female", "Other"];
    return gender;
    //return this.http.get(AppSettings.API_ENDPOINT + 'categories', AppSettings.requestOptions()).map((response: Response) => response.json());  
  }

  getPatternLookup() {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetPatternLookup', AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getAllPatternData() {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetAllPatterns', AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getRodAccessoryItemCodeForCQ() {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetRodAccessoryItemCodeForCQ', AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  GetTrackAccessoryItemCodeForCQ() {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetTrackAccessoryItemCodeForCQ', AppSettings.requestOptions()).map((response: Response) => response.json());
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
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetCompanyLocationById?locationId=' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getCategoryCodesForSO() {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetCategoryLookupForSO', AppSettings.requestOptions()).map((response: Response) => response.json());
  }
  getAccessoryLookUp() {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetAccessoryLookUp', AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getAccessoryLookUpBySupplierId(supplierId) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetAccessoryLookUpBySupplierId?supplierId=' + supplierId, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
}
