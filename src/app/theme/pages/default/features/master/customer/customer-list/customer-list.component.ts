import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

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
  customerList = [];
  pageSize=50;
  page=1;
  totalCount=0;
  search='';

  constructor(private router: Router,
    private customerService: CustomerService,
    private globalErrorHandler: GlobalErrorHandler,
    private confirmationService: ConfirmationService,
    private messageService: MessageService) {
  }

  ngOnInit() {
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

  onEditClick(customer: Customer) {
     this.customerService.perPage = this.pageSize;
     this.customerService.currentPos = this.page;
    // this.roleService.currentPageNumber = this.currentPageNumber;
    this.router.navigate(['/features/master/customer/edit', customer.id]);
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
