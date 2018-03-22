import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response, URLSearchParams } from "@angular/http";

import { TrnMaterialSelection } from "../_models/trnMaterialSelection";
import { AppSettings } from '../../../../app-settings';

@Injectable()
export class TrnMaterialSelectionService {
  constructor(private http: Http) {
  }

  perPage: any = 25;
  currentPos: any = 0;
  currentPageNumber: any = 1;

  getAllTrnMaterialSelections(pageSize = 0, page = 0, search = '') {
    return this.http.get(AppSettings.API_ENDPOINT + 'TrnMaterialSelection?pageSize=' + pageSize + '&page=' + page + '&search=' + search, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getTrnMaterialSelectionById(id: number) {
    return this.http.get(AppSettings.API_ENDPOINT + 'TrnMaterialSelection/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getMaterialQuotationBySelectionId(id: number) {
    return this.http.get(AppSettings.API_ENDPOINT + 'TrnMaterialSelection/CreateMaterialQuotation/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  viewMaterialQuotationById(id: number) {
    return this.http.get(AppSettings.API_ENDPOINT + 'TrnMaterialSelection/ViewMaterialQuotation/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
  
  getCompanyLocationLookUp() {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetCompanyLocationLookUp', AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getAgentLookUp() {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetAgentLookup', AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getCustomerLookUpWithoutWholesaleCustomer() {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetCustomerLookUpWithoutWholesaleCustomer', AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getCourierLookup() {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetCourierLookup', AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getCategoryLookupBySelectionType(selectionType) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetCategoryLookupBySelectionType?selectionType=' + selectionType, AppSettings.requestOptions()).map((response: Response) => response.json());
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

  approveSalesOrder(trnMaterialSelection: TrnMaterialSelection) {
    return this.http.put(AppSettings.API_ENDPOINT + 'TrnMaterialSelection/ApproveSO/' + trnMaterialSelection.id, trnMaterialSelection, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getSerialNumberLookUpByCollection(collectionId) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetSerialNumberLookUpByCollection?collectionId=' + collectionId, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getMatSizeLookUpByCollection(collectionId) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetMatSizeLookUpByCollection?collectionId=' + collectionId, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getFomSizeLookUpByCollection(collectionId) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetFomSizeLookUpByCollection?collectionId=' + collectionId, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  createTrnMaterialSelection(trnMaterialSelection: TrnMaterialSelection) {
    return this.http.post(AppSettings.API_ENDPOINT + 'TrnMaterialSelection', trnMaterialSelection, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  updateTrnMaterialSelection(trnMaterialSelection: TrnMaterialSelection) {
    return this.http.put(AppSettings.API_ENDPOINT + 'TrnMaterialSelection/' + trnMaterialSelection.id, trnMaterialSelection, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  deleteTrnMaterialSelection(id: number) {
    return this.http.delete(AppSettings.API_ENDPOINT + 'TrnMaterialSelection/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
}
