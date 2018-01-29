import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash/index';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { ConfirmationService, DataTableModule, LazyLoadEvent, SelectItem } from 'primeng/primeng';
import { GlobalErrorHandler } from '../../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../../_services/message.service';
import { MatSizeService } from '../../../../_services/matSize.service';
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

  matSizeForm: any;
  matSizeObj:any;
  params: number;
  matSizeList=[];
  categoryList: SelectItem[];
  selectedCollection = 0 ;
  selectedQuality = 0;
  selectedThickness = 0;
  collectionList=[];
  qualityList=[];
  thicknessList=[];
  pageSize=50;
  page=1;
  totalCount=0;
  search='';
  toggleDiv=false;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private matSizeService: MatSizeService,
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
    this.matSizeObj ={
    id: 0,
    categoryId: 0,
    collectionId: 0,
    qualityId: 0,
    thicknessId: 0,
    sizeCode: '',
    rate: '',
    stockReorderLevel: null,
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
  getMatSizesList() {
    this.matSizeService.getAllMatSizes(this.pageSize,this.page,this.search).subscribe(
      results => {
        this.matSizeList = results.data;
        console.log('this.matSizeList', this.matSizeList);
      },
      error => {
        this.globalErrorHandler.handleError(error);
      });
  }

  getMatCollectionLookUp(){
    this.matSizeService.getMatCollectionLookUp().subscribe(
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
    this.matSizeService.getQualityLookUpByCollection(this.selectedCollection).subscribe(
      results => {
        this.qualityList = results;
        this.qualityList.unshift({ label: '--Select--', value: '0' });
        this.selectedQuality = this.matSizeObj.qualityId;
        if(this.selectedQuality > 0){
          this.onQualityClick();
        }
        
        console.log('this.qualityList', this.qualityList);
      },
      error => {
        this.globalErrorHandler.handleError(error);
      });
  }
  
  onQualityClick(){
    this.matSizeService.getMatThicknessLookUp().subscribe(
      results => {
        this.thicknessList = results;
        this.thicknessList.unshift({ label: '--Select--', value: '0' });
        this.selectedThickness = this.matSizeObj.thicknessId;
        console.log('this.thicknessList', this.thicknessList);
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
    this.getMatSizesList();
    this.getMatCollectionLookUp();
  }

  getMatSizeById(id){
  this.matSizeService.getMatSizeById(id).subscribe(
    results => {
      this.matSizeObj = results;
      console.log('this.matSizeObj', this.matSizeObj);
      this.selectedCollection = this.matSizeObj.categoryId;
      if(this.selectedCollection > 0){
        this.onCollectionClick();
      }
    },
    error => {
      this.globalErrorHandler.handleError(error);
    });
  }

  
  onSubmit({ value, valid }: { value: any, valid: boolean }) {
    this.matSizeObj.collectionId = value.collection;
    this.matSizeObj.qualityId = value.quality;
    this.matSizeObj.thicknessId = value.thickness;
    this.saveMatSize(this.matSizeObj);
  }

  saveMatSize(value) {
    Helpers.setLoading(true);
    if (this.params) {
      this.matSizeService.updateMatSize(value)
        .subscribe(
        results => {
         this. getMatSizesList(); 
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
      this.matSizeService.createMatSize(value)
        .subscribe(
        results => {
         this. getMatSizesList();
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

  onEditClick(matSize: MatSize) {
     this.matSizeService.perPage = this.pageSize;
     this.matSizeService.currentPos = this.page;
     this. getMatSizeById(matSize.id);
     this.params=matSize.id;
     this.toggleDiv=true;
  }

  onDelete(matSize: MatSize) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        this.matSizeService.deleteMatSize(matSize.id).subscribe(
          results => {
            this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: results.message  });
            this.getMatSizesList();
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
