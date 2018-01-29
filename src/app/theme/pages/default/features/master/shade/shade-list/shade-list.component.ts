import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash/index';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { ConfirmationService, DataTableModule, LazyLoadEvent, SelectItem } from 'primeng/primeng';
import { GlobalErrorHandler } from '../../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../../_services/message.service';
import { ShadeService } from '../../../../_services/shade.service';
import { Role } from "../../../../_models/role";
import { ScriptLoaderService } from '../../../../../../../_services/script-loader.service';
import { Helpers } from "../../../../../../../helpers";
import { Shade} from "../../../../_models/shade";
import { retry } from 'rxjs/operator/retry';

@Component({
  selector: "app-shade-list",
  templateUrl: "./shade-list.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class ShadeListComponent implements OnInit {
  isFormSubmitted=false;
  shadeForm: any;
  shadeObj:any;
  params: number;
  shadeList=[];
  categoryList: SelectItem[];
  selectedCategory: any;
  selectedCollection: any;
  selectedDesign: any;
  selectedQuality: any;
  collectionList=[];
  qualityList=[];
  designList=[];
  pageSize=50;
  page=1;
  totalCount=0;
  search='';
  toggleDiv=false;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private shadeService: ShadeService,
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
    this.shadeObj ={
    categoryId: 0,
    collectionId: 0,
    qualityId: 0,
    designId: 0,
    shadeCode: '',
    shadeName: '',
    description: '',
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
  getShadesList() {
    this.shadeService.getAllShades(this.pageSize,this.page,this.search).subscribe(
      results => {
        this.shadeList = results.data;
        console.log('this.shadeList', this.shadeList);
      },
      error => {
        this.globalErrorHandler.handleError(error);
      });
  }

  getCategoryLookUp(){
    this.shadeService.getCategoryLookup().subscribe(
      results => {
        this.categoryList = results;
        this.categoryList.unshift({ label: '--Select--', value: '0' });
        console.log('this.categoryList', this.categoryList);
      },
      error => {
        this.globalErrorHandler.handleError(error);
      });
  }

  onCategoryClick(){
    console.log('selectedCategory', this.selectedCategory);
    this.shadeService.getCollectionLookUp(this.selectedCategory).subscribe(
      results => {
        this.collectionList = results;
        this.collectionList.unshift({ label: '--Select--', value: '0' });
         this.selectedCollection = this.shadeObj.collectionId;
          if(this.selectedCollection > 0){
            this.onCollectionClick();
          }
        console.log('this.collectionList', this.collectionList);
      },
      error => {
        this.globalErrorHandler.handleError(error);
      });
  }

  onCollectionClick(){
    this.shadeService.getQualityLookUpByCollection(this.selectedCollection).subscribe(
      results => {
        this.qualityList = results;
        this.qualityList.unshift({ label: '--Select--', value: '0' });
        this.selectedQuality = this.shadeObj.qualityId;
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
    this.shadeService.getDesignLookupByQuality(this.selectedQuality).subscribe(
      results => {
        this.designList = results;
        this.designList.unshift({ label: '--Select--', value: '0' });
        this.selectedDesign = this.shadeObj.designId;
        console.log('this.designList', this.designList);
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
    this.getShadesList();
    this.getCategoryLookUp();
  }

  getshadeById(id){
  this.shadeService.getShadeById(id).subscribe(
    results => {
      this.shadeObj = results;
       this.selectedCategory = this.shadeObj.categoryId;
        if(this.selectedCategory > 0){
          this.onCategoryClick();
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
      this.shadeObj.categoryId = value.category;
      this.shadeObj.collectionId = value.collection;
      this.shadeObj.qualityId = value.quality;
      this.shadeObj.designId = value.design;
      this.saveShade(this.shadeObj);
  }

  saveShade(value) {
    Helpers.setLoading(true);
    if (this.params) {
      this.shadeService.updateShade(value)
        .subscribe(
        results => {
         this. getShadesList(); 
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
      this.shadeService.createShade(value)
        .subscribe(
        results => {
         this. getShadesList();
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

  onEditClick(shade: Shade) {
     this.shadeService.perPage = this.pageSize;
     this.shadeService.currentPos = this.page;
     this. getshadeById(shade.id);
     this.params=shade.id;
     this.toggleDiv=true;
  }

  onDelete(shade: Shade) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        this.shadeService.deleteShade(shade.id).subscribe(
          results => {
            this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: results.message  });
            this.getShadesList();
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