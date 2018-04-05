import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash/index';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { ConfirmationService, DataTableModule, LazyLoadEvent, SelectItem } from 'primeng/primeng';
import { GlobalErrorHandler } from '../../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../../_services/message.service';
import { DashboardService } from '../../../../_services/dashboard.service';
import { ScriptLoaderService } from '../../../../../../../_services/script-loader.service';
import { Helpers } from "../../../../../../../helpers";

@Component({
  selector: "app-soOrderStatusReport-list",
  templateUrl: "./soOrderStatusReport-list.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class SoOrderStatusReportListComponent implements OnInit {
  params: number;
  soOrderStatusReportList = [];
  paymentList = [];
  statusList = [];
  pageSize = 50;
  page = 1;
  totalCount = 0;
  status = '';
  tableEmptyMesssage = 'Loading...';
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private dashboardService: DashboardService,
    private globalErrorHandler: GlobalErrorHandler,
    private confirmationService: ConfirmationService,
    private messageService: MessageService) {
  }

  ngOnInit() {
    this.statusList.push({ label: 'All', value: '' });
    this.statusList.push({ label: 'Created', value: 'Created' });
    this.statusList.push({ label: 'Approved', value: 'Approved' });
    this.statusList.push({ label: 'Completed', value: 'Completed' });
    this.statusList.push({ label: 'Cancelled', value: 'Cancelled' });
  }

  getSOorderStatusReport() {
    this.dashboardService.getSOorderStatusReport(this.pageSize, this.page, this.status).subscribe(
      results => {
        this.soOrderStatusReportList = results.data;
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

  onChangeStatus(){
    this.page = 0;
    this.getSOorderStatusReport();
  }

  loadLazy(event: LazyLoadEvent) {
    this.pageSize = event.rows;
    this.page = event.first/event.rows;
    this.getSOorderStatusReport();
  }

}
