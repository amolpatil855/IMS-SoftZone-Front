import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash/index';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { ConfirmationService, DataTableModule, LazyLoadEvent, SelectItem } from 'primeng/primeng';
import { GlobalErrorHandler } from '../../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../../_services/message.service';
import { TrnAdvancePaymentService } from '../../../../_services/trnAdvancePayment.service';
import { ScriptLoaderService } from '../../../../../../../_services/script-loader.service';
import { Helpers } from "../../../../../../../helpers";
import { TrnAdvancePayment } from "../../../../_models/trnAdvancePayment";

@Component({
  selector: "app-trnAdvancePayment-list",
  templateUrl: "./trnAdvancePayment-list.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class TrnAdvancePaymentListComponent implements OnInit {
  params: number;
  trnAdvancePaymentList = [];
  quotationTypeList = [];
  pageSize = 50;
  page = 1;
  totalCount = 0;
  search = '';
  quotationType = '';
  tableEmptyMesssage = 'Loading...';
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private trnAdvancePaymentService: TrnAdvancePaymentService,
    private globalErrorHandler: GlobalErrorHandler,
    private confirmationService: ConfirmationService,
    private messageService: MessageService) {
  }

  ngOnInit() {
    this.quotationTypeList.push({ label: 'All', value: '' });
    this.quotationTypeList.push({ label: 'Curtain', value: 'Curtain' });
    this.quotationTypeList.push({ label: 'Material', value: 'Material' });
  }

  getTrnAdvancePaymentsList() {
    this.trnAdvancePaymentService.getAllTrnAdvancePayments(this.pageSize, this.page, this.search, this.quotationType).subscribe(
      results => {
        this.trnAdvancePaymentList = results.data;
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

  onChangeQuotationType(){
    this.page = 0;
    this.getTrnAdvancePaymentsList();
  }

  loadLazy(event: LazyLoadEvent) {
    this.pageSize = event.rows;
    this.page = event.first / event.rows;
    this.search = event.globalFilter;
    this.getTrnAdvancePaymentsList();
  }

  onEditClick(trnAdvancePayment: TrnAdvancePayment) {
    this.router.navigate(['/features/sales/trnAdvancePayment/edit', trnAdvancePayment.id]);
  }

  onAddClick() {
    this.router.navigate(['/features/sales/trnAdvancePayment/add']);
  }
}
