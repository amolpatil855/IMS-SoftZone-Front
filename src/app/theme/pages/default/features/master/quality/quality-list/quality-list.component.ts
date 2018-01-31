import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash/index';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { ConfirmationService, DataTableModule, LazyLoadEvent } from 'primeng/primeng';
import { GlobalErrorHandler } from '../../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../../_services/message.service';
import { CollectionService } from '../../../../_services/collection.service';
import { Role } from "../../../../_models/role";
import { ScriptLoaderService } from '../../../../../../../_services/script-loader.service';
import { Helpers } from "../../../../../../../helpers";
import { Quality } from "../../../../_models/quality";
import { SupplierService } from '../../../../_services/supplier.service';
import { CommonService } from '../../../../_services/common.service';
import { QualityService } from '../../../../_services/quality.service';
import { HsnService } from '../../../../_services/hsn.service';
@Component({
  selector: "app-quality-list",
  templateUrl: "./quality-list.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class QualityListComponent implements OnInit {
  qualityForm: any;
  qualityObj:any;
  params: number;
  collectionList=[];
  categoriesCodeList=[];
  hsnCodeList=[];
  recordList=[];
  pageSize=50;
  page=1;
  totalCount=0;
  search='';
  toggleDiv=false;
  disabled: boolean = false;
  states=[];
  isFormSubmitted:boolean = false;
  slectedCategory=null;
  tableEmptyMesssage='Loading...';
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private supplierService: SupplierService,
    private qualityService: QualityService,
    private globalErrorHandler: GlobalErrorHandler,
    private confirmationService: ConfirmationService,
    private commonService: CommonService,
    private hsnService:HsnService,
    private collectionService:CollectionService,
    private messageService: MessageService) {
  }

  ngOnInit() {
    this.params=null;
   this.getQualityList();
   this.newRecord();
   this.getHsnCodeList();
   this. getCategoryCodeList(); 
  }

newRecord(){
  this.params=null;
  this.qualityForm = this.formBuilder.group({
    id: 0,
    qualityCode: ['', [Validators.required]],
    qualityName: ['', [Validators.required]],
    categoryId: ['', [Validators.required]],
    collectionId: ['', [Validators.required]],
    description: [''],
    hsnId: ['', [Validators.required]],
    width: ['0', [Validators.required]],
    size: ['0', [Validators.required]],
    cutRate: ['0', [Validators.required]],
    roleRate: ['0', [Validators.required]],
    rrp: ['0', [Validators.required]],
    maxCutRateDisc: ['0', [Validators.required]],
    maxRoleRateDisc: ['0', [Validators.required]],
    flatRate:['0', [Validators.required]],
    maxflatCutRateDisc:['0', [Validators.required]],
    maxflatRoleRateDisc:['0', [Validators.required]],
    custRatePerSqFeet:['0', [Validators.required]],
    purchaseRatePerMM:['0', [Validators.required]],
    sellingRatePerMM:['0', [Validators.required]],
    maxDiscout:['0', [Validators.required]],
  });
  this.slectedCategory = 0;
}


  toggleButton(){
    this.toggleDiv = !this.toggleDiv;
    if(this.toggleDiv && !this.params){
      this.disabled = false;
      this.isFormSubmitted = false;
      this.newRecord();
    }

  }
  onCancel(){
    this.toggleDiv = false;
    this.disabled = false;
    this.newRecord();
  }

  getHsnCodeList() {
    this.hsnService.getHsnLookUp().subscribe(
      results => {
        this.hsnCodeList = results;
        this.hsnCodeList.unshift({ label: '--Select--', value: '0' });
      },
      error => {
        this.globalErrorHandler.handleError(error);
      });
  }

  getCategoryCodeList() {
    this.commonService.getCategoryCodes().subscribe(
      results => {
        this.categoriesCodeList = results;
        this.categoriesCodeList.unshift({ label: '--Select--', value: '0' });
      },
      error => {
        this.globalErrorHandler.handleError(error);
      });
  }

  getQualityList() {
    this.qualityService.getAllQualitys().subscribe(
      results => {
        this.recordList = results.data;
      this.totalCount=results.totalCount;
        if(this.totalCount==0)
        {
          this.tableEmptyMesssage="No Records Found";
        }
      },
      error => {
        this.tableEmptyMesssage="No Records Found";
        this.globalErrorHandler.handleError(error);
      });
  }


  getCollectionList(id) {
    this.collectionService.getCollectionLookUp(id).subscribe(
      results => {
        this.collectionList = results;
        this.collectionList.unshift({ label: '--Select--', value: '0' });
      },
      error => {
        this.globalErrorHandler.handleError(error);
      });
  }
  loadLazy(event: LazyLoadEvent) {
    this.pageSize=event.rows;
    this.page=event.first;
    this.search=  event.globalFilter;
    this.getQualityList();
  }


getQualityById(id){
  this.qualityService.getQualityById(id).subscribe(
    results => {
      this.qualityObj = results; 
      this.qualityForm.setValue({
        id: results.id,
        qualityCode:  results.qualityCode,
        qualityName:  results.qualityName,
        categoryId: results.categoryId,
        collectionId: results.collectionId,
        description:results.description,
        hsnId: results.hsnId,
        width: results.width,
        size: results.size,
        cutRate: results.cutRate,
        roleRate: results.roleRate,
        rrp: results.rrp,
        maxCutRateDisc: results.maxCutRateDisc,
        maxRoleRateDisc: results.maxRoleRateDisc,
        flatRate:results.flatRate,
        maxflatCutRateDisc:results.maxflatCutRateDisc,
        maxflatRoleRateDisc:results.maxflatRoleRateDisc,
        custRatePerSqFeet:results.custRatePerSqFeet,
        purchaseRatePerMM:results.purchaseRatePerMM,
        sellingRatePerMM:results.sellingRatePerMM,
        maxDiscout:results.maxDiscout,
      });
      console.log('this.collectionList', this.qualityObj);
    },
    error => {
      this.globalErrorHandler.handleError(error);
    });
}

  
  onSubmit({ value, valid }: { value: any, valid: boolean }) {
    this.isFormSubmitted=true;
    if(valid)
      this.saveQuality(value);
  }

  onChangeCategory(event){
    if(this.slectedCategory){
      this.getCollectionList(this.slectedCategory);
    }
    
  }

  saveQuality(value) {
    Helpers.setLoading(true);
    if (this.params) {
      this.qualityService.updateQuality(value)
        .subscribe(
        results => {
         this. getQualityList(); 
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
      this.qualityService.createQuality(value)
        .subscribe(
        results => {
         this.getQualityList();
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

  onEditClick(quality: Quality) {
     this.collectionService.perPage = this.pageSize;
     this.collectionService.currentPos = this.page;
    this. getQualityById(quality.id);
    this.params=quality.id;
    this.slectedCategory=null;
    this.toggleDiv=true;
    this.disabled = true;
    this.isFormSubmitted = false;
  }

  onDelete(quality: Quality) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        this.qualityService.deleteQuality(quality.id).subscribe(
          results => {
            this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: results.message  });
            this.getQualityList();
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
