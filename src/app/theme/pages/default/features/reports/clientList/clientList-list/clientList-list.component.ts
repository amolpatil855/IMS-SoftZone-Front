import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash/index';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { ConfirmationService, DataTableModule, LazyLoadEvent, SelectItem } from 'primeng/primeng';
import { GlobalErrorHandler } from '../../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../../_services/message.service';
import { ClientListService } from '../../../../_services/clientList.service';
import { ScriptLoaderService } from '../../../../../../../_services/script-loader.service';
import { CommonService } from '../../../../_services/common.service';
import { Helpers } from "../../../../../../../helpers";
@Component({
  selector: "app-clientList-list",
  templateUrl: "./clientList-list.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class ClientListListComponent implements OnInit {
  params: number;
  clientList = [];
  categoriesCodeList = [];
  categoryId = 1;
  categoryIdError = false;
  pageSize = 50;
  page = 1;
  totalCount = 0;
  search = '';
  tableEmptyMesssage = 'No Records Found.';
  constructor(
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private clientListService: ClientListService,
    private globalErrorHandler: GlobalErrorHandler,
    private confirmationService: ConfirmationService,
    private commonService: CommonService,
    private messageService: MessageService) {
  }

  ngOnInit() {
    this.getCategoryLookUp();
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  getCategoryLookUp() {
    this.clientListService.getCategoryLookUp().subscribe(
      results => {
        this.categoriesCodeList = results;
      },
      error => {
        this.globalErrorHandler.handleError(error);
      });
  }

  getAccessoryProducts() {
    this.clientListService.getAccessoryProducts(this.pageSize, this.page).subscribe(
      results => {
        this.clientList = results.data;
        this.totalCount = results.totalCount;
        if (this.totalCount == 0) {
          this.tableEmptyMesssage = "No Records Found.";
        }
      },
      error => {
        this.tableEmptyMesssage = "No Records Found.";
        this.globalErrorHandler.handleError(error);
      });
  }

  getFabricProducts() {
    this.clientListService.getFabricProducts(this.pageSize, this.page).subscribe(
      results => {
        this.clientList = results.data;
        this.totalCount = results.totalCount;
        if (this.totalCount == 0) {
          this.tableEmptyMesssage = "No Records Found.";
        }
      },
      error => {
        this.tableEmptyMesssage = "No Records Found.";
        this.globalErrorHandler.handleError(error);
      });
  }

  getFoamProducts() {
    this.clientListService.getFoamProducts(this.pageSize, this.page).subscribe(
      results => {
        this.clientList = results.data;
        this.totalCount = results.totalCount;
        if (this.totalCount == 0) {
          this.tableEmptyMesssage = "No Records Found.";
        }
      },
      error => {
        this.tableEmptyMesssage = "No Records Found.";
        this.globalErrorHandler.handleError(error);
      });
  }

  getMattressProducts() {
    this.clientListService.getMattressProducts(this.pageSize, this.page).subscribe(
      results => {
        this.clientList = results.data;
        this.totalCount = results.totalCount;
        if (this.totalCount == 0) {
          this.tableEmptyMesssage = "No Records Found.";
        }
      },
      error => {
        this.tableEmptyMesssage = "No Records Found.";
        this.globalErrorHandler.handleError(error);
      });
  }

  getRugProducts() {
    this.clientListService.getRugProducts(this.pageSize, this.page).subscribe(
      results => {
        this.clientList = results.data;
        this.totalCount = results.totalCount;
        if (this.totalCount == 0) {
          this.tableEmptyMesssage = "No Records Found.";
        }
      },
      error => {
        this.tableEmptyMesssage = "No Records Found.";
        this.globalErrorHandler.handleError(error);
      });
  }

  getWallpaperProducts() {
    this.clientListService.getWallpaperProducts(this.pageSize, this.page).subscribe(
      results => {
        this.clientList = results.data;
        this.totalCount = results.totalCount;
        if (this.totalCount == 0) {
          this.tableEmptyMesssage = "No Records Found.";
        }
      },
      error => {
        this.tableEmptyMesssage = "No Records Found.";
        this.globalErrorHandler.handleError(error);
      });
  }

  loadLazy(event: LazyLoadEvent) {
    this.pageSize = event.rows;
    this.page = event.first / event.rows;
    if (this.categoryId == 1) {
      this.tableEmptyMesssage = 'Loading...';
      this.getFabricProducts();
    }
    else if (this.categoryId == 2) {
      this.tableEmptyMesssage = 'Loading...';
      this.getFoamProducts();
    }
    else if (this.categoryId == 7) {
      this.tableEmptyMesssage = 'Loading...';
      this.getAccessoryProducts();
    }
    else if (this.categoryId == 4) {
      this.tableEmptyMesssage = 'Loading...';
      this.getMattressProducts();
    }
    else if (this.categoryId == 5) {
      this.tableEmptyMesssage = 'Loading...';
      this.getWallpaperProducts();
    }
    else if (this.categoryId == 6) {
      this.tableEmptyMesssage = 'Loading...';
      this.getRugProducts();
    }
  }

  onChangeCategory() {
    this.page = 0;
    if (this.categoryId == 1) {
      this.tableEmptyMesssage = 'Loading...';
      this.getFabricProducts();
    }
    else if (this.categoryId == 2) {
      this.tableEmptyMesssage = 'Loading...';
      this.getFoamProducts();
    }
    else if (this.categoryId == 7) {
      this.tableEmptyMesssage = 'Loading...';
      this.getAccessoryProducts();
    }
    else if (this.categoryId == 4) {
      this.tableEmptyMesssage = 'Loading...';
      this.getMattressProducts();
    }
    else if (this.categoryId == 5) {
      this.tableEmptyMesssage = 'Loading...';
      this.getWallpaperProducts();
    }
    else if (this.categoryId == 6) {
      this.tableEmptyMesssage = 'Loading...';
      this.getRugProducts();
    }
  }

}

