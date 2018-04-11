import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response, URLSearchParams } from "@angular/http";

import { TrnWorkOrder } from "../_models/trnWorkOrder";
import { AppSettings } from '../../../../app-settings';

@Injectable()
export class TrnWorkOrderService {
  constructor(private http: Http) {
  }

  perPage: any = 25;
  currentPos: any = 0;
  currentPageNumber: any = 1;

  getAllTrnWorkOrders(pageSize = 0, page = 0, search = '') {
    return this.http.get(AppSettings.API_ENDPOINT + 'TrnWorkOrder?pageSize=' + pageSize + '&page=' + page + '&search=' + search, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getAllTrnWorkOrdersForCustomer(pageSize = 0, page = 0, search = '') {
    return this.http.get(AppSettings.API_ENDPOINT + 'CustomerLogin/GetWorkOrdersForLoggedInUser?pageSize=' + pageSize + '&page=' + page + '&search=' + search, AppSettings.requestOptions()).map((response: Response) => response.json());
  }


  getTrnWorkOrderByIdForCustomer(id: number) {
    return this.http.get(AppSettings.API_ENDPOINT + 'CustomerLogin/GetWorkOrderByIdForCustomerUser/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  cancelWOForCustomerUser(trnWorkOrder: TrnWorkOrder) {
    return this.http.put(AppSettings.API_ENDPOINT + 'CustomerLogin/CancelWOForCustomerUser/' + trnWorkOrder.id, trnWorkOrder, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  cancelWO(trnWorkOrder: TrnWorkOrder) {
    return this.http.put(AppSettings.API_ENDPOINT + 'TrnWorkOrder/CancelWO/' + trnWorkOrder.id, trnWorkOrder, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getTrnWorkOrderById(id: number) {
    return this.http.get(AppSettings.API_ENDPOINT + 'TrnWorkOrder/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getCompanyLocationLookUp() {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetCompanyLocationLookUp', AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getAgentLookUp() {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetAgentLookup', AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getCustomerLookUp() {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetCustomerLookUp', AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getCustomerAddressByCustomerId(customerId) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Customer/GetCustomerAddressByCustomerId?customerId=' + customerId, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  approveWorkOrder(trnWorkOrder: TrnWorkOrder) {
    return this.http.put(AppSettings.API_ENDPOINT + 'TrnWorkOrder/ApproveSO/' + trnWorkOrder.id, trnWorkOrder, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  createTrnWorkOrder(trnWorkOrder: TrnWorkOrder) {
    return this.http.post(AppSettings.API_ENDPOINT + 'TrnWorkOrder', trnWorkOrder, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  createTrnWorkOrderByCustomer(trnWorkOrder: TrnWorkOrder) {
    return this.http.post(AppSettings.API_ENDPOINT + 'CustomerLogin/PostTrnWorkOrderForCustomerUser', trnWorkOrder, AppSettings.requestOptions()).map((response: Response) => response.json());
  }


  updateTrnWorkOrder(trnWorkOrder: TrnWorkOrder) {
    return this.http.put(AppSettings.API_ENDPOINT + 'TrnWorkOrder/' + trnWorkOrder.id, trnWorkOrder, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  updateTrnWorkOrderForCustomer(trnWorkOrder: TrnWorkOrder) {
    return this.http.put(AppSettings.API_ENDPOINT + 'CustomerLogin/PutTrnWorkOrderForCustomerUser', trnWorkOrder, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  deleteTrnWorkOrder(id: number) {
    return this.http.delete(AppSettings.API_ENDPOINT + 'TrnWorkOrder/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
}
