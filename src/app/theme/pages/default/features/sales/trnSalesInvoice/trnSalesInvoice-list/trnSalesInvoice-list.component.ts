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
import { TrnSalesInvoice } from "../../../../_models/trnSalesInvoice";

@Component({
  selector: "app-trnSalesInvoice-list",
  templateUrl: "./trnSalesInvoice-list.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class TrnSalesInvoiceListComponent implements OnInit {
  params: number;
  trnSalesInvoiceList = [];
  pageSize = 50;
  page = 1;
  totalCount = 0;
  search = '';
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
  }

  getTrnSalesInvoiceList() {
    this.trnSalesInvoiceService.getAllTrnSalesInvoices(this.pageSize, this.page, this.search).subscribe(
      results => {
        this.trnSalesInvoiceList = results.data;
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
    this.getTrnSalesInvoiceList();
  }

  onEditClick(trnSalesInvoice: TrnSalesInvoice) {
    this.router.navigate(['/features/sales/trnSalesInvoice/edit', trnSalesInvoice.id]);
  }

  onAddClick() {
    this.router.navigate(['/features/sales/trnSalesInvoice/add']);
  }
}
