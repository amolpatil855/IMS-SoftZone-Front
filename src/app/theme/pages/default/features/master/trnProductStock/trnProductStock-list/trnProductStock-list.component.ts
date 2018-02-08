import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash/index';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { ConfirmationService, DataTableModule, LazyLoadEvent, SelectItem } from 'primeng/primeng';
import { GlobalErrorHandler } from '../../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../../_services/message.service';
import { TrnProductStockService } from '../../../../_services/trnProductStock.service';
import { Role } from "../../../../_models/role";
import { ScriptLoaderService } from '../../../../../../../_services/script-loader.service';
import { Helpers } from "../../../../../../../helpers";
import { TrnProductStock } from "../../../../_models/trnProductStock";

@Component({
  selector: "app-trnProductStock-list",
  templateUrl: "./trnProductStock-list.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class TrnProductStockListComponent implements OnInit {

  trnProductStockForm: any;
  trnProductStockObj: any;
  params: number;
  trnProductStockList = [];
  categoryList: SelectItem[];
  selectedCategory = null;
  selectedCollection = null;
  selectedShade = null;
  selectedMatSize = null;
  selectedFomSize = null;
  selectedCompanyLocation = null;
  collectionList = [];
  companyLocationList = [];
  shadeList = [];
  matSizeList = [];
  fomSizeList = [];
  pageSize = 50;
  page = 1;
  totalCount = 0;
  search = '';
  toggleDiv = false;
  disabled: boolean = false;
  shadeEnable: boolean = false;
  matEnable: boolean = false;
  fomEnable: boolean = false;
  isFormSubmitted = false;
  tableEmptyMesssage = 'Loading...';
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private trnProductStockService: TrnProductStockService,
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
    this.trnProductStockObj = {
      id: 0,
      categoryId: null,
      collectionId: null,
      fwrShadeId: null,
      matSizeId: null,
      fomSizeId: null,
      locationId: null,
      stock: null,
    };
    this.selectedCategory = null;
    this.collectionList = [];
    this.collectionList.unshift({ label: '--Select--', value: null });
    this.shadeList = [];
    this.shadeList.unshift({ label: '--Select--', value: null });
    this.matSizeList = [];
    this.matSizeList.unshift({ label: '--Select--', value: null });
    this.fomSizeList = [];
    this.fomSizeList.unshift({ label: '--Select--', value: null });
    this.selectedCollection = null;
    this.selectedShade = null;
    this.selectedMatSize = null;
    this.selectedFomSize = null;
    this.selectedCompanyLocation = null;
    this.shadeEnable = false;
    this.matEnable = false;
    this.fomEnable = false;
  }

  toggleButton() {
    this.toggleDiv = !this.toggleDiv;
    if (this.toggleDiv && !this.params) {
      this.disabled = false;
      this.isFormSubmitted = false;
      this.newRecord();
    }

  }
  onCancel() {
    this.toggleDiv = false;
    this.disabled = false;
    this.newRecord();
  }
  getTrnProductStocksList() {
    this.trnProductStockService.getAllTrnProductStocks(this.pageSize, this.page, this.search).subscribe(
      results => {
        this.trnProductStockList = results.data;
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

  getCategoryLookUp() {
    this.trnProductStockService.getCategoryLookUp().subscribe(
      results => {
        this.categoryList = results;
        this.categoryList.unshift({ label: '--Select--', value: null });
      },
      error => {
        this.globalErrorHandler.handleError(error);
      });
  }

  getCompanyLocationLookUp() {
    this.trnProductStockService.getCompanyLocationLookUp().subscribe(
      results => {
        this.companyLocationList = results;
        this.companyLocationList.unshift({ label: '--Select--', value: null });
        console.log('this.companyLocationList', this.companyLocationList);
      },
      error => {
        this.globalErrorHandler.handleError(error);
      });
  }

  onCategoryClick() {
    this.collectionList = [];
    this.collectionList.unshift({ label: '--Select--', value: null });
    this.shadeList = [];
    this.shadeList.unshift({ label: '--Select--', value: null });
    this.matSizeList = [];
    this.matSizeList.unshift({ label: '--Select--', value: null });
    this.fomSizeList = [];
    this.fomSizeList.unshift({ label: '--Select--', value: null });
    this.selectedCollection = null;
    this.selectedShade = null;
    this.selectedMatSize = null;
    this.selectedFomSize = null;
    if (this.selectedCategory != null) {
      this.categoryList.forEach(item => {
        if (item.value == this.selectedCategory) {
          if (item.label === "Foam") {
            this.fomEnable = true;
            this.matEnable = false;
            this.shadeEnable = false;
          }
          if (item.label === "Mattress") {
            this.matEnable = true;
            this.fomEnable = false;
            this.shadeEnable = false;
          }
          if (item.label === "Fabric" || item.label === "Rug" || item.label === "Wallpaper") {
            this.shadeEnable = true;
            this.matEnable = false;
            this.fomEnable = false;
          }
        }
      });

      this.trnProductStockService.getCollectionLookUpByCategory(this.selectedCategory).subscribe(
        results => {
          this.collectionList = results;
          this.collectionList.unshift({ label: '--Select--', value: null });
          this.selectedCollection = this.trnProductStockObj.collectionId;
          if (this.selectedCollection > 0) {
            this.onCollectionClick();
          }
          console.log('this.collectionList', this.collectionList);
        },
        error => {
          this.globalErrorHandler.handleError(error);
        });
    }
  }

  onCollectionClick() {
    this.shadeList = [];
    this.shadeList.unshift({ label: '--Select--', value: null });
    this.matSizeList = [];
    this.matSizeList.unshift({ label: '--Select--', value: null });
    this.fomSizeList = [];
    this.fomSizeList.unshift({ label: '--Select--', value: null });
    this.selectedShade = null;
    this.selectedMatSize = null;
    this.selectedFomSize = null;
    if (this.selectedCollection != null) {
      this.trnProductStockService.getSerialNumberLookUpByCollection(this.selectedCollection).subscribe(
        results => {
          this.shadeList = results;
          this.shadeList.unshift({ label: '--Select--', value: null });
          this.selectedShade = this.trnProductStockObj.fwrShadeId;
          console.log('this.selectedShade', this.selectedShade);
          Helpers.setLoading(false);
        },
        error => {
          this.globalErrorHandler.handleError(error);
          Helpers.setLoading(false);
        });

      this.trnProductStockService.getMatSizeLookUpByCollection(this.selectedCollection).subscribe(
        results => {
          this.matSizeList = results;
          this.matSizeList.unshift({ label: '--Select--', value: null });
          this.selectedMatSize = this.trnProductStockObj.matSizeId;
          console.log('this.selectedMatSize', this.selectedMatSize);
          Helpers.setLoading(false);
        },
        error => {
          this.globalErrorHandler.handleError(error);
          Helpers.setLoading(false);
        });

      this.trnProductStockService.getFomSizeLookUpByCollection(this.selectedCollection).subscribe(
        results => {
          this.fomSizeList = results;
          this.fomSizeList.unshift({ label: '--Select--', value: null });
          this.selectedFomSize = this.trnProductStockObj.fomSizeId;
          console.log('this.selectedFomSize', this.selectedFomSize);
          Helpers.setLoading(false);
        },
        error => {
          this.globalErrorHandler.handleError(error);
          Helpers.setLoading(false);
        });
    }
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
    this.page = event.first;
    this.search = event.globalFilter;
    this.getTrnProductStocksList();
    this.getCategoryLookUp();
    this.getCompanyLocationLookUp();
  }

  getTrnProductStockById(id) {
    Helpers.setLoading(true);
    this.trnProductStockService.getTrnProductStockById(id).subscribe(
      results => {
        this.trnProductStockObj = results;
        console.log('this.trnProductStockObj', this.trnProductStockObj);
        this.selectedCategory = this.trnProductStockObj.categoryId;
        this.selectedCompanyLocation = this.trnProductStockObj.locationId;
        if (this.selectedCategory > 0) {
          this.onCategoryClick();
        }
      },
      error => {
        this.globalErrorHandler.handleError(error);
      });
  }


  onSubmit({ value, valid }: { value: any, valid: boolean }) {

    this.isFormSubmitted = true;
    if (!valid)
      return;
    if (this.trnProductStockObj.id > 0) {

    }
    else {
      this.trnProductStockObj.categoryId = value.category;
      this.trnProductStockObj.collectionId = value.collection;
      this.trnProductStockObj.fwrShadeId = value.shade;
      this.trnProductStockObj.matSizeId = value.matSize;
      this.trnProductStockObj.fomSizeId = value.fomSize;
      this.trnProductStockObj.locationId = value.location;
    }
    this.saveTrnProductStock(this.trnProductStockObj);
  }

  saveTrnProductStock(value) {
    Helpers.setLoading(true);
    if (this.params) {
      this.trnProductStockService.updateTrnProductStock(value)
        .subscribe(
        results => {
          this.getTrnProductStocksList();
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
      this.trnProductStockService.createTrnProductStock(value)
        .subscribe(
        results => {
          this.getTrnProductStocksList();
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

  onEditClick(trnProductStock: TrnProductStock) {
    this.trnProductStockService.perPage = this.pageSize;
    this.trnProductStockService.currentPos = this.page;
    this.getTrnProductStockById(trnProductStock.id);
    this.params = trnProductStock.id;
    this.toggleDiv = true;
    this.disabled = true;
    this.isFormSubmitted = false;
  }

}
