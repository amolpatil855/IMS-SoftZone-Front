import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { UserService } from "../_services/user.service";
import { Observable } from "rxjs/Rx";
import { StoreService } from "../../_services/store.service";
import * as _ from 'lodash/index';
@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private _router: Router, private _userService: UserService, private storeService: StoreService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!this._userService.verify()) {
      this._router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }

    if (route.data['permissions']) {
      this.storeService.permissionsList.subscribe((response) => {
        if (response) {
          for (var i = 0; i < route.data['permissions'].length; i++) {
            var _permissionVal = route.data['permissions'][i];
            if (!_.find(response, function(respVal) { return respVal == _permissionVal })) {
              this._router.navigate(['/forbidden']);
              return false;
            }
          }
        } else {
          return false;
        }
      }, error => {
        this._router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      });
    }
    return true;
  }
}
