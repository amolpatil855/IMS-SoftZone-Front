import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash/index';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { ConfirmationService, DataTableModule, LazyLoadEvent, SelectItem } from 'primeng/primeng';
import { GlobalErrorHandler } from '../../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../../_services/message.service';
import { LabourJobService } from '../../../../_services/labourJob.service';
import { ScriptLoaderService } from '../../../../../../../_services/script-loader.service';
import { Helpers } from "../../../../../../../helpers";

@Component({
  selector: "app-labourJob-list",
  templateUrl: "./labourJob-list.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class LabourJobListComponent implements OnInit {
  params: number;
  labourJobList = [];
  paymentList = [];
  tailorList = [];
  pageSize = 50;
  page = 1;
  totalCount = 0;
  isPaid = 'No';
  tailorId = null;
  startDate = null;
  endDate = null;
  search = '';
  tableEmptyMesssage = 'Loading...';
  constructor(
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    private labourJobService: LabourJobService,
    private globalErrorHandler: GlobalErrorHandler,
    private confirmationService: ConfirmationService,
    private messageService: MessageService) {
  }

  ngOnInit() {
    this.paymentList.push({ label: 'Yes', value: 'Yes' });
    this.paymentList.push({ label: 'No', value: 'No' });
    this.tailorId = null;
    this.getTailorNameList();
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  getTailorNameList() {
    this.labourJobService.getTailorLookUp().subscribe(
      results => {
        this.tailorList = results;
        this.tailorList.unshift({ label: '--Select--', value: null });
      },
      error => {
        this.globalErrorHandler.handleError(error);
      });
  }

  getLabourJobList() {
    if(this.startDate && this.endDate){
      this.labourJobService.getAllLabourJobs(this.pageSize, this.page, this.search, this.isPaid, this.tailorId,new Date(this.startDate.setHours(23)).toLocaleDateString(), new Date(this.endDate.setHours(23)).toLocaleDateString()).subscribe(
      results => {
        this.labourJobList = results.data;
        this.totalCount = results.totalCount;
        if (this.totalCount == 0) {
          this.tableEmptyMesssage = "No Records Found";
        }
      },
      error => {
        this.tableEmptyMesssage = "No Records Found";
        this.globalErrorHandler.handleError(error);
      });
    }else{
      this.labourJobService.getAllLabourJobs(this.pageSize, this.page, this.search, this.isPaid, this.tailorId, null, null).subscribe(
      results => {
        this.labourJobList = results.data;
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
    
  }

  onChangePaymentStatus() {
    this.page = 0;
    this.search = '';
    this.getLabourJobList();
  }

  onTailorChange(){
    this.page = 0;
    this.search = '';
    this.getLabourJobList();
  }

  onChangeDate(){
    if(this.startDate && this.endDate){
        if (this.endDate < this.startDate) {
        this.endDate = null;
        return;
        }
        this.page = 0;
        this.search = '';
        this.getLabourJobList();
    }
    
  }

  loadLazy(event: LazyLoadEvent) {
    this.pageSize = event.rows;
    this.page = event.first / event.rows;
    this.search = event.globalFilter;
    this.getLabourJobList();
  }

  updatePaidLabourCharge(labourJob) {
    this.labourJobService.updatePaidLabourCharge(labourJob)
      .subscribe(
      results => {
        this.getLabourJobList();
        this.messageService.addMessage({ severity: 'success', summary: results.type, detail: results.message });
        Helpers.setLoading(false);
      },
      error => {
        this.globalErrorHandler.handleError(error);
        Helpers.setLoading(false);
      });
  }

}
