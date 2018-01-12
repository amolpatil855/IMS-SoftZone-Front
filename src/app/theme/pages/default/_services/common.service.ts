import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response } from "@angular/http";

import { Categories } from "../_models/index";
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
  getClass() {
    //let classList = ["--select--", "1st", "2nd", "3rd"];
    //return classList;
    return this.http.get(AppSettings.API_ENDPOINT + 'Classes', AppSettings.requestOptions()).map((response: Response) => response.json());
  }
  getCategory() {
    //let category = ["--select--", "General", "RTE", "Management", "Staff"];
    //return category;
    return this.http.get(AppSettings.API_ENDPOINT + 'Schools/' + localStorage.getItem("schoolId") + '/Schoolcategories', AppSettings.requestOptions()).map((response: Response) => response.json());
  }
  getYear() {
    //let year = ["--select--", "2000", "2001", "2002"];
    //return year;
    return this.http.get(AppSettings.API_ENDPOINT + 'Academicyears', AppSettings.requestOptions()).map((response: Response) => response.json());
  }
  getBoard() {
    //let board = ["--select--", "SSC", "CBSC", "ICSC"];
    //return board;
    return this.http.get(AppSettings.API_ENDPOINT + 'Boards', AppSettings.requestOptions()).map((response: Response) => response.json());
  }
  getBloodGroup() {
    let blooDgroup = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
    return blooDgroup;
    //return this.http.get(AppSettings.API_ENDPOINT + 'categories', AppSettings.requestOptions()).map((response: Response) => response.json());  
  }

  getZoneList() {
    //let zoneGroup = ["Zone 1", "Zone 2", "Zone 3"];
    //return zoneGroup;
    return this.http.get(AppSettings.API_ENDPOINT + 'Zones', AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getChargeHeader() {
    let chargeHeads = ["ChargeHead1", "ChargeHead2", "ChargeHead3", "ChargeHead4", "ChargeHead5", "ChargeHead6", "ChargeHead7", "ChargeHead8", "ChargeHead9", "ChargeHead10", "ChargeHead11"];
    return chargeHeads;
    //return this.http.get(AppSettings.API_ENDPOINT + 'categories', AppSettings.requestOptions()).map((response: Response) => response.json());  
  }

  getConfigurationKey() {
    let configurationKeys = [{ "keyName": "InvoiceAcronym", "Name": "Invoice Acronym", "keyValue": "" }];
    return configurationKeys;
  }

  getConfigurationKeySFS() {
    let configurationKeys = [{ "keyName": "AggregatorId", "Name": "Aggregator ID", "keyValue": "" },
    { "keyName": "AggregatorKey", "Name": "Aggregator Key", "keyValue": "" }];
    return configurationKeys;
  }

  getAllAudit(url) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Vwauditlogs/' + (localStorage.getItem('schoolId') === undefined ? 0 : localStorage.getItem('schoolId')) + '/getAuditDetails' + url, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
  getAuditCount(url) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Vwauditlogs/' + (localStorage.getItem('schoolId') === undefined ? 0 : localStorage.getItem('schoolId')) + '/getAuditDetailsCount' + url, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

}
