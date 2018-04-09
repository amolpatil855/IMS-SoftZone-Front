import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash/index';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { ConfirmationService, DataTableModule, LazyLoadEvent, SelectItem } from 'primeng/primeng';
import { GlobalErrorHandler } from '../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../_services/message.service';
import { ProductListingService } from '../../../_services/productListing.service';
import { ScriptLoaderService } from '../../../../../../_services/script-loader.service';
import { CommonService } from '../../../_services/common.service';
import { Helpers } from "../../../../../../helpers";
import { ProductListing } from "../../../_models/productListing";
@Component({
  selector: "app-productListing-list",
  templateUrl: "./productListing-list.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class ProductListingListComponent implements OnInit {
  params: number;
  productListingList = [];
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
    private productListingService: ProductListingService,
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
    Helpers.setLoading(true);
    this.commonService.getCategoryCodesForSO().subscribe(
      results => {
        this.categoriesCodeList = results;
        Helpers.setLoading(false);
      },
      error => {
        this.globalErrorHandler.handleError(error);
        Helpers.setLoading(false);
      });
  }

  getAccessoryProducts() {
    Helpers.setLoading(true);
    this.productListingService.getAccessoryProducts(this.pageSize, this.page, this.search).subscribe(
      results => {
        this.productListingList = results.data;
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

  getFabricProducts() {
    Helpers.setLoading(true);
    this.productListingService.getFabricProducts(this.pageSize, this.page, this.search).subscribe(
      results => {
        this.productListingList = results.data;
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
    this.productListingService.getFoamProducts(this.pageSize, this.page, this.search).subscribe(
      results => {
        this.productListingList = results.data;
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
    else if (this.categoryId == 7) {
      this.tableEmptyMesssage = 'Loading...';
      this.getAccessoryProducts();
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
    else if (this.categoryId == 7) {
      this.tableEmptyMesssage = 'Loading...';
      this.getAccessoryProducts();
    }
  }

}

