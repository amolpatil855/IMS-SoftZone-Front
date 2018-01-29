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
  isFormSubmitted=false;
  fomSuggestedMMForm: any;
  fomSuggestedMMObj:any;
  params: number;
  fomSuggestedMMList=[];
  categoryList: SelectItem[];
  selectedCategory = 0;
  selectedCollection = 0 ;
  selectedQuality = 0;
  selectedDensity = 0;
  collectionList=[];
  qualityList=[];
  fomDensityList=[];
  pageSize=50;
  page=1;
  totalCount=0;
  search='';
  toggleDiv=false;
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

  newRecord(){
    this.fomSuggestedMMObj ={
    id: 0,
    categoryId: 0,
    collectionId: 0,
    qualityId: 0,
    fomDensityId: 0,
    suggestedMM: null,
    };
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
  getFomSuggestedMMsList() {
    this.fomSuggestedMMService.getAllFomSuggestedMMs(this.pageSize,this.page,this.search).subscribe(
      results => {
        this.fomSuggestedMMList = results.data;
        console.log('this.fomSuggestedMMList', this.fomSuggestedMMList);
      },
      error => {
        this.globalErrorHandler.handleError(error);
      });
  }

  getFomCollectionLookUp(){
    this.fomSuggestedMMService.getFomCollectionLookUp().subscribe(
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
    this.fomSuggestedMMService.getQualityLookUpByCollection(this.selectedCollection).subscribe(
      results => {
        this.qualityList = results;
        this.qualityList.unshift({ label: '--Select--', value: '0' });
        this.selectedQuality = this.fomSuggestedMMObj.qualityId;
        console.log('this.qualityList', this.qualityList);
      },
      error => {
        this.globalErrorHandler.handleError(error);
      });
  }
  
  onQualityClick(){
    this.fomSuggestedMMService.getFomDensityLookUpByQuality(this.selectedQuality).subscribe(
      results => {
        this.fomDensityList = results;
        this.fomDensityList.unshift({ label: '--Select--', value: '0' });
        this.selectedDensity = this.fomSuggestedMMObj.fomDensityId;
        console.log('this.fomDensityList', this.fomDensityList);
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
    this.getFomSuggestedMMsList();
    this.getFomCollectionLookUp();
  }

  getFomSuggestedMMById(id){
  this.fomSuggestedMMService.getFomSuggestedMMById(id).subscribe(
    results => {
      this.fomSuggestedMMObj = results;
      console.log('this.fomSuggestedMMObj', this.fomSuggestedMMObj);
      this.selectedCollection = this.fomSuggestedMMObj.categoryId;
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
    this.fomSuggestedMMObj.categoryId = value.category;
    this.fomSuggestedMMObj.collectionId = value.collection;
    this.fomSuggestedMMObj.qualityId = value.quality;
    this.fomSuggestedMMObj.fomDensityId = value.density;
    this.saveFomSuggestedMM(this.fomSuggestedMMObj);
  }

  saveFomSuggestedMM(value) {
    Helpers.setLoading(true);
    if (this.params) {
      this.fomSuggestedMMService.updateFomSuggestedMM(value)
        .subscribe(
        results => {
         this. getFomSuggestedMMsList(); 
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
      this.fomSuggestedMMService.createFomSuggestedMM(value)
        .subscribe(
        results => {
         this. getFomSuggestedMMsList();
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

  onEditClick(fomSuggestedMM: FomSuggestedMM) {
     this.fomSuggestedMMService.perPage = this.pageSize;
     this.fomSuggestedMMService.currentPos = this.page;
     this. getFomSuggestedMMById(fomSuggestedMM.id);
     this.params=fomSuggestedMM.id;
     this.toggleDiv=true;
  }

  onDelete(fomSuggestedMM: FomSuggestedMM) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        this.fomSuggestedMMService.deleteFomSuggestedMM(fomSuggestedMM.id).subscribe(
          results => {
            this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: results.message  });
            this.getFomSuggestedMMsList();
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

