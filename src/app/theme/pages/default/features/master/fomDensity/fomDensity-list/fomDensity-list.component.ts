import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash/index';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { ConfirmationService, DataTableModule, LazyLoadEvent, SelectItem } from 'primeng/primeng';
import { GlobalErrorHandler } from '../../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../../_services/message.service';
import { FomDensityService } from '../../../../_services/fomDensity.service';
import { ScriptLoaderService } from '../../../../../../../_services/script-loader.service';
import { Helpers } from "../../../../../../../helpers";
import { FomDensity } from "../../../../_models/fomDensity";
import { CommonService } from '../../../../_services/common.service';

@Component({
  selector: ".app-fomDensity-list",
  templateUrl: "./fomDensity-list.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class FomDensityListComponent implements OnInit {
  isFormSubmitted = false;
  fomDensityForm: any;
  fomDensityObj: any;
  params: number;
  fomDensityList = [];
  categoryList: SelectItem[];
  selectedCollection = null;
  selectedQuality = null;
  slectedCategory = null;
  selectedThickness = 0;
  collectionList = [];
  qualityList = [];
  thicknessList = [];
  pageSize = 50;
  page = 1;
  totalCount = 0;
  search = '';
  toggleDiv = false;
  disabled: boolean = false;
  categoriesCodeList = [];
  tableEmptyMesssage = 'Loading...';
  mask = [/[1-9]/, /\d/, '.', /\d/, /\d/];
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private fomDensityService: FomDensityService,
    private globalErrorHandler: GlobalErrorHandler,
    private confirmationService: ConfirmationService,
    private commonService: CommonService,
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
    this.fomDensityObj = {
      id: 0,
      categoryId: 0,
      collectionId: 0,
      qualityId: 0,
      thicknessId: 0,
      sizeCode: '',
      rate: '',
    };
    this.selectedCollection = null;
    this.selectedQuality = null;
    this.selectedThickness = 0;
  }

  calculateSellingRate() {
    
        this.fomDensityObj.sellingRatePercentage = isNaN( parseFloat(this.fomDensityObj.sellingRatePercentage))  ? '' : parseFloat(this.fomDensityObj.sellingRatePercentage).toFixed(2);
        if (parseFloat(this.fomDensityObj.purchaseRatePerMM) > 0 && parseFloat(this.fomDensityObj.sellingRatePercentage) > 0) {
          this.fomDensityObj.purchaseRatePerMM = parseFloat(this.fomDensityObj.purchaseRatePerMM).toFixed(2);
          this.fomDensityObj.sellingRatePerMM = parseFloat(this.fomDensityObj.purchaseRatePerMM) + ( parseFloat(this.fomDensityObj.purchaseRatePerMM) * parseFloat(this.fomDensityObj.sellingRatePercentage) / 100);
          this.fomDensityObj.sellingRatePerMM =parseFloat(this.fomDensityObj.sellingRatePerMM).toFixed(2);
        }
        // else{
        //   this.fomDensityObj.sellingRatePerMM=this.fomDensityObj.purchaseRatePerMM;
        // }
        if (parseFloat(this.fomDensityObj.purchaseRatePerKG) > 0 && parseFloat(this.fomDensityObj.sellingRatePercentage) > 0) {
          this.fomDensityObj.purchaseRatePerKG = parseFloat(this.fomDensityObj.purchaseRatePerKG).toFixed(2);
          this.fomDensityObj.sellingRatePerKG = parseFloat(this.fomDensityObj.purchaseRatePerKG) + (parseFloat(this.fomDensityObj.purchaseRatePerKG) * parseFloat(this.fomDensityObj.sellingRatePercentage) / 100);
          this.fomDensityObj.sellingRatePerKG =parseFloat(this.fomDensityObj.sellingRatePerKG).toFixed(2);
        }
        // else{
        //   this.fomDensityObj.sellingRatePerKG=this.fomDensityObj.purchaseRatePerKG;
        // }
    
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
  getFomDensitysList() {
    this.fomDensityService.getAllFomDensitys(this.pageSize, this.page, this.search).subscribe(
      results => {
        this.fomDensityList = results.data;
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

  getFomCollectionLookUp() {
    this.fomDensityService.getFomCollectionLookUp().subscribe(
      results => {
        this.collectionList = results;
        this.collectionList.unshift({ label: '--Select--', value: null });
        console.log('this.collectionList', this.collectionList);
      },
      error => {
        this.globalErrorHandler.handleError(error);
      });
  }

  onCollectionClick() {
    this.fomDensityService.getQualityLookUpByCollection(this.selectedCollection).subscribe(
      results => {
        this.qualityList = results;
        this.qualityList.unshift({ label: '--Select--', value: null });
        this.selectedQuality = this.fomDensityObj.qualityId;
        console.log('this.qualityList', this.qualityList);
      },
      error => {
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
    this.page = event.first;
    this.search = event.globalFilter;
    this.getFomDensitysList();
    this.getFomCollectionLookUp();
  }

  getFomDensityById(id) {
    this.fomDensityService.getFomDensityById(id).subscribe(
      results => {
        this.fomDensityObj = results;
        console.log('this.fomDensityObj', this.fomDensityObj);
        this.selectedCollection = this.fomDensityObj.collectionId;
        if (this.selectedCollection > 0) {
          this.onCollectionClick();
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
    if (this.fomDensityObj.id > 0) {

    } else {
      this.fomDensityObj.categoryId = value.category;
      this.fomDensityObj.collectionId = value.collection;
      this.fomDensityObj.qualityId = value.quality;
      this.fomDensityObj.thicknessId = value.thickness;
    }

    this.saveFomDensity(this.fomDensityObj);
  }

  saveFomDensity(value) {
    Helpers.setLoading(true);
    if (this.params) {
      this.fomDensityService.updateFomDensity(value)
        .subscribe(
        results => {
          this.getFomDensitysList();
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
      this.fomDensityService.createFomDensity(value)
        .subscribe(
        results => {
          this.getFomDensitysList();
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

  onEditClick(fomDensity: FomDensity) {
    this.fomDensityService.perPage = this.pageSize;
    this.fomDensityService.currentPos = this.page;
    this.getFomDensityById(fomDensity.id);
    this.params = fomDensity.id;
    this.toggleDiv = true;
    this.disabled = true;
    this.isFormSubmitted = false;
  }

  onDelete(fomDensity: FomDensity) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        this.fomDensityService.deleteFomDensity(fomDensity.id).subscribe(
          results => {
            this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: results.message });
            this.getFomDensitysList();
            this.toggleDiv = false;
          },
          error => {
            this.globalErrorHandler.handleError(error);
          })
      },
      reject: () => {
      }
    });
  }
}
