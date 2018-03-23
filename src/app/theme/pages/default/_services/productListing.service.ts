import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response, URLSearchParams } from "@angular/http";

import { ProductListing } from "../_models/productListing";
import { AppSettings } from '../../../../app-settings';

@Injectable()
export class ProductListingService {
  constructor(private http: Http) {
  }

  perPage: any = 25;
  currentPos: any = 0;
  currentPageNumber: any = 1;

}
