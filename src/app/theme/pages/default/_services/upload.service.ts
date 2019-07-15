import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response, URLSearchParams } from "@angular/http";

import { Upload } from "../_models/upload";
import { AppSettings } from '../../../../app-settings';

@Injectable()
export class UploadService {
  
  constructor(private http: Http) {
    
  }
  uploadFile(fileName: string, file:File) {
    const _formData = new FormData();
    _formData.append('file', file, fileName);   
    return this.http.post(AppSettings.API_ENDPOINT + 'UploadFWRShade?MstFWRShade=' + fileName,_formData).map((response: Response) => response.json());
  }
}
