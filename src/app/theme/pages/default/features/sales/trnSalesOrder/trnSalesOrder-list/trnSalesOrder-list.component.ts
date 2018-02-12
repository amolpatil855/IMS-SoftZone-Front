import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash/index';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { ConfirmationService, DataTableModule, LazyLoadEvent, SelectItem } from 'primeng/primeng';
import { GlobalErrorHandler } from '../../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../../_services/message.service';
import { TrnSalesOrderService } from '../../../../_services/trnSalesOrder.service';
import { ScriptLoaderService } from '../../../../../../../_services/script-loader.service';
import { Helpers } from "../../../../../../../helpers";
import { TrnSaleOrder } from "../../../../_models/trnSaleOrder";
@Component({
  selector: "app-trnSalesOrder-list",
  templateUrl: "./trnSalesOrder-list.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class TrnSalesOrderListComponent implements OnInit {
  trnSalesOrderForm: any;
  trnSalesOrderObj: any;
  params: number;
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
    private globalErrorHandler: GlobalErrorHandler,
    private confirmationService: ConfirmationService,
    private messageService: MessageService) {
  }

  ngOnInit() {

  }

  getTrnSalesOrdersList(){
    this.trnSalesOrderList = [{
    id: 1,
    orderNumber: 101,
    customerId: 1,
    shippingAddress: 'Nashik',
    courierId: 1,
    courierMode: 'XYZ',
    referById: 1,
    orderDate: '2017/12/12',
    remark: 'Nice',
    status: 'Y',
    financialYear: '2017-18',
    mstAgent: {
    id: 1,
    name: "Agent Name",
    },
    mstCourier: {
    id: 1,
    name: "Courier Name",
    },
    mstCustomer: {
    id: 1,
    code: "sample string 2",
    name: "Customer Name",
    },
    }];
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
    this.page = event.first;
    this.search = event.globalFilter;
    this.getTrnSalesOrdersList();
  }

    onEditClick(trnSalesOrder: TrnSaleOrder) {
        this.router.navigate(['/features/sales/trnSalesOrder/edit', trnSalesOrder.id]);
    }
    onDelete(trnSalesOrder: TrnSaleOrder) {
        
    }

    onAddClick() {
        this.router.navigate(['/features/sales/trnSalesOrder/add']);
    }

}
