import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash/index';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { ConfirmationService, DataTableModule, LazyLoadEvent, SelectItem } from 'primeng/primeng';
import { GlobalErrorHandler } from '../../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../../_services/message.service';
import { TrnMaterialQuotationService } from '../../../../_services/trnMaterialQuotation.service';
import { UserService } from "../../../../_services/user.service";
import { ScriptLoaderService } from '../../../../../../../_services/script-loader.service';
import { Helpers } from "../../../../../../../helpers";
import { TrnMaterialQuotation } from "../../../../_models/trnMaterialQuotation";
@Component({
  selector: "app-trnMaterialQuotation-list",
  templateUrl: "./trnMaterialQuotation-list.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class TrnMaterialQuotationListComponent implements OnInit {
  trnMaterialQuotationForm: any;
  trnMaterialQuotationObj: any;
  params: number;
  userRole: string;
  adminFlag: boolean = false;
  status: boolean = false;
  trnMaterialQuotationList = [];
  pageSize = 50;
  page = 1;
  totalCount = 0;
  search = '';
  tableEmptyMesssage = 'Loading...';
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private trnMaterialQuotationService: TrnMaterialQuotationService,
    private userService: UserService,
    private globalErrorHandler: GlobalErrorHandler,
    private confirmationService: ConfirmationService,
    private messageService: MessageService) {
  }

  ngOnInit() {
    this.getLoggedInUserDetail();
  }

  getLoggedInUserDetail(){
    this.userService.getLoggedInUserDetail().subscribe(res => {
      this.userRole = res.mstRole.roleName;
      if (this.userRole == "Administrator") {
        this.adminFlag = true;
      }else{
        this.adminFlag = false;
      }
    });
  }

  onApprove(trnMaterialQuotationObj){
    Helpers.setLoading(true);
    if (trnMaterialQuotationObj.id) {
      this.trnMaterialQuotationService.approveSalesOrder(trnMaterialQuotationObj)
        .subscribe(
        results => {
          this.getTrnMaterialQuotationsList();
          this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: results.message });
          Helpers.setLoading(false);
        },
        error => {
          this.globalErrorHandler.handleError(error);
          Helpers.setLoading(false);
        });
    }
  }

  getTrnMaterialQuotationsList() {
    this.trnMaterialQuotationService.getAllTrnMaterialQuotations(this.pageSize, this.page, this.search).subscribe(
      results => {
        this.trnMaterialQuotationList = results.data;
        this.totalCount = results.totalCount;
        if (this.totalCount == 0) {
          this.tableEmptyMesssage = "No Records Found";
        }
      },
      error => {
        this.tableEmptyMesssage = "No Records Found";
        this.globalErrorHandler.handleError(error);
      });
  }

  loadLazy(event: LazyLoadEvent) {
    this.pageSize = event.rows;
    this.page = event.first/event.rows;
    this.search = event.globalFilter;
    this.getTrnMaterialQuotationsList();
  }

  onEditClick(trnMaterialQuotation: TrnMaterialQuotation) {
    this.router.navigate(['/features/sales/trnMaterialQuotation/edit', trnMaterialQuotation.id]);
  }

  onAddClick() {
    this.router.navigate(['/features/sales/trnMaterialQuotation/add']);
  }

}
