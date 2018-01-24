import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash/index';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { ConfirmationService, DataTableModule, LazyLoadEvent } from 'primeng/primeng';
import { GlobalErrorHandler } from '../../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../../_services/message.service';
import { MatThicknessService } from '../../../../_services/matThickness.service';
import { Role } from "../../../../_models/role";
import { ScriptLoaderService } from '../../../../../../../_services/script-loader.service';
import { Helpers } from "../../../../../../../helpers";
import { MatThickness } from "../../../../_models/matThickness";

@Component({
  selector: "app-matThickness-list",
  templateUrl: "./matThickness-list.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class MatThicknessListComponent implements OnInit {

  matThicknessForm: any;
  matThicknessObj:any;
  params: number;
  matThicknessList=[];
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
    private matThicknessService: MatThicknessService,
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
    this.matThicknessObj ={
      id: 0,
      thicknessCode:'',
      size: ''
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
  getMatThicknesssList() {
    this.matThicknessService.getAllMatThicknesss(this.pageSize,this.page,this.search).subscribe(
      results => {
        this.matThicknessList = results.data;
        console.log('this.matThicknessList', this.matThicknessList);
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
    this.getMatThicknesssList();
  }

  getMatThicknessById(id){
  this.matThicknessService.getMatThicknessById(id).subscribe(
    results => {
      this.matThicknessObj = results;
      console.log('this.matThicknessList', this.matThicknessObj);
    },
    error => {
      this.globalErrorHandler.handleError(error);
    });
}

  onSubmit({ value, valid }: { value: any, valid: boolean }) {
      this.saveMatThickness(this.matThicknessObj);
  }

  saveMatThickness(value) {
    Helpers.setLoading(true);
    if (this.params) {
      this.matThicknessService.updateMatThickness(value)
        .subscribe(
        results => {
         this.getMatThicknesssList(); 
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
      this.matThicknessService.createMatThickness(value)
        .subscribe(
        results => {
         this. getMatThicknesssList();
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

  onEditClick(matThickness: MatThickness) {
     this.matThicknessService.perPage = this.pageSize;
     this.matThicknessService.currentPos = this.page;
     this.getMatThicknessById(matThickness.id);
     this.params=matThickness.id;
     this.toggleDiv=true;
  }

  onDelete(matThickness: MatThickness) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        this.matThicknessService.deleteMatThickness(matThickness.id).subscribe(
          results => {
            this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: results.message  });
            this.getMatThicknesssList();
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