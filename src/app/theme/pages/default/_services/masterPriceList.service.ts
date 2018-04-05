import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response, URLSearchParams } from "@angular/http";
import { AppSettings } from '../../../../app-settings';

@Injectable()
export class MasterPriceListService {
  constructor(private http: Http) {
  }

  perPage: any = 25;
  currentPos: any = 0;
  currentPageNumber: any = 1;

  getCategoryLookUp() {
    return this.http.get(AppSettings.API_ENDPOINT + 'Common/GetCategoryLookup', AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getAccessoryProducts(pageSize = 0, page = 0, search = '') {
    return this.http.get(AppSettings.API_ENDPOINT + 'Reports/GetAccessoryProductsForML?pageSize=' + pageSize + '&page=' + page + '&search=' + search, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getFabricProducts(pageSize = 0, page = 0, search = '', collectionId, qualityId, designId, shadeId) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Reports/GetFabricProductsForML?pageSize=' + pageSize + '&page=' + page + '&search=' + search + '&collectionId=' + collectionId + '&qualityId=' + qualityId + '&designId=' + designId + '&shadeId=' + shadeId, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getFoamProducts(pageSize = 0, page = 0, search = '', collectionId, qualityId, densityId, fomSuggestedMMId, fomSizeId) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Reports/GetFoamProductsForML?pageSize=' + pageSize + '&page=' + page + '&search=' + search + '&collectionId=' + collectionId + '&qualityId=' + qualityId + '&densityId=' + densityId + '&fomSuggestedMMId=' + fomSuggestedMMId + '&fomSizeId=' + fomSizeId, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getMattressProducts(pageSize = 0, page = 0, search = '', collectionId, qualityId, matThicknessId, matSizeId) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Reports/GetMattressProductsForML?pageSize=' + pageSize + '&page=' + page + '&search=' + search + '&collectionId=' + collectionId + '&qualityId=' + qualityId + '&matThicknessId=' + matThicknessId + '&matSizeId=' + matSizeId, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getRugProducts(pageSize = 0, page = 0, search = '', collectionId, qualityId, designId, shadeId) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Reports/GetRugProductsForML?pageSize=' + pageSize + '&page=' + page + '&search=' + search + '&collectionId=' + collectionId + '&qualityId=' + qualityId + '&designId=' + designId + '&shadeId=' + shadeId, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getWallpaperProducts(pageSize = 0, page = 0, search = '', collectionId, qualityId, designId, shadeId) {
    return this.http.get(AppSettings.API_ENDPOINT + 'Reports/GetWallpaperProductsForML?pageSize=' + pageSize + '&page=' + page + '&search=' + search + '&collectionId=' + collectionId + '&qualityId=' + qualityId + '&designId=' + designId + '&shadeId=' + shadeId, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getAccessoryProductsForExport() {
    return this.http.get(AppSettings.API_ENDPOINT + 'Reports/GetAccessoryProductsForMLExport', AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getFabricProductsForExport() {
    return this.http.get(AppSettings.API_ENDPOINT + 'Reports/GetFabricProductsForMLExport', AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getFoamProductsForExport() {
    return this.http.get(AppSettings.API_ENDPOINT + 'Reports/GetFoamProductsForMLExport', AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getMattressProductsForExport() {
    return this.http.get(AppSettings.API_ENDPOINT + 'Reports/GetMattressProductsForMLExport', AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getRugProductsForExport() {
    return this.http.get(AppSettings.API_ENDPOINT + 'Reports/GetRugProductsForMLExport', AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  getWallpaperProductsForExport() {
    return this.http.get(AppSettings.API_ENDPOINT + 'Reports/GetWallpaperProductsForMLExport', AppSettings.requestOptions()).map((response: Response) => response.json());
  }

}
