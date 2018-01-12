import { Injectable, ErrorHandler } from "@angular/core";
import { PermissionService } from '../theme/pages/default/_services/permission.service';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class StoreService {
  permissionsList: Observable<any[]>;
  constructor(private permissionService: PermissionService) {
    this.getPermission();
  }

  getPermission() {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    //if (currentUser)
      //this.permissionsList = this.permissionService.managePermission(currentUser.roles[0].id);
      
  }


}

