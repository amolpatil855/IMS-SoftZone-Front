import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response, URLSearchParams } from "@angular/http";

import { TrnCurtainSelection } from "../_models/trnCurtainSelection";
import { AppSettings } from '../../../../app-settings';

@Injectable()
export class TrnCurtainSelectionService {
  constructor(private http: Http) {
  }

  perPage: any = 25;
  currentPos: any = 0;
  currentPageNumber: any = 1;

  getAllTrnCurtainSelections(pageSize = 0, page = 0, search = '') {
    return this.http.get(AppSettings.API_ENDPOINT + 'TrnCurtainSelection?pageSize=' + pageSize + '&page=' + page + '&search=' + search, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getTrnCurtainSelectionById(id: number) {
    return this.http.get(AppSettings.API_ENDPOINT + 'TrnCurtainSelection/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getShadeForCurtainSelectionByCollectionId(id: number) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetSerialNumberForCS?collectionId=' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getAccessoryCodeListForselection() {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetAccessoryItemCodeForCS', AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  viewCurtainQuotation(id) {
    return this.http.get(AppSettings.API_ENDPOINT + 'TrnCurtainSelection/ViewCurtainQuotation' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }


  createTrnCurtainSelection(trnCurtainSelection: TrnCurtainSelection) {
    return this.http.post(AppSettings.API_ENDPOINT + 'TrnCurtainSelection', trnCurtainSelection, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  updateTrnCurtainSelection(trnCurtainSelection: TrnCurtainSelection) {
    return this.http.put(AppSettings.API_ENDPOINT + 'TrnCurtainSelection/' + trnCurtainSelection.id, trnCurtainSelection, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  deleteTrnCurtainSelection(id: number) {
    return this.http.delete(AppSettings.API_ENDPOINT + 'TrnCurtainSelection/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
}
