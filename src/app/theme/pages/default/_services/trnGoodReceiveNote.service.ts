import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response, URLSearchParams } from "@angular/http";

import { TrnGoodReceiveNote } from "../_models/trnGoodReceiveNote";
import { AppSettings } from '../../../../app-settings';

@Injectable()
export class TrnGoodReceiveNoteService {
  constructor(private http: Http) {
  }

  perPage: any = 25;
  currentPos: any = 0;
  currentPageNumber: any = 1;

  getAllTrnGoodReceiveNotes(pageSize = 0, page = 0, search = '') {
    return this.http.get(AppSettings.API_ENDPOINT + 'TrnGoodReceiveNote?pageSize=' + pageSize + '&page=' + page + '&search=' + search, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getPOListForSelectedItem(categoryId, collectionId, parameterId, matSizeCode, matQualityId, matThicknessId) {
    return this.http.get(AppSettings.API_ENDPOINT + 'TrnGoodReceiveNote/GetPOListForSelectedItem?categoryId=' + categoryId + '&collectionId=' + collectionId + '&parameterId=' + parameterId + '&matSizeCode=' + matSizeCode  + '&matQualityId=' + matQualityId + '&matThicknessId=' + matThicknessId, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getCustomMatSizeCodeLookup(categoryId, collectionId, matQualityId, matThicknessId) {
    return this.http.get(AppSettings.API_ENDPOINT + 'TrnGoodReceiveNote/GetCustomMatSizeCodeLookup?categoryId=' + categoryId + '&collectionId=' + collectionId + '&matQualityId=' + matQualityId + '&matThicknessId=' + matThicknessId, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getTrnGoodReceiveNoteById(id: number) {
    return this.http.get(AppSettings.API_ENDPOINT + 'TrnGoodReceiveNote/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
  
  getshadeIdTrnGoodReceiveNotes(id) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetSerialNumberLookUpForGRN?collectionId=' + id , AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getFoamSizeTrnGoodReceiveNotes(id) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetFomSizeLookUpForGRN?collectionId=' + id , AppSettings.requestOptions()).map((response: Response) => response.json());
  }
  
  getMatsizeTrnGoodReceiveNotes(id) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetMatSizeLookUpForGRN?collectionId=' + id , AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getAccessoryLookUp() {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetAccessoryLookUpForGRN', AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getCompanyLocationLookUp() {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetCompanyLocationLookUp', AppSettings.requestOptions()).map((response: Response) => response.json());
  }
  
  createTrnGoodReceiveNote(trnGoodReceiveNote: TrnGoodReceiveNote) {
    return this.http.post(AppSettings.API_ENDPOINT + 'TrnGoodReceiveNote', trnGoodReceiveNote, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  updateTrnGoodReceiveNote(trnGoodReceiveNote: TrnGoodReceiveNote) {
    return this.http.put(AppSettings.API_ENDPOINT + 'TrnGoodReceiveNote/' + trnGoodReceiveNote.id, trnGoodReceiveNote, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  deleteTrnGoodReceiveNote(id: number) {
    return this.http.delete(AppSettings.API_ENDPOINT + 'TrnGoodReceiveNote/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
}
