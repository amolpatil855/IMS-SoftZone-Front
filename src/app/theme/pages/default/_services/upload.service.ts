import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response, URLSearchParams } from "@angular/http";

import { Upload } from "../_models/upload";
import { AppSettings } from '../../../../app-settings';

@Injectable()
export class UploadService {

  constructor(private http: Http) {

  }

  uploadFile(fileName: string, file: File) {
    const _formData = new FormData();
    _formData.append('file', file);
    return this.http.post(AppSettings.API_ENDPOINT + 'UploadFile?TableName=' + fileName, _formData, AppSettings.requestOptions()).map((response: Response) => response.json());
  }

  downloadFile(filepath: string) {
    window.location.href = AppSettings.API_ENDPOINT + 'UploadFile?filepath=' + filepath;
  }
}
