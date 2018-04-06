import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response, URLSearchParams } from "@angular/http";

import { StockEnquiry } from "../_models/stockEnquiry";
import { AppSettings } from '../../../../app-settings';

@Injectable()
export class StockEnquiryService {
  constructor(private http: Http) {
  }

  perPage: any = 25;
  currentPos: any = 0;
  currentPageNumber: any = 1;

}
