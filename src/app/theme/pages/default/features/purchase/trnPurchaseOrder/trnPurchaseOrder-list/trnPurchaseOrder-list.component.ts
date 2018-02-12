import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash/index';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { ConfirmationService, DataTableModule, LazyLoadEvent, SelectItem } from 'primeng/primeng';
import { GlobalErrorHandler } from '../../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../../_services/message.service';
import { TrnPurchaseOrderService } from '../../../../_services/trnPurchaseOrder.service';
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
    private globalErrorHandler: GlobalErrorHandler,
    private confirmationService: ConfirmationService,
    private messageService: MessageService) {
  }

  ngOnInit() {
    this.trnPurchaseOrderObj=new TrnPurchaseOrder();
  
  }

  getTrnPurchaseOrdersList(){
    this.trnPurchaseOrderList = [];
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
