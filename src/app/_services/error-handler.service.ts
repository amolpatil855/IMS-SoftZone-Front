import { Injectable, ErrorHandler } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from 'rxjs/Rx';
import { MessageService } from '../_services/message.service';
import { StoreService } from '../_services/store.service';
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  constructor(private _router: Router, private messageService: MessageService, private storeService: StoreService) {
  }
  /**
    * Method For handling Error in Http request
    */
  handleError(response: Response | any) {
    let errMsg: string;
    let error = response._body ? JSON.parse(response._body) : response.json().error;
    if (error) {
      if (error.statusCode === 401) {
        errMsg = error.message;

        if (errMsg == "Invalid Access Token") {
          console.log("Auth Fail");
          localStorage.removeItem('currentUser');
          this._router.navigate(['/login']);
        }
        // this.storeService.getPermission();
        // this.storeService.permissionsList.subscribe((response) => {
        //   if (response) {

        //   }
        // }, error => {

        //   // this.globalErrorHandler.handleError(error);
        // });
        this.messageService.addMessage({ severity: 'error', summary: 'Failed', detail: errMsg });
      } else {
        errMsg = error.message;
        this.messageService.addMessage({ severity: 'error', summary: 'Failed', detail: errMsg });
      }
    } else {
      console.error(response);
      this.messageService.addMessage({ severity: 'error', summary: 'Failed', detail: response.json().Message });
    }
  }
}
