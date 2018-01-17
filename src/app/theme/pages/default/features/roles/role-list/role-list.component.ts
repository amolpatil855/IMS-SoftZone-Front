import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { ConfirmationService } from 'primeng/primeng';
import { GlobalErrorHandler } from '../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../_services/message.service';

import { RoleService } from '../../../_services/role.service';
import { Role } from "../../../_models/role";
import { ScriptLoaderService } from '../../../../../../_services/script-loader.service';
import { Helpers } from "../../../../../../helpers";
@Component({
  selector: "app-role-list",
  templateUrl: "./role-list.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class RoleListComponent implements OnInit {
  roleList= [];
  longList:boolean;
  total: number;         //Number Of records
  currentPos: number;    //Current Page
  perPage: number;       //Number of records to be displayed per page
  firstPageNumber: number;
  lastPage: number;
  currentPageNumber: number;
  constructor(private router: Router,
    private roleService: RoleService,
    private globalErrorHandler: GlobalErrorHandler,
    private confirmationService: ConfirmationService,
    private messageService: MessageService) {
  }

  ngOnInit() {

    //Page Size Array
      this.getRoleLIst();
  }

  onEditClick(role: Role) {
    this.roleService.perPage = this.perPage;
    this.roleService.currentPos = this.currentPos;
    this.roleService.currentPageNumber = this.currentPageNumber;
    this.router.navigate(['/features/roles/edit', role.id]);
  }
 getRoleLIst(){
   this.roleService.getAllRoles().subscribe(
    results => {
     this.roleList=results;
     if(this.roleList.length>0)
     {
      this.longList=true;
     }
    },
    error => {
      this.globalErrorHandler.handleError(error);
    });
 }

 onDelete(role: Role) {
  this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
          this.roleService.deleteRole(role.id).subscribe(
              results => {
                  this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Record Deleted Successfully' });
                  if ((this.currentPageNumber - 1) * this.perPage == (this.total - 1)) {
                      this.currentPageNumber--;
                  }
                this.getRoleLIst();
              },
              error => {
                  this.globalErrorHandler.handleError(error);
              })
      },
      reject: () => {
      }
  });
}

}
