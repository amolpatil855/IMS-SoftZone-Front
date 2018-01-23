import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash/index';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { ConfirmationService, DataTableModule, LazyLoadEvent } from 'primeng/primeng';
import { GlobalErrorHandler } from '../../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../../_services/message.service';
import { HsnService } from '../../../../_services/hsn.service';
import { Role } from "../../../../_models/role";
import { ScriptLoaderService } from '../../../../../../../_services/script-loader.service';
import { Helpers } from "../../../../../../../helpers";
import { Hsn } from "../../../../_models/hsn";


@Component({
  selector: "app-hsn-list",
  templateUrl: "./hsn-list.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class HsnListComponent implements OnInit {

  hsnForm: any;
  hsnObj:any;
  params: number;
  hsnList=[];
  pageSize=50;
  page=1;
  totalCount=0;
  search='';
  toggleDiv=false;
  states=[];
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private hsnService: HsnService,
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
    this.hsnObj ={
      id: 0,
      hsnCode:'',
      gst: ''
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
  getHsnsList() {
    this.hsnService.getAllHsns(this.pageSize,this.page,this.search).subscribe(
      results => {
        this.hsnList = results.data;
        console.log('this.hsnList', this.hsnList);
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
    this.getHsnsList();
  }

  gethsnById(id){
  this.hsnService.getHsnById(id).subscribe(
    results => {
      this.hsnObj = results;
      console.log('this.hsnList', this.hsnObj);
    },
    error => {
      this.globalErrorHandler.handleError(error);
    });
}

  onSubmit({ value, valid }: { value: any, valid: boolean }) {
      this.saveHsn(this.hsnObj);
  }

  saveHsn(value) {
    Helpers.setLoading(true);
    if (this.params) {
      this.hsnService.updateHsn(value)
        .subscribe(
        results => {
         this.getHsnsList(); 
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
      this.hsnService.createHsn(value)
        .subscribe(
        results => {
         this. getHsnsList();
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

  onEditClick(hsn: Hsn) {
     this.hsnService.perPage = this.pageSize;
     this.hsnService.currentPos = this.page;
    this.gethsnById(hsn.id);
    this.params=hsn.id;
    // this.roleService.currentPageNumber = this.currentPageNumber;
   // this.router.navigate(['/features/master/hsn/edit', hsn.id]);
   this.toggleDiv=true;
  }

  onDelete(hsn: Hsn) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        this.hsnService.deleteHsn(hsn.id).subscribe(
          results => {
            this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: results.message  });
            this.getHsnsList();
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