import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash/index';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { ConfirmationService, DataTableModule, LazyLoadEvent, SelectItem } from 'primeng/primeng';
import { GlobalErrorHandler } from '../../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../../_services/message.service';
import { MatSizeService } from '../../../../_services/matSize.service';
import { CollectionService } from '../../../../_services/collection.service';
import { Role } from "../../../../_models/role";
import { ScriptLoaderService } from '../../../../../../../_services/script-loader.service';
import { Helpers } from "../../../../../../../helpers";
import { MatSize } from "../../../../_models/matSize";

@Component({
  selector: ".app-matSize-list",
  templateUrl: "./matSize-list.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class MatSizeListComponent implements OnInit {
  isFormSubmitted = false;
  matSizeForm: any;
  matSizeObj: any;
  collectionObj: any;
  params: number;
  purchaseDiscount = null;
  matSizeList = [];
  categoryList: SelectItem[];
  selectedCollection = null;
  selectedQuality = null;
  selectedThickness = null;
  collectionList = [];
  qualityList = [];
  thicknessList = [];
  pageSize = 50;
  page = 1;
  totalCount = 0;
  search = '';
  toggleDiv = false;
  disabled: boolean = false;
  convertedRate = null;
  tableEmptyMesssage = 'Loading...';
  rateMask = [/[0-9]/, /\d/, /\d/, /\d/, /\d/, '.', /\d/, /\d/];
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private matSizeService: MatSizeService,
    private collectionService: CollectionService,
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
    this.matSizeObj = {
      id: 0,
      categoryId: null,
      collectionId: null,
      qualityId: null,
      thicknessId: null,
      sizeCode: '',
      rate: '',
      purchaseRate: null,
      stockReorderLevel: null,
    };
    this.purchaseDiscount = null;
    this.selectedCollection = null;
    this.qualityList = [];
    this.qualityList.unshift({ label: '--Select--', value: null });
    this.thicknessList = [];
    this.thicknessList.unshift({ label: '--Select--', value: null });
    this.selectedQuality = null;
    this.selectedThickness = null;
  }

  onInputChange() {
    if(this.matSizeObj.rate > 0){
    this.matSizeObj.purchaseRate = this.roundTo((this.matSizeObj.rate - ((this.matSizeObj.rate * this.purchaseDiscount) / 100)), 2);
    }
  }

  roundTo(n, digits) {
     if (digits === undefined) {
       digits = 0;
     }

     let multiplicator = Math.pow(10, digits);
     n = parseFloat((n * multiplicator).toFixed(11));
     let test =(Math.round(n) / multiplicator);
     return +(test.toFixed(digits));
   }

  restrictMinus(e, limit) {

    if (e.target.value.length == limit) {
      return false;
    }

    var inputKeyCode = e.keyCode ? e.keyCode : e.which;

    if (inputKeyCode != null) {
      if (inputKeyCode == 43 || inputKeyCode == 45 || inputKeyCode == 101) e.preventDefault();
    }
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
  getMatSizesList() {
    this.matSizeService.getAllMatSizes(this.pageSize, this.page, this.search).subscribe(
      results => {
        this.matSizeList = results.data;
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

  getMatCollectionLookUp() {
    Helpers.setLoading(true);
    this.matSizeService.getMatCollectionLookUp().subscribe(
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

  onCollectionClick() {
    this.purchaseDiscount = null;
    this.qualityList = [];
    this.qualityList.unshift({ label: '--Select--', value: null });
    this.thicknessList = [];
    this.thicknessList.unshift({ label: '--Select--', value: null });
    this.selectedQuality = null;
    this.selectedThickness = null;
    if (this.selectedCollection != null) {
      Helpers.setLoading(true);
      this.collectionService.getCollectionById(this.selectedCollection).subscribe(
      results => {
        this.collectionObj = results;
        this.purchaseDiscount = this.collectionObj.purchaseDiscount;
        Helpers.setLoading(false);
      },
      error => {
        this.globalErrorHandler.handleError(error);
        Helpers.setLoading(false);
      });

      this.matSizeService.getQualityLookUpByCollection(this.selectedCollection).subscribe(
        results => {
          this.qualityList = results;
          this.qualityList.unshift({ label: '--Select--', value: null });
          this.selectedQuality = this.matSizeObj.qualityId;
          if (this.selectedQuality > 0) {
            this.onQualityClick();
          }
          Helpers.setLoading(false);
        },
        error => {
          this.globalErrorHandler.handleError(error);
          Helpers.setLoading(false);
        });
    }
  }

  onQualityClick() {

    this.thicknessList = [];
    this.thicknessList.unshift({ label: '--Select--', value: null });
    this.selectedThickness = null;
    if (this.selectedQuality != null) {
      Helpers.setLoading(true);
      this.matSizeService.getMatThicknessLookUp().subscribe(
        results => {
          this.thicknessList = results;
          this.thicknessList.unshift({ label: '--Select--', value: null });
          this.selectedThickness = this.matSizeObj.thicknessId;
          Helpers.setLoading(false);
        },
        error => {
          this.globalErrorHandler.handleError(error);
          Helpers.setLoading(false);
        });
    }
  }

  calculateSizeCode() {
    if (this.matSizeObj.width && this.matSizeObj.length) {
      this.matSizeObj.sizeCode = this.matSizeObj.length + 'x' + this.matSizeObj.width;
    }
    else
      this.matSizeObj.sizeCode = '';
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
    this.page = event.first/event.rows;
    this.search = event.globalFilter;
    this.getMatSizesList();
    this.getMatCollectionLookUp();
  }

  getMatSizeById(id) {
    Helpers.setLoading(true);
    this.matSizeService.getMatSizeById(id).subscribe(
      results => {
        this.matSizeObj = results;
        this.selectedCollection = this.matSizeObj.collectionId;
        if (this.selectedCollection > 0) {
          this.onCollectionClick();
        }
        Helpers.setLoading(false);
      },
      error => {
        this.globalErrorHandler.handleError(error);
        Helpers.setLoading(false);
      });
  }


  onSubmit({ value, valid }: { value: any, valid: boolean }) {
    this.isFormSubmitted = true;
    if (!valid)
      return;
    if (this.matSizeObj.id > 0) {

    } else {
      this.matSizeObj.collectionId = value.collection;
      this.matSizeObj.qualityId = value.quality;
      this.matSizeObj.thicknessId = value.thickness;
    }
    this.saveMatSize(this.matSizeObj);
  }

  saveMatSize(value) {
    Helpers.setLoading(true);
    if (this.params) {
      this.matSizeService.updateMatSize(value)
        .subscribe(
        results => {
          this.getMatSizesList();
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
      this.matSizeService.createMatSize(value)
        .subscribe(
        results => {
          this.getMatSizesList();
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

  onEditClick(matSize: MatSize) {
    this.matSizeService.perPage = this.pageSize;
    this.matSizeService.currentPos = this.page;
    this.getMatSizeById(matSize.id);
    this.params = matSize.id;
    this.toggleDiv = true;
    this.disabled = true;
    this.isFormSubmitted = false;
    window.scrollTo(0, 0);
  }

  onDelete(matSize: MatSize) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        this.matSizeService.deleteMatSize(matSize.id).subscribe(
          results => {
            this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: results.message });
            this.getMatSizesList();
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
