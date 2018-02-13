import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash/index';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { ConfirmationService, DataTableModule, LazyLoadEvent } from 'primeng/primeng';
import { GlobalErrorHandler } from '../../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../../_services/message.service';
import { FinancialYearService } from '../../../../_services/financialYear.service';
import { Role } from "../../../../_models/role";
import { ScriptLoaderService } from '../../../../../../../_services/script-loader.service';
import { Helpers } from "../../../../../../../helpers";
import { FinancialYear } from "../../../../_models/financialYear";

@Component({
  selector: "app-financialYear-list",
  templateUrl: "./financialYear-list.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class FinancialYearListComponent implements OnInit {

  isFormSubmitted: boolean = false;
  financialYearForm: any;
  financialYearObj: any;
  params: number;
  financialYearList = [];
  pageSize = 50;
  page = 1;
  totalCount = 0;
  search = '';
  toggleDiv = false;
  states = [];
  tableEmptyMesssage = 'Loading...';
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private financialYearService: FinancialYearService,
    private globalErrorHandler: GlobalErrorHandler,
    private confirmationService: ConfirmationService,
    private messageService: MessageService) {
  }
  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      this.params = params['id'];
    });
    this.newRecord();
  }

  newRecord() {
    this.params = null;
    this.financialYearObj = {
      id: 0,
      startDate: '',
      endDate: '',
      financialYear: '',
      poNumber: '',
      soNumber: '',
      grnNumber: '',
      invoiceNumber: '',
    };
  }
  restrictDotMinus(e, limit) {
    if (e.target.value.length == limit) {
      return false;
    }
    var inputKeyCode = e.keyCode ? e.keyCode : e.which;
    if (inputKeyCode != null) {
      if (inputKeyCode == 43 || inputKeyCode == 45 || inputKeyCode == 46 || inputKeyCode == 101) e.preventDefault();
    }
  }
  toggleButton() {
    this.toggleDiv = !this.toggleDiv;
    if (this.toggleDiv && !this.params) {
      this.isFormSubmitted = false;
      this.newRecord();
    }

  }
  onCancel() {
    this.toggleDiv = false;
    this.newRecord();
  }
  getFinancialYearsList() {
    this.financialYearService.getAllFinancialYears(this.pageSize, this.page, this.search).subscribe(
      results => {
        this.financialYearList = results.data;
        console.log('this.financialYearList', this.financialYearList);
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
    this.page = event.first/event.rows;
    this.search = event.globalFilter;
    this.getFinancialYearsList();
  }

  getFinancialYearById(id) {
    this.financialYearService.getFinancialYearById(id).subscribe(
      results => {
        this.financialYearObj = results;
        console.log('this.financialYearList', this.financialYearObj);
      },
      error => {
        this.globalErrorHandler.handleError(error);
      });
  }

  onSubmit({ value, valid }: { value: any, valid: boolean }) {
    this.isFormSubmitted = true;
    if (!valid)
      return;
   this.saveFinancialYear(this.financialYearObj);
  }

  saveFinancialYear(value) {
    Helpers.setLoading(true);
    if (this.params) {
      this.financialYearService.updateFinancialYear(value)
        .subscribe(
        results => {
          this.getFinancialYearsList();
          this.toggleDiv = false;
          this.params = null;
          this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: results.message });
          Helpers.setLoading(false);

        },
        error => {
          this.globalErrorHandler.handleError(error);
          Helpers.setLoading(false);
        });
    } else {
      this.financialYearService.createFinancialYear(value)
        .subscribe(
        results => {
          this.getFinancialYearsList();
          this.toggleDiv = false;
          this.params = null;
          this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: results.message });
          Helpers.setLoading(false);

        },
        error => {
          this.globalErrorHandler.handleError(error);
          Helpers.setLoading(false);
        });
    }
  }

  onEditClick(financialYear: FinancialYear) {
    this.financialYearService.perPage = this.pageSize;
    this.financialYearService.currentPos = this.page;
    this.getFinancialYearById(financialYear.id);
    this.params = financialYear.id;
    this.toggleDiv = true;
    this.isFormSubmitted = false;
    window.scrollTo(0, 0);
  }
}