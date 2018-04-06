import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash/index';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { ConfirmationService, DataTableModule, LazyLoadEvent, SelectItem } from 'primeng/primeng';
import { GlobalErrorHandler } from '../../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../../_services/message.service';
import { ItemsBelowReorderLevelService } from '../../../../_services/itemsBelowReorderLevel.service';
import { ScriptLoaderService } from '../../../../../../../_services/script-loader.service';
import { FormatService } from '../../../../_services/tableToXls/format.service';
import { CommonService } from '../../../../_services/common.service';
import { DataGridUtil } from '../../../../_services/tableToXls/datagrid.util';
import { Helpers } from "../../../../../../../helpers";
@Component({
  selector: "app-itemsBelowReorderLevel-list",
  templateUrl: "./itemsBelowReorderLevel-list.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class ItemsBelowReorderLevelListComponent implements OnInit {
  params: number;
  itemsBelowReorderLevel = [];
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
    private itemsBelowReorderLevelService: ItemsBelowReorderLevelService,
    private globalErrorHandler: GlobalErrorHandler,
    private confirmationService: ConfirmationService,
    private commonService: CommonService,
    private messageService: MessageService) {
  }

  ngOnInit() {
    this.getCategoryCodeList();
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  getCategoryCodeList() {
    this.commonService.getCategoryWithoutAccessory().subscribe(
      results => {
        this.categoriesCodeList = results;
      },
      error => {
        this.globalErrorHandler.handleError(error);
      });
  }


  getFabricProducts() {
    Helpers.setLoading(true);
    this.itemsBelowReorderLevelService.getFabricProducts(this.pageSize, this.page, this.search).subscribe(
      results => {
        this.itemsBelowReorderLevel = results.data;
        this.totalCount = results.totalCount;
        if (this.totalCount == 0) {
          this.tableEmptyMesssage = "No Records Found.";
        }
        Helpers.setLoading(false);
      },
      error => {
        this.tableEmptyMesssage = "No Records Found.";
        this.globalErrorHandler.handleError(error);
        Helpers.setLoading(false);
      });
  }

  getFoamProducts() {
    Helpers.setLoading(true);
    this.itemsBelowReorderLevelService.getFoamProducts(this.pageSize, this.page, this.search).subscribe(
      results => {
        this.itemsBelowReorderLevel = results.data;
        this.totalCount = results.totalCount;
        if (this.totalCount == 0) {
          this.tableEmptyMesssage = "No Records Found.";
        }
        Helpers.setLoading(false);
      },
      error => {
        this.tableEmptyMesssage = "No Records Found.";
        this.globalErrorHandler.handleError(error);
        Helpers.setLoading(false);
      });
  }

  getMattressProducts() {
    Helpers.setLoading(true);
    this.itemsBelowReorderLevelService.getMattressProducts(this.pageSize, this.page, this.search).subscribe(
      results => {
        this.itemsBelowReorderLevel = results.data;
        this.totalCount = results.totalCount;
        if (this.totalCount == 0) {
          this.tableEmptyMesssage = "No Records Found.";
        }
        Helpers.setLoading(false);
      },
      error => {
        this.tableEmptyMesssage = "No Records Found.";
        this.globalErrorHandler.handleError(error);
        Helpers.setLoading(false);
      });
  }

  getRugProducts() {
    Helpers.setLoading(true);
    this.itemsBelowReorderLevelService.getRugProducts(this.pageSize, this.page, this.search).subscribe(
      results => {
        this.itemsBelowReorderLevel = results.data;
        this.totalCount = results.totalCount;
        if (this.totalCount == 0) {
          this.tableEmptyMesssage = "No Records Found.";
        }
        Helpers.setLoading(false);
      },
      error => {
        this.tableEmptyMesssage = "No Records Found.";
        this.globalErrorHandler.handleError(error);
        Helpers.setLoading(false);
      });
  }

  getWallpaperProducts() {
    Helpers.setLoading(true);
    this.itemsBelowReorderLevelService.getWallpaperProducts(this.pageSize, this.page, this.search).subscribe(
      results => {
        this.itemsBelowReorderLevel = results.data;
        this.totalCount = results.totalCount;
        if (this.totalCount == 0) {
          this.tableEmptyMesssage = "No Records Found.";
        }
        Helpers.setLoading(false);
      },
      error => {
        this.tableEmptyMesssage = "No Records Found.";
        this.globalErrorHandler.handleError(error);
        Helpers.setLoading(false);
      });
  }


  loadLazy(event: LazyLoadEvent) {
    this.pageSize = event.rows;
    this.page = event.first / event.rows;
    this.search = event.globalFilter;
    if (this.categoryId == 1) {
      this.tableEmptyMesssage = 'Loading...';
      this.getFabricProducts();
    }
    else if (this.categoryId == 2) {
      this.tableEmptyMesssage = 'Loading...';
      this.getFoamProducts();
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
    this.search = '';
    if (this.categoryId == 1) {
      this.tableEmptyMesssage = 'Loading...';
      this.getFabricProducts();
    }
    else if (this.categoryId == 2) {
      this.tableEmptyMesssage = 'Loading...';
      this.getFoamProducts();
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

