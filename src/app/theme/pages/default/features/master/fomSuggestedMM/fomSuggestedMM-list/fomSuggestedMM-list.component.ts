import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash/index';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { ConfirmationService, DataTableModule, LazyLoadEvent, SelectItem } from 'primeng/primeng';
import { GlobalErrorHandler } from '../../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../../_services/message.service';
import { FomSuggestedMMService } from '../../../../_services/fomSuggestedMM.service';
import { ScriptLoaderService } from '../../../../../../../_services/script-loader.service';
import { Helpers } from "../../../../../../../helpers";
import { FomSuggestedMM } from "../../../../_models/fomSuggestedMM";

@Component({
  selector: ".app-fomSuggestedMM-list",
  templateUrl: "./fomSuggestedMM-list.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class FomSuggestedMMListComponent implements OnInit {
  isFormSubmitted = false;
  fomSuggestedMMForm: any;
  fomSuggestedMMObj: any;
  params: number;
  fomSuggestedMMList = [];
  categoryList: SelectItem[];
  selectedCategory = null;
  selectedCollection = null;
  selectedQuality = null;
  selectedDensity = null;
  collectionList = [];
  qualityList = [];
  fomDensityList = [];
  pageSize = 50;
  page = 1;
  totalCount = 0;
  search = '';
  toggleDiv = false;
  disabled: boolean = false;
  tableEmptyMesssage = 'Loading...';
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private fomSuggestedMMService: FomSuggestedMMService,
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
    this.fomSuggestedMMObj = {
      id: 0,
      categoryId: null,
      collectionId: null,
      qualityId: null,
      fomDensityId: null,
      suggestedMM: null,
    };
    this.selectedCategory = null;
    this.selectedCollection = null;
    this.qualityList = [];
    this.qualityList.unshift({ label: '--Select--', value: null });
    this.fomDensityList = [];
    this.fomDensityList.unshift({ label: '--Select--', value: null });
    this.selectedQuality = null;
    this.selectedDensity = null;
  }

  restrictDotMinus(e, limit) {

    if (e.target.value.length == limit) {
      return false;
    }

    var inputKeyCode = e.keyCode ? e.keyCode : e.which;

    if (inputKeyCode != null) {
      if (inputKeyCode == 43 || inputKeyCode == 45 || inputKeyCode == 46 || inputKeyCode == 101) e.preventDefault();
    }
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
  getFomSuggestedMMsList() {
    this.fomSuggestedMMService.getAllFomSuggestedMMs(this.pageSize, this.page, this.search).subscribe(
      results => {
        this.fomSuggestedMMList = results.data;
        console.log('this.fomSuggestedMMList', this.fomSuggestedMMList);
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
    this.fomSuggestedMMService.getFomCollectionLookUp().subscribe(
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

    this.qualityList = [];
    this.qualityList.unshift({ label: '--Select--', value: null });
    this.fomDensityList = [];
    this.fomDensityList.unshift({ label: '--Select--', value: null });
    this.selectedQuality = null;
    this.selectedDensity = null;
    if (this.selectedCollection != null) {
      this.fomSuggestedMMService.getQualityLookUpByCollection(this.selectedCollection).subscribe(
        results => {
          this.qualityList = results;
          this.qualityList.unshift({ label: '--Select--', value: null });
          this.selectedQuality = this.fomSuggestedMMObj.qualityId;
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

    this.fomDensityList = [];
    this.fomDensityList.unshift({ label: '--Select--', value: null });
    this.selectedDensity = null;
    if (this.selectedQuality != null) {
      this.fomSuggestedMMService.getFomDensityLookUpByQuality(this.selectedQuality).subscribe(
        results => {
          this.fomDensityList = results;
          this.fomDensityList.unshift({ label: '--Select--', value: null });
          this.selectedDensity = this.fomSuggestedMMObj.fomDensityId;
          console.log('this.fomDensityList', this.fomDensityList);
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
    this.getFomSuggestedMMsList();
    this.getFomCollectionLookUp();
  }

  getFomSuggestedMMById(id) {
    this.fomSuggestedMMService.getFomSuggestedMMById(id).subscribe(
      results => {
        this.fomSuggestedMMObj = results;
        console.log('this.fomSuggestedMMObj', this.fomSuggestedMMObj);
        this.selectedCollection = this.fomSuggestedMMObj.collectionId;
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
    if (this.fomSuggestedMMObj.id > 0) {

    }
    else {
      this.fomSuggestedMMObj.collectionId = value.collection;
      this.fomSuggestedMMObj.qualityId = value.quality;
      this.fomSuggestedMMObj.fomDensityId = value.density;
    }
    this.saveFomSuggestedMM(this.fomSuggestedMMObj);
  }

  saveFomSuggestedMM(value) {
    Helpers.setLoading(true);
    if (this.params) {
      this.fomSuggestedMMService.updateFomSuggestedMM(value)
        .subscribe(
        results => {
          this.getFomSuggestedMMsList();
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
      this.fomSuggestedMMService.createFomSuggestedMM(value)
        .subscribe(
        results => {
          this.getFomSuggestedMMsList();
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

  onEditClick(fomSuggestedMM: FomSuggestedMM) {
    this.fomSuggestedMMService.perPage = this.pageSize;
    this.fomSuggestedMMService.currentPos = this.page;
    this.getFomSuggestedMMById(fomSuggestedMM.id);
    this.params = fomSuggestedMM.id;
    this.toggleDiv = true;
    this.disabled = true;
    this.isFormSubmitted = false;
  }

  onDelete(fomSuggestedMM: FomSuggestedMM) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        this.fomSuggestedMMService.deleteFomSuggestedMM(fomSuggestedMM.id).subscribe(
          results => {
            this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: results.message });
            this.getFomSuggestedMMsList();
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

