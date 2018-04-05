import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash/index';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { ConfirmationService, DataTableModule, LazyLoadEvent, SelectItem } from 'primeng/primeng';
import { GlobalErrorHandler } from '../../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../../_services/message.service';
import { TrnSalesInvoiceService } from '../../../../_services/trnSalesInvoice.service';
import { ScriptLoaderService } from '../../../../../../../_services/script-loader.service';
import { Helpers } from "../../../../../../../helpers";

@Component({
  selector: "app-salesInvoicePaymentStatusReport-list",
  templateUrl: "./salesInvoicePaymentStatusReport-list.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class SalesInvoicePaymentStatusReportListComponent implements OnInit {
  params: number;
  salesInvoicePaymentStatusReportList = [];
  paymentList = [];
  statusList = [];
  pageSize = 50;
  page = 1;
  totalCount = 0;
  status = '';
  isPaid = '';
  tableEmptyMesssage = 'Loading...';
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private trnSalesInvoiceService: TrnSalesInvoiceService,
    private globalErrorHandler: GlobalErrorHandler,
    private confirmationService: ConfirmationService,
    private messageService: MessageService) {
  }

  ngOnInit() {
    this.paymentList.push({ label: 'All', value: '' });
    this.paymentList.push({ label: 'Yes', value: 'Yes' });
    this.paymentList.push({ label: 'No', value: 'No' });
    this.statusList.push({ label: 'All', value: '' });
    this.statusList.push({ label: 'Created', value: 'Created' });
    this.statusList.push({ label: 'Approved', value: 'Approved' });
  }

  getTotalOutstandingAmountList() {
    this.trnSalesInvoiceService.getSalesInvoicePaymentStatusReport(this.pageSize, this.page, this.status, this.isPaid).subscribe(
      results => {
        this.salesInvoicePaymentStatusReportList = results.data;
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

  onChangePaymentStatus(){
    this.page = 0;
    this.getTotalOutstandingAmountList();
  }

  loadLazy(event: LazyLoadEvent) {
    this.pageSize = event.rows;
    this.page = event.first/event.rows;
        this.getTotalOutstandingAmountList();
  }

}
