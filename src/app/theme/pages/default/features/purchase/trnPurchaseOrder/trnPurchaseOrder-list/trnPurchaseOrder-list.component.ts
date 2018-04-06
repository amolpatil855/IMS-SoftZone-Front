import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash/index';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { ConfirmationService, DataTableModule, LazyLoadEvent, SelectItem } from 'primeng/primeng';
import { GlobalErrorHandler } from '../../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../../_services/message.service';
import { TrnPurchaseOrderService } from '../../../../_services/trnPurchaseOrder.service';
import { UserService } from "../../../../_services/user.service";
import { ScriptLoaderService } from '../../../../../../../_services/script-loader.service';
import { Helpers } from "../../../../../../../helpers";
import { TrnPurchaseOrder } from "../../../../_models/trnPurchaseOrder";

@Component({
  selector: "app-trnPurchaseOrder-list",
  templateUrl: "./trnPurchaseOrder-list.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class TrnPurchaseOrderListComponent implements OnInit {
  trnPurchaseOrderForm: any;
  trnPurchaseOrderObj: TrnPurchaseOrder;
  params: number;
  userRole: string;
  adminFlag: boolean = false;
  status: boolean = false;
  trnPurchaseOrderList = [];
  pageSize = 50;
  page = 1;
  totalCount = 0;
  search = '';
  tableEmptyMesssage = 'Loading...';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private trnPurchaseOrderService: TrnPurchaseOrderService,
    private userService: UserService,
    private globalErrorHandler: GlobalErrorHandler,
    private confirmationService: ConfirmationService,
    private messageService: MessageService) {
  }

  ngOnInit() {
    this.getTrnPurchaseOrdersList();
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

  onApprove(purchaseOrderObj) {
    Helpers.setLoading(true);
    if (purchaseOrderObj.id) {
      this.trnPurchaseOrderService.approvePurchaseOrder(purchaseOrderObj)
        .subscribe(
        results => {
          this.getTrnPurchaseOrdersList();
          this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: results.message });
          Helpers.setLoading(false);
        },
        error => {
          this.globalErrorHandler.handleError(error);
          Helpers.setLoading(false);
        });
    }
  }
  getTrnPurchaseOrdersList() {
    this.trnPurchaseOrderService.getAllTrnPurchaseOrders(this.pageSize, this.page, this.search).subscribe(
      results => {
        this.trnPurchaseOrderList = results.data;
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
    //in a real application, make a remote request to load data using state metadata from event
    //event.first = First row offset
    //event.rows = Number of rows per page
    //event.sortField = Field name to sort with
    //event.sortOrder = Sort order as number, 1 for asc and -1 for dec
    //filters: FilterMetadata object having field as key and filter value, filter matchMode as value
    //imitate db connection over a network
    this.pageSize = event.rows;
    this.page = event.first / event.rows;
    this.search = event.globalFilter;
    this.getTrnPurchaseOrdersList();
  }

  onEditClick(trnPurchaseOrder: TrnPurchaseOrder) {
    this.router.navigate(['/features/purchase/trnPurchaseOrder/edit', trnPurchaseOrder.id]);
  }
  onDelete(trnPurchaseOrder: TrnPurchaseOrder) {

  }

  onAddClick() {
    this.router.navigate(['/features/purchase/trnPurchaseOrder/add']);
  }

}
