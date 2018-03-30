import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response, URLSearchParams } from "@angular/http";

import { TrnSaleOrder } from "../_models/trnSaleOrder";
import { AppSettings } from '../../../../app-settings';

@Injectable()
export class TrnSalesOrderService {
  constructor(private http: Http) {
  }

  perPage: any = 25;
  currentPos: any = 0;
  currentPageNumber: any = 1;

  getAllTrnSaleOrders(pageSize = 0, page = 0, search = '') {
    return this.http.get(AppSettings.API_ENDPOINT + 'TrnSaleOrder?pageSize=' + pageSize + '&page=' + page + '&search=' + search, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getAllTrnSaleOrdersForCustomer(pageSize = 0, page = 0, search = '') {
    return this.http.get(AppSettings.API_ENDPOINT + 'CustomerLogin/GetSalesOrdersForLoggedInUser?pageSize=' + pageSize + '&page=' + page + '&search=' + search, AppSettings.requestOptions()).map((response: Response) => response.json());
  }


  getTrnSaleOrderByIdForCustomer(id: number) {
    return this.http.get(AppSettings.API_ENDPOINT + 'CustomerLogin/GetSalesOrderByIdForCustomerUser/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
  
  cancelSOForCustomerUser(trnSaleOrder: TrnSaleOrder){
    return this.http.put(AppSettings.API_ENDPOINT + 'CustomerLogin/CancelSOForCustomerUser/' + trnSaleOrder.id,trnSaleOrder, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  cancelSO(trnSaleOrder: TrnSaleOrder){
    return this.http.put(AppSettings.API_ENDPOINT + 'TrnSaleOrder/CancelSO/' + trnSaleOrder.id,trnSaleOrder, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getTrnSaleOrderById(id: number) {
    return this.http.get(AppSettings.API_ENDPOINT + 'TrnSaleOrder/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
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

  getCourierLookup() {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetCourierLookup', AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getCategoryLookUp() {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetCategoryLookupForSO', AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getAccessoryLookUp() {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetAccessoryLookUp', AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getCustomerAddressByCustomerId(customerId) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Customer/GetCustomerAddressByCustomerId?customerId=' + customerId, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
  
  getCollectionLookUpByCategory(categoryId) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetCollectionLookUpByCategoryId?categoryId=' + categoryId, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getCollectionLookUpByFabricCategory(categoryId) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetCollectionLookUpForSO?categoryId=' + categoryId, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getProductStockAvailabilty(categoryId, collectionId, parameterId, qualityId) {
    return this.http.get(AppSettings.API_ENDPOINT + 'TrnProductStock/GetProductDetails?categoryId=' + categoryId + '&collectionId=' + collectionId + '&parameterId=' + parameterId + '&qualityId=' + qualityId, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  approveSalesOrder(trnSaleOrder: TrnSaleOrder) {
    return this.http.put(AppSettings.API_ENDPOINT + 'TrnSaleOrder/ApproveSO/' + trnSaleOrder.id, trnSaleOrder, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getSerialNumberLookUpByCollection(collectionId) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetSerialNumberLookUpForSO?collectionId=' + collectionId, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getMatSizeLookUpByCollection(collectionId) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetMatSizeLookUpByCollection?collectionId=' + collectionId, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getFomSizeLookUpByCollection(collectionId) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetFomSizeLookUpByCollection?collectionId=' + collectionId, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  createTrnSaleOrder(trnSaleOrder: TrnSaleOrder) {
    return this.http.post(AppSettings.API_ENDPOINT + 'TrnSaleOrder', trnSaleOrder, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  createTrnSaleOrderByCustomer(trnSaleOrder: TrnSaleOrder) {
    return this.http.post(AppSettings.API_ENDPOINT + 'CustomerLogin/PostTrnSaleOrderForCustomerUser', trnSaleOrder, AppSettings.requestOptions()).map((response: Response) => response.json());
  }


  updateTrnSaleOrder(trnSaleOrder: TrnSaleOrder) {
    return this.http.put(AppSettings.API_ENDPOINT + 'TrnSaleOrder/' + trnSaleOrder.id, trnSaleOrder, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  updateTrnSaleOrderForCustomer(trnSaleOrder: TrnSaleOrder) {
    return this.http.put(AppSettings.API_ENDPOINT + 'CustomerLogin/PutTrnSaleOrderForCustomerUser' , trnSaleOrder, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  deleteTrnSaleOrder(id: number) {
    return this.http.delete(AppSettings.API_ENDPOINT + 'TrnSaleOrder/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
}
