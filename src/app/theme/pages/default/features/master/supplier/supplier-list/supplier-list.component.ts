import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

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
  supplierList=[];
  pageSize=50;
  page=1;
  totalCount=0;
  search='';

  constructor(private router: Router,
    private supplierService: SupplierService,
    private globalErrorHandler: GlobalErrorHandler,
    private confirmationService: ConfirmationService,
    private messageService: MessageService) {
  }

  ngOnInit() {
   // this.getSuppliersList();
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
