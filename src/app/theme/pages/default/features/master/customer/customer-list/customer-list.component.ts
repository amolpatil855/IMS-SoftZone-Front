import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash/index';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { ConfirmationService, DataTableModule, LazyLoadEvent } from 'primeng/primeng';
import { GlobalErrorHandler } from '../../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../../_services/message.service';
import { CustomerService } from "../../../../_services/customer.service";
import { Customer } from "../../../../_models/customer";
import { ScriptLoaderService } from '../../../../../../../_services/script-loader.service';
import { Helpers } from "../../../../../../../helpers";
@Component({
  selector: "app-customer-list",
  templateUrl: "./customer-list.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class CustomerListComponent implements OnInit {
  customerForm: FormGroup;
  customerObj:any;
  params: number;
  customerList = [];
  pageSize=50;
  page=1;
  totalCount=0;
  search='';
  states=[];
  toggleDiv=false;
  isFormSubmitted:boolean;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService,
    private globalErrorHandler: GlobalErrorHandler,
    private confirmationService: ConfirmationService,
    private messageService: MessageService) {
  }

  ngOnInit() {
    this.states.push({ label: '--Select--', value: '0' });
   this.states.push({ label: 'Maharashtra', value: 'Maharashtra' });
   this.states.push({ label: 'MP', value: 'MP' });
  this.route.params.forEach((params: Params) => {
      this.params = params['customerId'];
    });
    this.newRecord();
  }
  newRecord(){
  this.customerObj ={
    id: 0,
    code:'',
    name: '',
    nickName:'',
    email: '',
    alternateEmail1: '',
    alternateEmail2: '',
    phone:'',
    alternatePhone1:'',
    alternatePhone2: '',
    isWholesaleCustomer: false,
    pan: '',
    accountPersonName: '',
    accountPersonPhone: '',
    accountPersonEmail:'',
    gstin: '',
    mstCustomerAddresses:[],
};

this.customerObj.mstCustomerAddresses.push({ // <-- the child FormGroup
  id: 0,
  supplierId:0,
  address: '',
  city:'',
  state:'',
  pin: '',
  contRoleId: Math.floor(Math.random() * 2000),
});
}

  addNewAddress(supAdd){
    var newaddressObj ={ // <-- the child FormGroup
      id: 0,
      supplierId:0,
      address: '',
      city:'',
      state:'',
      pin: '',
      contRoleId: Math.floor(Math.random() * 2000),
    };
    this.customerObj.mstCustomerAddresses.push(newaddressObj);
  }
  clearAddress(supAddIndex){
    this.customerObj.mstCustomerAddresses.splice(supAddIndex, 1);
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

  getCustomersList() {
    this.customerService.getAllCustomers(this.pageSize,this.page,this.search).subscribe(
      results => {
        this.customerList = results.data;
        console.log('this.customerList', this.customerList);
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
    this.getCustomersList();
  }

  onSubmit({ value, valid }: { value: any, valid: boolean }) {
    this.isFormSubmitted=true;
      _.forEach(this.customerObj.mstCustomerAddresses, function(addressObj) {
      if(!addressObj.address){
        addressObj.invalidAdd=true;
        valid=false;
      }
      else
      {
        addressObj.invalidAdd=false;
      }
      if(!addressObj.state){
        addressObj.invalidState=true;
        valid=false;
      }
      {
        addressObj.invalidState=false;
      }
      if(!addressObj.city){
        addressObj.invalidCity=true;
        valid=false;
      }
      {
        addressObj.invalidCity=false;
      }
      if(!addressObj.pin){
        addressObj.invalidPin=true;
        valid=false;
      }
      {
        addressObj.invalidPin=false;
      }
    });
    if(valid)
      this.saveCustomer(this.customerObj);
  }
  
  saveCustomer(value) {
    Helpers.setLoading(true);
    if (this.params) {
      this.customerService.updateCustomer(value)
        .subscribe(
        results => {
          this.getCustomersList();
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
      this.customerService.createCustomer(value)
        .subscribe(
        results => {
          this.getCustomersList();
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
  getCustomerById(id){
  this.customerService.getCustomerById(id).subscribe(
    results => {
      this.customerObj = results;
      this.customerObj.mstCustomerAddresses=results.mstCustomerAddresses;
      //delete this.customerObj['mstCustomerAddresses'];
    },
    error => {
      this.globalErrorHandler.handleError(error);
    });
}
  onEditClick(customer: Customer) {
     this.customerService.perPage = this.pageSize;
     this.customerService.currentPos = this.page;
    this.getCustomerById(customer.id);
    this.params=customer.id;
   this.toggleDiv=true;
  }

  onDelete(customer: Customer) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        this.customerService.deleteCustomer(customer.id).subscribe(
          results => {
            this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: results.message  });
            this.getCustomersList();
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