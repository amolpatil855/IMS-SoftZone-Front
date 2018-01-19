import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response, URLSearchParams } from "@angular/http";

import { Supplier } from "../_models/supplier";
import { AppSettings } from '../../../../app-settings';

@Injectable()
export class SupplierService {
  constructor(private http: Http) {
  }

  perPage: any = 25;
  currentPos: any = 0;
  currentPageNumber: any = 1;

  getAllSuppliers() {
    return this.http.get(AppSettings.API_ENDPOINT + 'Supplier', AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getSupplierById(id: number) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Supplier/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getSupplierLookUp() {
    return this.http.get(AppSettings.API_ENDPOINT + 'Supplier/GetSupplierLookUp', AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  createSupplier(Supplier: Supplier) {
    return this.http.post(AppSettings.API_ENDPOINT + 'Supplier', Supplier, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  updateSupplier(supplier: Supplier) {
    return this.http.put(AppSettings.API_ENDPOINT + 'Supplier/' + supplier.id, Supplier, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  deleteSupplier(id: number) {
    return this.http.delete(AppSettings.API_ENDPOINT + 'Supplier/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
}
