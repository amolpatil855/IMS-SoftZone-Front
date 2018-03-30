import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash/index';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { ConfirmationService, DataTableModule, LazyLoadEvent, SelectItem } from 'primeng/primeng';
import { GlobalErrorHandler } from '../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../_services/message.service';
import { UserService } from "../../../_services/user.service";
import { ShadeService } from '../../../_services/shade.service';
import { FomSizeService } from '../../../_services/fomSize.service';
import { ScriptLoaderService } from '../../../../../../_services/script-loader.service';
import { CommonService } from '../../../_services/common.service';
import { Helpers } from "../../../../../../helpers";
import { CollectionService } from '../../../_services/collection.service';
import { TrnSalesOrderService } from "../../../_services/trnSalesOrder.service";
import { ProductListingService } from "../../../_services/productListing.service";

@Component({
  selector: "app-stockEnquiry-list",
  templateUrl: "./stockEnquiry-list.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class StockEnquiryListComponent implements OnInit {
  categoriesCodeList = [];
  accessoryCodeList = [];
  collectionList = [];
  shadeIdList = [];
  fomSizeList = [];
  trnSaleOrderItems = [];
  categoryId = null;
  collectionId = null;
  shadeId = null;
  matSizeId = null;
  fomSizeId = null;
  accessoryId = null;
  categoryIdError = false;
  collectionIdError = false;
  accessoryIdError = false;
  shadeIdError = false;
  fomSizeIdError = false;
  stock = null;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private trnSalesOrderService: TrnSalesOrderService,
    private shadeService: ShadeService,
    private fomSizeService: FomSizeService,
    private collectionService: CollectionService,
    private globalErrorHandler: GlobalErrorHandler,
    private confirmationService: ConfirmationService,
    private commonService: CommonService,
    private productListingService: ProductListingService,
    private messageService: MessageService) {
  }

  ngOnInit() {
    this.getCategoryCodeList();
  }

  getCategoryCodeList() {
    Helpers.setLoading(true);
    this.commonService.getCategoryCodesForSO().subscribe(
      results => {
        this.categoriesCodeList = results;
        this.categoriesCodeList.unshift({ label: '--Select--', value: null });
        Helpers.setLoading(false);
      },
      error => {
        this.globalErrorHandler.handleError(error);
        Helpers.setLoading(false);
      });
  }

  getCollectionList() {
    Helpers.setLoading(true);
    this.collectionService.getCollectionLookUpForSo(this.categoryId).subscribe(
      results => {
        this.collectionList = results;
        this.collectionList.unshift({ label: '--Select--', value: null });
        Helpers.setLoading(false);
      },
      error => {
        this.globalErrorHandler.handleError(error);
        Helpers.setLoading(false);
      });
  }

  getAccessoryLookup() {
    Helpers.setLoading(true);
    this.commonService.getAccessoryLookUp().subscribe(
      results => {
        this.accessoryCodeList = results;
        this.accessoryCodeList.unshift({ label: '--Select--', value: null });
        Helpers.setLoading(false);
      },
      error => {
        this.globalErrorHandler.handleError(error);
        Helpers.setLoading(false);
      });
  }

  getshadeIdList() {
    Helpers.setLoading(true);
    this.trnSalesOrderService.getSerialNumberLookUpByCollection(this.collectionId).subscribe(
      results => {
        this.shadeIdList = results;
        this.shadeIdList.unshift({ label: '--Select--', value: null });
        Helpers.setLoading(false);
      },
      error => {
        this.globalErrorHandler.handleError(error);
        Helpers.setLoading(false);
      });
  }

  getFoamSizeList() {
    Helpers.setLoading(true);
    this.trnSalesOrderService.getFomSizeLookUpByCollection(this.collectionId).subscribe(
      results => {
        this.fomSizeList = results;
        this.fomSizeList.unshift({ label: '--Select--', value: null });
        Helpers.setLoading(false);
      },
      error => {
        this.globalErrorHandler.handleError(error);
        Helpers.setLoading(false);
      });
  }

  onChangeCategory() {
    this.collectionList = [];
    this.collectionList.unshift({ label: '--Select--', value: null });
    this.shadeIdList = [];
    this.shadeIdList.unshift({ label: '--Select--', value: null });
    this.fomSizeList = [];
    this.fomSizeList.unshift({ label: '--Select--', value: null });
    this.accessoryCodeList = [];
    this.accessoryCodeList.unshift({ label: '--Select--', value: null });
    this.categoryIdError = false;
    this.fomSizeIdError = false;
    this.shadeIdError = false;
    this.accessoryIdError = false;
    this.collectionIdError = false;
    this.collectionId = null;
    this.accessoryId = null;
    this.shadeId = null;
    this.fomSizeId = null;
    this.matSizeId = null;
    this.stock = null;
    if (this.categoryId != null) {
      if (this.categoryId == 7) {
        this.getAccessoryLookup();
      } else {
        this.getCollectionList();
      }
    }
  }

  onChangeCollection() {
    if (this.categoryId == 1 || this.categoryId == 5 || this.categoryId == 6) {
      this.collectionIdError = false;
      this.shadeIdList = [];
      this.shadeIdList.unshift({ label: '--Select--', value: null });
      this.shadeIdError = false;
      this.shadeId = null;
      this.stock = null;
      if (this.collectionId != null) {
        this.getshadeIdList();
      }
    }
    else if (this.categoryId == 2) {
      this.collectionIdError = false;
      this.fomSizeList = [];
      this.fomSizeList.unshift({ label: '--Select--', value: null });
      this.fomSizeIdError = false;
      this.fomSizeId = null;
      this.stock = null;
      if (this.collectionId != null) {
        this.getFoamSizeList();
      }
    }
    else {
      this.shadeIdList = [];
      this.shadeIdList.unshift({ label: '--Select--', value: null });
      this.fomSizeList = [];
      this.fomSizeList.unshift({ label: '--Select--', value: null });
      this.categoryIdError = true;
      this.collectionIdError = false;
      this.shadeIdError = false;
      this.fomSizeIdError = false;
      this.shadeId = null;
      this.matSizeId = null;
      this.fomSizeId = null;
      this.stock = null;
    }
  }

  calculateProductStockDetails() {
    let parameterId = null;
    if (this.categoryId == 1) {
      this.shadeIdError = false;
      this.stock = null;
      if (this.shadeId != null) {
        parameterId = this.shadeId;
        Helpers.setLoading(true);
        this.productListingService.getProductStock(this.categoryId, this.collectionId, parameterId).subscribe(
          data => {
            this.stock = data;
            Helpers.setLoading(false);
          }, error => {
            this.globalErrorHandler.handleError(error);
            Helpers.setLoading(false);
          });
      }
    }
    else if (this.categoryId == 2) {
      this.fomSizeIdError = false;
      this.stock = null;
      if (this.fomSizeId != null) {
        parameterId = this.fomSizeId;
        Helpers.setLoading(true);
        this.productListingService.getProductStock(this.categoryId, this.collectionId, parameterId).subscribe(
          data => {
            this.stock = data;
            Helpers.setLoading(false);
          }, error => {
            this.globalErrorHandler.handleError(error);
            Helpers.setLoading(false);
          });
      }
    }
    else if (this.categoryId == 7) {
      this.accessoryIdError = false;
      this.stock = null;
      if (this.accessoryId != null) {
        parameterId = this.accessoryId;
        Helpers.setLoading(true);
        this.productListingService.getProductStock(this.categoryId, null, parameterId).subscribe(
          data => {
            this.stock = data;
            Helpers.setLoading(false);
          }, error => {
            this.globalErrorHandler.handleError(error);
            Helpers.setLoading(false);
          });
      }
    }
    else {
      parameterId = null;
    }
  }

}
