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
import { CommonService } from '../../../../_services/common.service';
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
  isHide = false;
  isFormSubmitted:boolean = false;
  tableEmptyMesssage='Loading...';
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService,
    private globalErrorHandler: GlobalErrorHandler,
    private confirmationService: ConfirmationService,
    private commonService: CommonService,
    private messageService: MessageService) {
  }

  ngOnInit() {
    this.states=this.commonService.states;
    this.route.params.forEach((params: Params) => {
        this.params = params['customerId'];
    });
    this.newRecord();
  }
  newRecord(){
  this.params = null;
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
    MstCustomerAddresses:[],
  };

  this.customerObj.MstCustomerAddresses.push({ // <-- the child FormGroup
    id: 0,
    customerId:0,
    addressLine1: '',
    addressLine2: '',
    city:'',
    state: '',
    country: '',
    pin: '',
    gstin: 0,
    isPrimary: false,
    contRoleId: Math.floor(Math.random() * 2000),
  });
  this.isFormSubmitted = false;
}

  addNewAddress(supAdd){
    var newaddressObj ={ // <-- the child FormGroup
      id: 0,
      customerId:0,
      addressLine1: '',
      addressLine2: '',
      city:'',
      state: '',
      country: '',
      pin: '',
      gstin: 0,
      isPrimary: false,
      contRoleId: Math.floor(Math.random() * 2000),
    };
    this.customerObj.MstCustomerAddresses.push(newaddressObj);
  }

  onClickPrimary(row){
    this.customerObj.MstCustomerAddresses.forEach(function(value){
      value.isPrimary=false;
    })
    row.isPrimary=true;
   }

  clearAddress(supAddIndex){
    if(this.customerObj.MstSupplierAddresses[supAddIndex].isPrimary){
    }else{
      this.customerObj.MstCustomerAddresses.splice(supAddIndex, 1);
    }     
  }

  toggleButton(){
    this.toggleDiv = !this.toggleDiv;
    if(this.toggleDiv && !this.params){
      this.newRecord();
    }

  }
  onCancel(){
    this.toggleDiv = false;
    this.newRecord();
  }

  getCustomersList() {
    this.customerService.getAllCustomers(this.pageSize,this.page,this.search).subscribe(
      results => {
        this.customerList = results.data;
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
      _.forEach(this.customerObj.MstCustomerAddresses, function(addressObj) {
      if(!addressObj.addressLine1){
        addressObj.invalidAddressLine1=true;
        valid=false;
      }
      else
      {
        addressObj.invalidAdd=false;
      }
      if(!addressObj.addressLine2){
        addressObj.invalidAddressLine2=true;
        valid=false;
      }
      else
      {
        addressObj.invalidAdd=false;
      }
      if(!addressObj.gstin){
        addressObj.invalidGstin=true;
        valid=false;
      }
      else
      {
        addressObj.invalidGstin=false;
      }
      if(!addressObj.state){
        addressObj.invalidState=true;
        valid=false;
      }
      else{
        addressObj.invalidState=false;
      }
      if(!addressObj.city){
        addressObj.invalidCity=true;
        valid=false;
      }
      else{
        addressObj.invalidCity=false;
      }
      if(!addressObj.pin){
        addressObj.invalidPin=true;
        valid=false;
      }
      else{
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
      if(this.customerObj.isWholesaleCustomer){
        this.isHide = true;
      }
      this.customerObj.MstCustomerAddresses=results.mstCustomerAddresses;
      delete this.customerObj['mstCustomerAddresses'];
       _.forEach(this.customerObj.MstCustomerAddresses, function(value) {
        value.contRoleId= Math.floor(Math.random() * 2000);
      });
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
     this.isFormSubmitted = false;
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