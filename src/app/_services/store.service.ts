import { Injectable, ErrorHandler } from "@angular/core";
import { MenuPermissionService } from '../theme/pages/default/_services/menuPermission.service';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class StoreService {
  permissionsList: Observable<any[]>;
  constructor(private permissionService: MenuPermissionService) {
    this.getPermission();
  }

  getPermission() {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser)
      this.permissionsList = this.permissionService.managePermission();
  }


}

