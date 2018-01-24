import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash/index';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { ConfirmationService, DataTableModule, LazyLoadEvent, SelectItem } from 'primeng/primeng';
import { GlobalErrorHandler } from '../../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../../_services/message.service';
import { DesignService } from '../../../../_services/design.service';
import { Role } from "../../../../_models/role";
import { ScriptLoaderService } from '../../../../../../../_services/script-loader.service';
import { Helpers } from "../../../../../../../helpers";
import { Design } from "../../../../_models/design";
@Component({
  selector: "app-design-list",
  templateUrl: "./design-list.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class DesignListComponent implements OnInit {

  designForm: any;
  designObj:any;
  params: number;
  designList=[];
  categoryList: SelectItem[];
  selectedCategory = 0;
  selectedCollection = 0 ;
  selectedQuality = 0;
  collectionList=[];
  qualityList=[];
  pageSize=50;
  page=1;
  totalCount=0;
  search='';
  toggleDiv=false;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private designService: DesignService,
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
    this.designObj ={
    categoryId: 0,
    collectionId: 0,
    qualityId: 0,
    designCode: '',
    designName: '',
    description: '',
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
  getDesignsList() {
    this.designService.getAllDesigns(this.pageSize,this.page,this.search).subscribe(
      results => {
        this.designList = results.data;
        console.log('this.designList', this.designList);
      },
      error => {
        this.globalErrorHandler.handleError(error);
      });
  }

  getCategoryLookUp(){
    this.designService.getCategoryLookUp().subscribe(
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
    this.designService.getCollectionLookUp(this.selectedCategory).subscribe(
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
    this.designService.getQualityLookUpByCollection(this.selectedCollection).subscribe(
      results => {
        this.qualityList = results;
        this.qualityList.unshift({ label: '--Select--', value: '0' });
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
    this.pageSize=event.rows;
    this.page=event.first;
    this.search=  event.globalFilter;
    this.getDesignsList();
    this.getCategoryLookUp();
  }

  getdesignById(id){
  this.designService.getDesignById(id).subscribe(
    results => {
      this.designObj = results;
      console.log('this.designObj', this.designObj);
      
    },
    error => {
      this.globalErrorHandler.handleError(error);
    });
  }

  
  onSubmit({ value, valid }: { value: any, valid: boolean }) {
    this.designObj.categoryId = value.category;
    this.designObj.collectionId = value.collection;
    this.designObj.qualityId = value.quality;
    this.saveDesign(this.designObj);
  }

  saveDesign(value) {
    Helpers.setLoading(true);
    if (this.params) {
      this.designService.updateDesign(value)
        .subscribe(
        results => {
         this. getDesignsList(); 
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
      this.designService.createDesign(value)
        .subscribe(
        results => {
         this. getDesignsList();
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

  onEditClick(design: Design) {
     this.designService.perPage = this.pageSize;
     this.designService.currentPos = this.page;
     this. getdesignById(design.id);
     this.params=design.id;
     this.toggleDiv=true;
  }

  onDelete(design: Design) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        this.designService.deleteDesign(design.id).subscribe(
          results => {
            this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: results.message  });
            this.getDesignsList();
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