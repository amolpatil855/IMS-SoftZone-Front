import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash/index';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { ConfirmationService, DataTableModule, LazyLoadEvent, SelectItem } from 'primeng/primeng';
import { GlobalErrorHandler } from '../../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../../_services/message.service';
import { TrnWorkOrderService } from '../../../../_services/trnWorkOrder.service';
import { UserService } from "../../../../_services/user.service";
import { ScriptLoaderService } from '../../../../../../../_services/script-loader.service';
import { Helpers } from "../../../../../../../helpers";
import { TrnWorkOrder } from "../../../../_models/trnWorkOrder";
@Component({
  selector: "app-trnWorkOrder-list",
  templateUrl: "./trnWorkOrder-list.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class TrnWorkOrderListComponent implements OnInit {
trnWorkOrderForm: any;
  trnWorkOrderObj: any;
  params: number;
  userRole: string;
  adminFlag: boolean = false;
  status: boolean = false;
  trnWorkOrderList = [];
  pageSize = 50;
  page = 1;
  totalCount = 0;
  search = '';
  tableEmptyMesssage = 'Loading...';
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private trnWorkOrderService: TrnWorkOrderService,
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

  getTrnWorkOrdersList() {
    this.trnWorkOrderService.getAllTrnWorkOrders(this.pageSize, this.page, this.search).subscribe(
      results => {
        this.trnWorkOrderList = results.data;
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
    this.getTrnWorkOrdersList();
  }

  onEditClick(trnWorkOrder: TrnWorkOrder) {
    this.router.navigate(['/features/sales/trnWorkOrder/edit', trnWorkOrder.id]);
  }

}

