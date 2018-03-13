import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response, URLSearchParams } from "@angular/http";

import { AppSettings } from '../../../../app-settings';
import { Customer } from "../_models/customer";

@Injectable()
export class CustomerService {
  constructor(private http: Http) {
  }

  perPage: any = 25;
  currentPos: any = 0;
  currentPageNumber: any = 1;

  getAllCustomers(pageSize = 0, page = 0, search = '') {
    return this.http.get(AppSettings.API_ENDPOINT + 'Customer?pageSize=' + pageSize + '&page=' + page + '&search=' + search, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getCustomerById(id: number) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Customer/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  createCustomer(customer: any) {
    return this.http.post(AppSettings.API_ENDPOINT + 'Customer', customer, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  updateCustomer(customer: Customer) {
    return this.http.put(AppSettings.API_ENDPOINT + 'Customer/' + customer.id, customer, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  deleteCustomer(id: number) {
    return this.http.delete(AppSettings.API_ENDPOINT + 'Customer/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
}
