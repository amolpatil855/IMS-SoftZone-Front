import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash/index';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { ConfirmationService, DataTableModule, LazyLoadEvent, SelectItem } from 'primeng/primeng';
import { GlobalErrorHandler } from '../../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../../_services/message.service';
import { TrnGINForItemsWithStockAvailableService } from '../../../../_services/trnGINForItemsWithStockAvailable.service';
import { ScriptLoaderService } from '../../../../../../../_services/script-loader.service';
import { Helpers } from "../../../../../../../helpers";

@Component({
  selector: "app-trnGINForItemsWithStockAvailable-list",
  templateUrl: "./trnGINForItemsWithStockAvailable-list.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class TrnGINForItemsWithStockAvailableListComponent implements OnInit {
  params: number;
  trnGINForItemsWithStockAvailableList = [];
  pageSize = 50;
  page = 1;
  totalCount = 0;
  search = '';
  tableEmptyMesssage = 'Loading...';
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private trnGINForItemsWithStockAvailableService: TrnGINForItemsWithStockAvailableService,
    private globalErrorHandler: GlobalErrorHandler,
    private confirmationService: ConfirmationService,
    private messageService: MessageService) {
  }

  ngOnInit() {
  }

  getGINsForItemsWithStockAvailable() {
    this.trnGINForItemsWithStockAvailableService.getGINsForItemsWithStockAvailable(this.pageSize, this.page, this.search).subscribe(
      results => {
        this.trnGINForItemsWithStockAvailableList = results.data;
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
    this.page = event.first/event.rows;
    this.search = event.globalFilter;
    this.getGINsForItemsWithStockAvailable();
  }
}
