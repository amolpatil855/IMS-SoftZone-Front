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
  selector: "app-trnPurchaseOrder-add-edit",
  templateUrl: "./trnPurchaseOrder-add-edit.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class TrnPurchaseOrderAddEditComponent implements OnInit {
  trnPurchaseOrderForm: any;
  trnPurchaseOrderObj: any;
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
  }

  onCancel(){
       this.router.navigate(['/features/purchase/trnPurchaseOrder/list']);
  }
}
