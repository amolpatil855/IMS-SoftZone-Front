import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash/index';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { ConfirmationService, DataTableModule, LazyLoadEvent, SelectItem } from 'primeng/primeng';
import { GlobalErrorHandler } from '../../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../../_services/message.service';
import { AccessoryService } from '../../../../_services/accessory.service';
import { Role } from "../../../../_models/role";
import { ScriptLoaderService } from '../../../../../../../_services/script-loader.service';
import { Helpers } from "../../../../../../../helpers";
import { Accessory } from "../../../../_models/accessory";
import { SupplierService } from '../../../../_services/supplier.service';
@Component({
  selector: "app-accessory-list",
  templateUrl: "./accessory-list.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class AccessoryListComponent implements OnInit {
  accessoryForm: any;
  accessoryObj: any;
  params: number;
  accessoryList = [];
  supplierCodeList = [];
  categoryList: SelectItem[];
  selectedUnitOfMeasure = null;
  selectedHsn = null;
  selectedSupplier = null;
  unitOfMeasureList = [];
  hsnList = [];
  pageSize = 50;
  page = 1;
  totalCount = 0;
  search = '';
  toggleDiv = false;
  disabled: boolean = false;
  isFormSubmitted: boolean = false;
  tableEmptyMesssage = 'Loading...';
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accessoryService: AccessoryService,
    private supplierService: SupplierService,
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
    this.accessoryObj = {
      categoryId: null,
      name: '',
      itemCode: '',
      supplierId: null,
      hsnId: null,
      uomId: null,
      sellingRate: null,
      purchaseRate: null,
      size: '',
      description: '',
    };
    this.selectedUnitOfMeasure = null;
    this.selectedHsn = null;
    this.selectedSupplier = null;
    this.disabled = false;
  }

  toggleButton() {
    this.toggleDiv = !this.toggleDiv;
    if (this.toggleDiv && !this.params) {
      this.disabled = false;
      this.isFormSubmitted = false;
      this.newRecord();
    }

  }
  onCancel() {
    this.toggleDiv = false;
    this.disabled = false;
    this.newRecord();
  }
  getAccessorysList() {
    Helpers.setLoading(true);
    this.accessoryService.getAllAccessories(this.pageSize, this.page, this.search).subscribe(
      results => {
        this.accessoryList = results.data;
        this.totalCount = results.totalCount;
        if (this.totalCount == 0) {
          this.tableEmptyMesssage = "No Records Found";
        }
        Helpers.setLoading(false);
      },
      error => {
        this.tableEmptyMesssage = "No Records Found";
        this.globalErrorHandler.handleError(error);
        Helpers.setLoading(false);
      });
  }

  getUnitOfMeasureLookup() {
    Helpers.setLoading(true);
    this.accessoryService.getUnitOfMeasureLookup().subscribe(
      results => {
        this.unitOfMeasureList = results;
        this.unitOfMeasureList.unshift({ label: '--Select--', value: null });
        Helpers.setLoading(false);
      },
      error => {
        this.globalErrorHandler.handleError(error);
        Helpers.setLoading(false);
      });
  }

  getHsnLookUp() {
    Helpers.setLoading(true);
    this.accessoryService.getHsnLookUp().subscribe(
      results => {
        this.hsnList = results;
        this.hsnList.unshift({ label: '--Select--', value: null });
        Helpers.setLoading(false);
      },
      error => {
        this.globalErrorHandler.handleError(error);
        Helpers.setLoading(false);
      });
  }

  getSupplierCodeList() {
    this.supplierService.getSupplierLookUp().subscribe(
      results => {
        this.supplierCodeList = results;
        this.supplierCodeList.unshift({ label: '--Select--', value: null });
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
    this.pageSize = event.rows;
    this.page = event.first / event.rows;
    this.search = event.globalFilter;
    this.getAccessorysList();
    this.getUnitOfMeasureLookup();
    this.getHsnLookUp();
    this.getSupplierCodeList();
  }

  getAccessoryById(id) {
    Helpers.setLoading(true);
    this.accessoryService.getAccessoryById(id).subscribe(
      results => {
        this.accessoryObj = results;
        this.selectedUnitOfMeasure = this.accessoryObj.uomId;
        this.selectedHsn = this.accessoryObj.hsnId;
        this.selectedSupplier = this.accessoryObj.supplierId;
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
      this.accessoryObj.hsnId = value.hsnId;
      this.accessoryObj.uomId = value.uomId;
      if(!this.accessoryObj.id)
      this.accessoryObj.supplierId = value.supplierId;
    this.saveAccessory(this.accessoryObj);
  }

  saveAccessory(value) {
    Helpers.setLoading(true);
    if (this.params) {
      this.accessoryService.updateAccessory(value)
        .subscribe(
        results => {
          this.getAccessorysList();
          this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: results.message });
          this.isFormSubmitted = false;
          this.newRecord();
          Helpers.setLoading(false);
        },
        error => {
          this.globalErrorHandler.handleError(error);
          Helpers.setLoading(false);
        });
    } else {
      this.accessoryService.createAccessory(value)
        .subscribe(
        results => {
          this.getAccessorysList();
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

  onEditClick(accessory: Accessory) {
    this.accessoryService.perPage = this.pageSize;
    this.accessoryService.currentPos = this.page;
    this.getAccessoryById(accessory.id);
    this.params = accessory.id;
    this.toggleDiv = true;
    this.disabled = true;
    this.isFormSubmitted = false;
    window.scrollTo(0, 0);
  }

  onDelete(accessory: Accessory) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        this.accessoryService.deleteAccessory(accessory.id).subscribe(
          results => {
            this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: results.message });
            this.getAccessorysList();
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
