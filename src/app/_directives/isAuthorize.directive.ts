/* tslint:disable:member-ordering */
import { Directive, ElementRef, Renderer, Input } from '@angular/core';
import { StoreService } from "../_services/store.service";
import * as _ from 'lodash/index';
import { Router } from "@angular/router";
import { retry } from 'rxjs/operator/retry';
@Directive({
  selector: '[isAuthorize]'
})
export class IsAuthorizeDirective {

  @Input() isAuthorize: Array<string>;
  private _element: HTMLElement;

  constructor(_element: ElementRef, private storeService: StoreService, private _router: Router) {
    this._element = _element.nativeElement;
  }

  ngOnInit() {
    this.checkPermission();
  }

  checkPermission() {
    return true;
    //let userHasPermissions = false;
    // this.storeService.permissionsList.subscribe((response) => {
    //   if (response) {
    //     for (var i = 0; i < this.isAuthorize.length; i++) {
    //       if (!_.find(response, ['permissionName', this.isAuthorize[i]])) {
    //         userHasPermissions = false;
    //         //    break;
    //       } else {
    //         userHasPermissions = true;
    //         break;
    //       }
    //     }
    //     if (!userHasPermissions) {
    //       this._element.style.display = 'none';
    //     }
    //     else {
    //       this._element.style.display = 'block';
    //     }
    //   }
    // }, error => {
    //   console.log("Auth Fail");
    //   localStorage.removeItem('currentUser');
    //   this._router.navigate(['/login']);
    //   // this.globalErrorHandler.handleError(error);
    // });

  }
}
