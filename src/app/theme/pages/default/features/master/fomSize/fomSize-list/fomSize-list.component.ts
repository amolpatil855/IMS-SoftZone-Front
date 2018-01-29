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
  isFormSubmitted=false;
  fomSizeForm: any;
  fomSizeObj:any;
  params: number;
  fomSizeList=[];
  categoryList: SelectItem[];
  selectedCollection = 0 ;
  selectedQuality = 0;
  selectedDensity = 0;
  selectedSize = 0;
  collectionList=[];
  qualityList=[];
  fomDensityList=[];
  fomSuggestedMMList=[];
  pageSize=50;
  page=1;
  totalCount=0;
  search='';
  toggleDiv=false;
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
    this.newRecord();
  }

  newRecord(){
    this.fomSizeObj ={
    id: 0,
    categoryId: 0,
    collectionId: 0,
    qualityId: 0,
    fomDensityId: 0,
    fomSuggestedMMId: 0,
    width: 0,
    length: 0,
    sizeCode: '0x0',
    stockReorderLevel: null,
    };
  }
  onInputChange(){
    this.fomSizeObj.sizeCode=this.fomSizeObj.width+'x'+this.fomSizeObj.length;
  }
  toggleButton(){
    this.toggleDiv = !this.toggleDiv;
    if(this.toggleDiv && !this.params){
      this.newRecord();
    }

  }
  onCancel(){
    this.toggleDiv = false;
  }
  getFomSizesList() {
    this.fomSizeService.getAllFomSizes(this.pageSize,this.page,this.search).subscribe(
      results => {
        this.fomSizeList = results.data;
        console.log('this.fomSizeList', this.fomSizeList);
      },
      error => {
        this.globalErrorHandler.handleError(error);
      });
  }

  getFomCollectionLookUp(){
    this.fomSizeService.getFomCollectionLookUp().subscribe(
      results => {
        this.collectionList = results;
        this.collectionList.unshift({ label: '--Select--', value: '0' });
        console.log('this.collectionList', this.collectionList);
      },
      error => {
        this.globalErrorHandler.handleError(error);
      });
  }

  onCollectionClick(){
    this.fomSizeService.getQualityLookUpByCollection(this.selectedCollection).subscribe(
      results => {
        this.qualityList = results;
        this.qualityList.unshift({ label: '--Select--', value: '0' });
        this.selectedQuality = this.fomSizeObj.qualityId;
        console.log('this.qualityList', this.qualityList);
      },
      error => {
        this.globalErrorHandler.handleError(error);
      });
  }
  
  onQualityClick(){
    this.fomSizeService.getFomDensityLookUpByQuality(this.selectedQuality).subscribe(
      results => {
        this.fomDensityList = results;
        this.fomDensityList.unshift({ label: '--Select--', value: '0' });
        this.selectedDensity = this.fomSizeObj.fomDensityId;
        console.log('this.fomDensityList', this.fomDensityList);
      },
      error => {
        this.globalErrorHandler.handleError(error);
      });
  }

  onDensityClick(){
    this.fomSizeService.getFomSuggestedMMLookUpByFomDensity(this.selectedDensity).subscribe(
      results => {
        this.fomSizeList = results;
        this.fomSizeList.unshift({ label: '--Select--', value: '0' });
        this.selectedSize = this.fomSizeObj.fomSuggestedMMId;
        console.log('this.fomSizeList', this.fomSizeList);
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
    this.pageSize=event.rows;
    this.page=event.first;
    this.search=  event.globalFilter;
    this.getFomSizesList();
    this.getFomCollectionLookUp();
  }

  getFomSizeById(id){
  this.fomSizeService.getFomSizeById(id).subscribe(
    results => {
      this.fomSizeObj = results;
      console.log('this.fomSizeObj', this.fomSizeObj);
      this.selectedCollection = this.fomSizeObj.categoryId;
      if(this.selectedCollection > 0){
        this.onCollectionClick();
      }
    },
    error => {
      this.globalErrorHandler.handleError(error);
    });
  }

  
  onSubmit({ value, valid }: { value: any, valid: boolean }) {
    this.isFormSubmitted=true;
    if(!valid)
    return;
    this.fomSizeObj.collectionId = value.collection;
    this.fomSizeObj.qualityId = value.quality;
    this.fomSizeObj.fomDensityId = value.density;
    this.fomSizeObj.fomSuggestedMMId = value.size;
    this.fomSizeObj.sizeCode = value.width+'x'+value.length;
    this.fomSizeObj.stockReorderLevel = value.stockReorderLevel;
    this.saveFomSize(this.fomSizeObj);
  }

  saveFomSize(value) {
    Helpers.setLoading(true);
    if (this.params) {
      this.fomSizeService.updateFomSize(value)
        .subscribe(
        results => {
         this. getFomSizesList(); 
         this.toggleDiv=false;
         this.params=null;
          this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: results.message });
          Helpers.setLoading(false);
         
        },
        error => {
          this.globalErrorHandler.handleError(error);
          Helpers.setLoading(false);
        });
    } else {
      this.fomSizeService.createFomSize(value)
        .subscribe(
        results => {
         this. getFomSizesList();
         this.toggleDiv=false;
         this.params=null;
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
     this. getFomSizeById(fomSize.id);
     this.params=fomSize.id;
     this.toggleDiv=true;
  }

  onDelete(fomSize: FomSize) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        this.fomSizeService.deleteFomSize(fomSize.id).subscribe(
          results => {
            this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: results.message  });
            this.getFomSizesList();
            this.toggleDiv=false;
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

