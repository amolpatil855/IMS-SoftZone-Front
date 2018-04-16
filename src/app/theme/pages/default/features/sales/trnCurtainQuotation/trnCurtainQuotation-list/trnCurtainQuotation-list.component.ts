import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash/index';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { ConfirmationService, DataTableModule, LazyLoadEvent, SelectItem } from 'primeng/primeng';
import { GlobalErrorHandler } from '../../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../../_services/message.service';
import { TrnCurtainQuotationService } from '../../../../_services/trnCurtainQuotation.service';
import { UserService } from "../../../../_services/user.service";
import { ScriptLoaderService } from '../../../../../../../_services/script-loader.service';
import { Helpers } from "../../../../../../../helpers";
import { TrnCurtainQuotation } from "../../../../_models/trnCurtainQuotation";

@Component({
  selector: "app-trnCurtainQuotation-list",
  templateUrl: "./trnCurtainQuotation-list.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class TrnCurtainQuotationListComponent implements OnInit {
  trnCurtainQuotationForm: any;
  trnCurtainQuotationObj: any;
  params: number;
  userRole: string;
  adminFlag: boolean = false;
  status: boolean = false;
  trnCurtainQuotationList = [];
  pageSize = 50;
  page = 1;
  totalCount = 0;
  search = '';
  tableEmptyMesssage = 'Loading...';
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private trnCurtainQuotationService: TrnCurtainQuotationService,
    private userService: UserService,
    private globalErrorHandler: GlobalErrorHandler,
    private confirmationService: ConfirmationService,
    private messageService: MessageService) {
  }

  ngOnInit() {
    this.getLoggedInUserDetail();
  }

  getLoggedInUserDetail() {
    this.userService.getLoggedInUserDetail().subscribe(res => {
      this.userRole = res.mstRole.roleName;
      if (this.userRole == "Administrator") {
        this.adminFlag = true;
      } else {
        this.adminFlag = false;
      }
    });
  }

  getTrnCurtainQuotationsList() {
    this.trnCurtainQuotationService.getAllTrnCurtainQuotations(this.pageSize, this.page, this.search).subscribe(
      results => {
        this.trnCurtainQuotationList = results.data;
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
    this.page = event.first / event.rows;
    this.search = event.globalFilter;
    this.getTrnCurtainQuotationsList();
  }

  onEditClick(trnCurtainQuotation: TrnCurtainQuotation) {
    this.router.navigate(['/features/sales/trnCurtainQuotation/edit', trnCurtainQuotation.id]);
  }

  onAddClick() {
    this.router.navigate(['/features/sales/trnCurtainQuotation/add']);
  }

}
