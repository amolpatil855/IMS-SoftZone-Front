import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response, URLSearchParams } from "@angular/http";

import { Collection } from "../_models/collection";
import { AppSettings } from '../../../../app-settings';

@Injectable()
export class CollectionService {
  constructor(private http: Http) {
  }

  perPage: any = 25;
  currentPos: any = 0;
  currentPageNumber: any = 1;

  getAllCollections(pageSize=0,page=0,search='') {
    return this.http.get(AppSettings.API_ENDPOINT + 'Collection?pageSize='+pageSize+'&page='+page+'&search='+search, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getCollectionById(id: number) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Collection/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getCollectionLookUp(id) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetCollectionLookUpByCategoryId?categoryId='+id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  createCollection(Collection: Collection) {
    return this.http.post(AppSettings.API_ENDPOINT + 'Collection', Collection, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  updateCollection(Collection: Collection) {
    return this.http.put(AppSettings.API_ENDPOINT + 'Collection/' + Collection.id, Collection, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  deleteCollection(id: number) {
    return this.http.delete(AppSettings.API_ENDPOINT + 'Collection/' + id, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
}
