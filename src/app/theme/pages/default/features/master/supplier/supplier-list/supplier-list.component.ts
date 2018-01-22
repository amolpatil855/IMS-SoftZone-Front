import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';

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
  supplierForm: FormGroup;
  params: number;
  supplierList=[];
  pageSize=50;
  page=1;
  totalCount=0;
  search='';
  toggleDiv=false;

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
    this.route.params.forEach((params: Params) => {
      this.params = params['supplierId'];
    });

   this.supplierForm = this.formBuilder.group({
        id: 0,
        code: ['', [Validators.required]],
        name: ['', [Validators.required]],
        firmName: ['', [Validators.required]],
        description: ['', [Validators.required]],
        gstin: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.pattern('^[0-9]{10,15}$$')]],
        accountPersonName: ['', [Validators.required]],
        accountPersonEmail: ['', [Validators.required, Validators.email]],
        accountPersonPhone: ['', [Validators.pattern('^[0-9]{10,15}$$')]],
        warehousePersonName: ['', [Validators.required]],
        warehousePersonEmail: ['', [Validators.required, Validators.email]],
        warehousePersonPhone: ['', [Validators.pattern('^[0-9]{10,15}$$')]],
        dispatchPersonName: ['', [Validators.required]],
        dispatchPersonEmail: ['', [Validators.required, Validators.email]],
        dispatchPersonPhone: ['', [Validators.pattern('^[0-9]{10,15}$$')]],
        mstSupplierAddressDetails: this.formBuilder.array([{ // <-- the child FormGroup
          id: 0,
          supplierId:'',
          address: '',
          city: '',
          state: '',
          pin: ''
        }]),
    });
  }
  toggleButton(){
    this.toggleDiv = true;
  }
  onCancel(){
    this.toggleDiv = false;
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

  onSubmit({ value, valid }: { value: any, valid: boolean }) {
      
      let params = {
        id: 0,
        code: '111',
        name: value.name,
        firmName: value.firmName,
        description: value.description,
        gstin: value.gstin,
        email: value.email,
        phone: value.phone,
        accountPersonName: value.accountPersonName,
        accountPersonEmail: value.accountPersonEmail,
        accountPersonPhone: value.accountPersonPhone,
        warehousePersonName: value.warehousePersonName,
        warehousePersonEmail: value.warehousePersonEmail,
        warehousePersonPhone: value.warehousePersonPhone,
        dispatchPersonName: value.dispatchPersonName,
        dispatchPersonEmail: value.dispatchPersonEmail,
        dispatchPersonPhone: value.dispatchPersonPhone,
        mstSupplierAddressDetails: { // <-- the child FormGroup
          id: 0,
          supplierId: this.params,
          address: value.address,
          city: value.city,
          state: value.state,
          pin: value.pin
        }
      }
      this.saveUser(params);
  }

  // onAddSupplierAddress() {
  //   for(var i=0; i<1; i++) {
  //     <FormArray>this.supplierForm.get('mstSupplierAddressDetails').push(new FormControl());
  //   }
  // }

  saveUser(value) {
    Helpers.setLoading(true);
    if (this.params) {
      this.supplierService.updateSupplier(value)
        .subscribe(
        results => {
          this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: results.message });
          Helpers.setLoading(false);
          this.router.navigate(['/features/master/supplier/list']);
        },
        error => {
          this.globalErrorHandler.handleError(error);
          Helpers.setLoading(false);
        });
    } else {
      this.supplierService.createSupplier(value)
        .subscribe(
        results => {
          this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: results.message });
          Helpers.setLoading(false);
          this.router.navigate(['/features/master/supplier/list']);
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
    // this.roleService.currentPageNumber = this.currentPageNumber;
    this.router.navigate(['/features/master/supplier/edit', supplier.id]);
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
