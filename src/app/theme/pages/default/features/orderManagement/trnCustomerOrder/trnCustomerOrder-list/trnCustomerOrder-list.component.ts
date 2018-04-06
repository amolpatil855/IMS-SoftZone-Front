import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash/index';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { ConfirmationService, DataTableModule, LazyLoadEvent, SelectItem } from 'primeng/primeng';
import { GlobalErrorHandler } from '../../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../../_services/message.service';
import { TrnSalesOrderService } from '../../../../_services/trnSalesOrder.service';
import { UserService } from "../../../../_services/user.service";
import { ScriptLoaderService } from '../../../../../../../_services/script-loader.service';
import { Helpers } from "../../../../../../../helpers";
import { TrnSaleOrder } from "../../../../_models/trnSaleOrder";
@Component({
  selector: "app-trnCustomerOrder-list",
  templateUrl: "./trnCustomerOrder-list.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class TrnCustomerOrderListComponent implements OnInit {
  trnSalesOrderForm: any;
  trnSalesOrderObj: any;
  params: number;
  userRole: string;
  adminFlag: boolean = false;
  status: boolean = false;
  trnSalesOrderList = [];
  pageSize = 50;
  page = 1;
  totalCount = 0;
  search = '';
  tableEmptyMesssage = 'Loading...';
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private trnSalesOrderService: TrnSalesOrderService,
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

  onApprove(saleOrderObj) {
    Helpers.setLoading(true);
    if (saleOrderObj.id) {
      this.trnSalesOrderService.approveSalesOrder(saleOrderObj)
        .subscribe(
        results => {
          this.getTrnSalesOrdersList();
          this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: results.message });
          Helpers.setLoading(false);
        },
        error => {
          this.globalErrorHandler.handleError(error);
          Helpers.setLoading(false);
        });
    }
  }

  getTrnSalesOrdersList() {
    this.trnSalesOrderService.getAllTrnSaleOrdersForCustomer(this.pageSize, this.page, this.search).subscribe(
      results => {
        this.trnSalesOrderList = results.data;
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
    this.getTrnSalesOrdersList();
  }

  onEditClick(trnSalesOrder: TrnSaleOrder) {
    this.router.navigate(['/features/orderManagement/trnCustomerOrder/edit', trnSalesOrder.id]);
  }

  onDelete(trnSalesOrder: TrnSaleOrder) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        this.trnSalesOrderService.deleteTrnSaleOrder(trnSalesOrder.id).subscribe(
          results => {
            this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: results.message });
            this.getTrnSalesOrdersList();
          },
          error => {
            this.globalErrorHandler.handleError(error);
          })
      },
      reject: () => {
      }
    });
  }

  onAddClick() {
    this.router.navigate(['/features/orderManagement/trnCustomerOrder/add']);
  }

}
