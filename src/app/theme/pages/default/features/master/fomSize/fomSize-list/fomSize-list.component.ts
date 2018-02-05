import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash/index';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { ConfirmationService, DataTableModule, LazyLoadEvent, SelectItem } from 'primeng/primeng';
import { GlobalErrorHandler } from '../../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../../_services/message.service';
import { FomSizeService } from '../../../../_services/fomSize.service';
import { ScriptLoaderService } from '../../../../../../../_services/script-loader.service';
import { Helpers } from "../../../../../../../helpers";
import { FomSize } from "../../../../_models/fomSize";

@Component({
  selector: ".app-fomSize-list",
  templateUrl: "./fomSize-list.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class FomSizeListComponent implements OnInit {
  isFormSubmitted = false;
  fomSizeForm: any;
  fomSizeObj: any;
  params: number;
  fomSizeList = [];
  categoryList: SelectItem[];
  selectedCollection = null;
  selectedQuality = null;
  selectedDensity = null;
  selectedSize = null;
  collectionList = [];
  qualityList = [];
  fomDensityList = [];
  fomSuggestedMMList = [];
  pageSize = 50;
  page = 1;
  totalCount = 0;
  search = '';
  states = [];
  toggleDiv = false;
  disabled: boolean = false;
  tableEmptyMesssage = 'Loading...';
  lengthMask = [/[1-9]/, /\d/, /\d/, '.', /\d/, /\d/];
  widthMask = [/[1-9]/, /\d/, /\d/, '.', /\d/, /\d/];
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private fomSizeService: FomSizeService,
    private globalErrorHandler: GlobalErrorHandler,
    private confirmationService: ConfirmationService,
    private messageService: MessageService) {
  }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      this.params = params['id'];
    });
    this.states.push({ label: '--Select--', value: '0' });
    this.getFomCollectionLookUp();
    this.newRecord();
  }

  newRecord() {
    this.params = null;
    this.fomSizeObj = {
      id: 0,
      categoryId: null,
      collectionId: null,
      qualityId: null,
      fomDensityId: null,
      fomSuggestedMMId: null,
      width: '',
      length: '',
      sizeCode: '',
      stockReorderLevel: null,
    };
    this.selectedCollection = null;
    this.selectedQuality = null;
    this.selectedDensity = null;
    this.selectedSize = null;
  }
  onInputChange() {
    this.fomSizeObj.sizeCode = this.fomSizeObj.width + 'x' + this.fomSizeObj.length;
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
  getFomSizesList() {
    this.fomSizeService.getAllFomSizes(this.pageSize, this.page, this.search).subscribe(
      results => {
        this.fomSizeList = results.data;
        console.log('this.fomSizeList', this.fomSizeList);
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
    this.fomSizeService.getFomCollectionLookUp().subscribe(
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
    if (this.selectedCollection == null) {
      this.qualityList = [];
      this.qualityList.unshift({ label: '--Select--', value: null });
      this.fomDensityList = [];
      this.fomDensityList.unshift({ label: '--Select--', value: null });
      this.fomSuggestedMMList = [];
      this.fomSuggestedMMList.unshift({ label: '--Select--', value: null });
      this.selectedQuality = null;
      this.selectedDensity = null;
      this.selectedSize = null;
    } else {
      this.fomSizeService.getQualityLookUpByCollection(this.selectedCollection).subscribe(
        results => {
          this.qualityList = results;
          this.qualityList.unshift({ label: '--Select--', value: null });
          this.selectedQuality = this.fomSizeObj.qualityId;
          if (this.selectedQuality > 0) {
            this.onQualityClick();
          }
          console.log('this.qualityList', this.qualityList);
        },
        error => {
          this.globalErrorHandler.handleError(error);
        });
    }
  }

  onQualityClick() {
    if (this.selectedQuality == null) {
      this.fomDensityList = [];
      this.fomDensityList.unshift({ label: '--Select--', value: null });
      this.fomSuggestedMMList = [];
      this.fomSuggestedMMList.unshift({ label: '--Select--', value: null });
      this.selectedDensity = null;
      this.selectedSize = null;
    } else {
      this.fomSizeService.getFomDensityLookUpByQuality(this.selectedQuality).subscribe(
        results => {
          this.fomDensityList = results;
          this.fomDensityList.unshift({ label: '--Select--', value: null });
          this.selectedDensity = this.fomSizeObj.fomDensityId;
          if (this.selectedDensity > 0) {
            this.onDensityClick();
          }
          console.log('this.selectedDensity', this.selectedDensity);
        },
        error => {
          this.globalErrorHandler.handleError(error);
        });
    }
  }

  onDensityClick() {
    if (this.selectedDensity == null) {
      this.fomSuggestedMMList = [];
      this.fomSuggestedMMList.unshift({ label: '--Select--', value: null });
      this.selectedSize = null;
    } else {
      this.fomSizeService.getFomSuggestedMMLookUpByFomDensity(this.selectedDensity).subscribe(
        results => {
          this.fomSuggestedMMList = results;
          this.fomSuggestedMMList.unshift({ label: '--Select--', value: null });
          this.selectedSize = this.fomSizeObj.fomSuggestedMMId;
          console.log('this.fomSuggestedMMList', this.fomSuggestedMMList);
        },
        error => {
          this.globalErrorHandler.handleError(error);
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
    this.getFomSizesList();
    this.getFomCollectionLookUp();
  }

  getFomSizeById(id) {
    this.fomSizeService.getFomSizeById(id).subscribe(
      results => {
        this.fomSizeObj = results;
        console.log('this.fomSizeObj', this.fomSizeObj);
        this.selectedCollection = this.fomSizeObj.collectionId;
        console.log('this.selectedCollection', this.selectedCollection);
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
    if (this.fomSizeObj.id > 0) {

    } else {
      this.fomSizeObj.collectionId = value.collection;
      this.fomSizeObj.qualityId = value.quality;
      this.fomSizeObj.fomDensityId = value.density;
      this.fomSizeObj.fomSuggestedMMId = value.size;
    }
    // this.fomSizeObj.sizeCode = value.width+'x'+value.length;
    // this.fomSizeObj.stockReorderLevel = value.stockReorderLevel;
    this.saveFomSize(this.fomSizeObj);
  }

  saveFomSize(value) {
    Helpers.setLoading(true);
    if (this.params) {
      this.fomSizeService.updateFomSize(value)
        .subscribe(
        results => {
          this.getFomSizesList();
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
      // value.id=this.params;
      this.fomSizeService.createFomSize(value)
        .subscribe(
        results => {
          this.getFomSizesList();
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

  onEditClick(fomSize: FomSize) {
    this.fomSizeService.perPage = this.pageSize;
    this.fomSizeService.currentPos = this.page;
    this.getFomSizeById(fomSize.id);
    this.params = fomSize.id;
    this.toggleDiv = true;
    this.disabled = true;
    this.isFormSubmitted = false;
  }

  onDelete(fomSize: FomSize) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        this.fomSizeService.deleteFomSize(fomSize.id).subscribe(
          results => {
            this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: results.message });
            this.getFomSizesList();
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

