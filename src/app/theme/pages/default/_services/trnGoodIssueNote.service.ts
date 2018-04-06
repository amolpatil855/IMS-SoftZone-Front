import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response, URLSearchParams } from "@angular/http";

import { TrnGoodIssueNote } from "../_models/trnGoodIssueNote";
import { AppSettings } from '../../../../app-settings';

@Injectable()
export class TrnGoodIssueNoteService {
  constructor(private http: Http) {
  }

  perPage: any = 25;
  currentPos: any = 0;
  currentPageNumber: any = 1;

  getAllTrnGoodIssueNotes(pageSize = 0, page = 0, search = '') {
    return this.http.get(AppSettings.API_ENDPOINT + 'TrnGoodIssueNote?pageSize=' + pageSize + '&page=' + page + '&search=' + search, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getPOListForSelectedItem(categoryId, collectionId, parameterId, matSizeCode) {
    return this.http.get(AppSettings.API_ENDPOINT + 'TrnGoodIssueNote/GetPOListForSelectedItem?categoryId=' + categoryId + '&collectionId=' + collectionId + '&parameterId=' + parameterId + '&matSizeCode=' + matSizeCode, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getTrnGoodIssueNoteById(id: number) {
    return this.http.get(AppSettings.API_ENDPOINT + 'TrnGoodIssueNote/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getshadeIdTrnGoodIssueNotes(id) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetSerialNumberLookUpForGRN?collectionId=' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getFoamSizeTrnGoodIssueNotes(id) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetFomSizeLookUpForGRN?collectionId=' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getMatsizeTrnGoodIssueNotes(id) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetMatSizeLookUpForGRN?collectionId=' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getAccessoryLookUp() {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetAccessoryLookUpForGRN', AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getCompanyLocationLookUp() {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetCompanyLocationLookUp', AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  createTrnGoodIssueNote(trnGoodIssueNote: TrnGoodIssueNote) {
    return this.http.post(AppSettings.API_ENDPOINT + 'TrnGoodIssueNote', trnGoodIssueNote, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  updateTrnGoodIssueNote(trnGoodIssueNote: TrnGoodIssueNote) {
    return this.http.put(AppSettings.API_ENDPOINT + 'TrnGoodIssueNote/' + trnGoodIssueNote.id, trnGoodIssueNote, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  deleteTrnGoodIssueNote(id: number) {
    return this.http.delete(AppSettings.API_ENDPOINT + 'TrnGoodIssueNote/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
}
