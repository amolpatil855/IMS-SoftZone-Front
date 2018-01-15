import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response } from "@angular/http";

import { Categories } from "../_models/index";
import { AppSettings } from '../../../../app-settings';

@Injectable()
export class ImageUploadService {
  constructor(private http: Http) {
  }

  createFolder(data) {
    return this.http.post(AppSettings.API_ENDPOINT + 'containers', data, AppSettings.requestOptions()).map((response: Response) => response.json());
  }
  uploadImage(id, image) {
    let reqObj = AppSettings.requestOptions();
    reqObj.headers["_headers"].delete("content-type");
    return this.http.post(AppSettings.API_ENDPOINT + 'containers/' + id + '/upload', image, reqObj).map((response: Response) => response.json());
  }

  getImageUrl(value) {
    let reqObj = AppSettings.requestOptions();
    reqObj.headers["_headers"].delete("content-type");
    if (value == "default") {
      return AppSettings.API_ENDPOINT + "containers/default/download/logo.png";
    } else {
      return AppSettings.LOGIN_API_ENDPOINT.substring(0, AppSettings.LOGIN_API_ENDPOINT.length - 1) + localStorage.getItem("IMSLogo");
    }
  }

}
