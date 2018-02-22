import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash/index';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { ConfirmationService, DataTableModule, LazyLoadEvent } from 'primeng/primeng';
import { GlobalErrorHandler } from '../../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../../_services/message.service';
import { CourierService } from '../../../../_services/courier.service';
import { ScriptLoaderService } from '../../../../../../../_services/script-loader.service';
import { Helpers } from "../../../../../../../helpers";
import { Courier } from "../../../../_models/courier";

@Component({
  selector: "app-courier-list",
  templateUrl: "./courier-list.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class CourierListComponent implements OnInit {

  isFormSubmitted: boolean = false;
  courierForm: any;
  courierObj: any;
  params: number;
  courierList = [];
  pageSize = 50;
  page = 1;
  totalCount = 0;
  search = '';
  toggleDiv = false;
  tableEmptyMesssage = 'Loading...';
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private courierService: CourierService,
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

  newRecord() {
    this.params = null;
    this.courierObj = {
      id: 0,
      name: '',
      phone: '',
      mobile: '',
      email: '',
      address: '',
      pin: ''
    };
  }

  toggleButton() {
    this.toggleDiv = !this.toggleDiv;
    if (this.toggleDiv && !this.params) {
      this.isFormSubmitted = false;
      this.newRecord();
    }

  }
  onCancel() {
    this.toggleDiv = false;
    this.newRecord();
  }
  getCouriersList() {
    this.courierService.getAllCouriers(this.pageSize, this.page, this.search).subscribe(
      results => {
        this.courierList = results.data;
        this.totalCount = results.totalCount;
        if (this.totalCount == 0) {
          this.tableEmptyMesssage = "No Records Found";
        }
      },
      error => {
        this.tableEmptyMesssage = "No Records Found";
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
    this.pageSize = event.rows;
    this.page = event.first/event.rows;
    this.search = event.globalFilter;
    this.getCouriersList();
  }

  getCourierById(id) {
    Helpers.setLoading(true);
    this.courierService.getCourierById(id).subscribe(
      results => {
        this.courierObj = results;
        console.log('this.courierList', this.courierObj);
        Helpers.setLoading(false);
      },
      error => {
        this.globalErrorHandler.handleError(error);
        Helpers.setLoading(false);
      });
  }

  onSubmit({ value, valid }: { value: any, valid: boolean }) {
    this.isFormSubmitted = true;
    if (!valid)
      return;
    this.saveCourier(this.courierObj);
  }

  saveCourier(value) {
    Helpers.setLoading(true);
    if (this.params) {
      this.courierService.updateCourier(value)
        .subscribe(
        results => {
          this.getCouriersList();
          this.toggleDiv = false;
          this.params = null;
          this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: results.message });
          Helpers.setLoading(false);

        },
        error => {
          this.globalErrorHandler.handleError(error);
          Helpers.setLoading(false);
        });
    } else {
      this.courierService.createCourier(value)
        .subscribe(
        results => {
          this.getCouriersList();
          this.toggleDiv = false;
          this.params = null;
          this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: results.message });
          Helpers.setLoading(false);

        },
        error => {
          this.globalErrorHandler.handleError(error);
          Helpers.setLoading(false);
        });
    }
  }

  onEditClick(courier: Courier) {
    this.courierService.perPage = this.pageSize;
    this.courierService.currentPos = this.page;
    this.getCourierById(courier.id);
    this.params = courier.id;
    this.toggleDiv = true;
    this.isFormSubmitted = false;
    window.scrollTo(0, 0);
  }

  onDelete(courier: Courier) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        this.courierService.deleteCourier(courier.id).subscribe(
          results => {
            this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: results.message });
            this.getCouriersList();
            this.toggleDiv = false;
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
