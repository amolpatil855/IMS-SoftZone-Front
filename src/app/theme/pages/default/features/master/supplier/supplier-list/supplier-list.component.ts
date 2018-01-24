import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash/index';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { ConfirmationService, DataTableModule, LazyLoadEvent } from 'primeng/primeng';
import { GlobalErrorHandler } from '../../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../../_services/message.service';
import { SupplierService } from '../../../../_services/supplier.service';
import { Role } from "../../../../_models/role";
import { ScriptLoaderService } from '../../../../../../../_services/script-loader.service';
import { Helpers } from "../../../../../../../helpers";
import { Supplier } from "../../../../_models/supplier";

@Component({
  selector: "app-supplier-list",
  templateUrl: "./supplier-list.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class SupplierListComponent implements OnInit {
  supplierForm: any;
  supplierObj:any;
  params: number;
  supplierList=[];
  pageSize=50;
  page=1;
  totalCount=0;
  search='';
  toggleDiv=false;
  states=[];
  isFormSubmitted:boolean;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private supplierService: SupplierService,
    private globalErrorHandler: GlobalErrorHandler,
    private confirmationService: ConfirmationService,
    private messageService: MessageService) {
  }

  ngOnInit() {
   // this.getSuppliersList();
   this.states.push({ label: '--Select--', value: '0' });
   this.states.push({ label: 'Maharashtra', value: 'Maharashtra' });
   this.states.push({ label: 'MP', value: 'MP' });
    this.route.params.forEach((params: Params) => {
      this.params = params['supplierId'];
    });

this.newRecord();
  }

newRecord(){
  this.params=null;
  this.supplierObj ={
    id: 0,
    code:'',
    name: '',
    firmName:'',
    description: '',
    gstin: '',
    email: '',
    phone:'',
    accountPersonName:'',
    accountPersonEmail: '',
    accountPersonPhone: '',
    warehousePersonName: '',
    warehousePersonEmail: '',
    warehousePersonPhone:'',
    dispatchPersonName: '',
    dispatchPersonEmail:'',
    dispatchPersonPhone: '',
    MstSupplierAddresses:[],
};

this.supplierObj.MstSupplierAddresses.push({ // <-- the child FormGroup
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
    this.supplierObj.MstSupplierAddresses.push(newaddressObj);
  }
  clearAddress(supAddIndex){
    this.supplierObj.MstSupplierAddresses.splice(supAddIndex, 1);
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
  getSuppliersList() {
    this.supplierService.getAllSuppliers(this.pageSize,this.page,this.search).subscribe(
      results => {
        this.supplierList = results.data;
        console.log('this.supplierList', this.supplierList);
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
    this.getSuppliersList();
  }


getsuplierById(id){
  this.supplierService.getSupplierById(id).subscribe(
    results => {
      console.log('results.mstSupplierAddressDetails', results);
      this.supplierObj = results;
      this.supplierObj.MstSupplierAddresses=results.mstSupplierAddresses;
      delete this.supplierObj['mstSupplierAddresses'];   
      _.forEach(this.supplierObj.MstSupplierAddresses, function(value) {
        value.contRoleId= Math.floor(Math.random() * 2000);
      });
      console.log('this.supplierList', this.supplierObj);
    },
    error => {
      this.globalErrorHandler.handleError(error);
    });
}

  
  onSubmit({ value, valid }: { value: any, valid: boolean }) {
      this.isFormSubmitted=true;
    _.forEach(this.supplierObj.MstSupplierAddresses, function(addressObj) {
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
      else
      {
        addressObj.invalidState=false;
      }
      if(!addressObj.city){
        addressObj.invalidCity=true;
        valid=false;
      }else
      {
        addressObj.invalidCity=false;
      }
      if(!addressObj.pin){
        addressObj.invalidPin=true;
        valid=false;
      }else
      {
        addressObj.invalidPin=false;
      }
    });

    if(valid)
      this.saveSupplier(this.supplierObj);
  }

  // onAddSupplierAddress() {
  //   for(var i=0; i<1; i++) {
  //     <FormArray>this.supplierForm.get('MstSupplierAddresses').push(new FormControl());
  //   }
  // }

  saveSupplier(value) {
    Helpers.setLoading(true);
    if (this.params) {
      this.supplierService.updateSupplier(value)
        .subscribe(
        results => {
         this. getSuppliersList(); 
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
      this.supplierService.createSupplier(value)
        .subscribe(
        results => {
         this. getSuppliersList();
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

  onEditClick(supplier: Supplier) {
     this.supplierService.perPage = this.pageSize;
     this.supplierService.currentPos = this.page;
    this. getsuplierById(supplier.id);
    this.params=supplier.id;
    // this.roleService.currentPageNumber = this.currentPageNumber;
   // this.router.navigate(['/features/master/supplier/edit', supplier.id]);
   this.toggleDiv=true;
  }

  onDelete(supplier: Supplier) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        this.supplierService.deleteSupplier(supplier.id).subscribe(
          results => {
            this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: results.message  });
            this.getSuppliersList();
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
