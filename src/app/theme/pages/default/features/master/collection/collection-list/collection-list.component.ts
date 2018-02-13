import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash/index';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { ConfirmationService, DataTableModule, LazyLoadEvent } from 'primeng/primeng';
import { GlobalErrorHandler } from '../../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../../_services/message.service';
import { CollectionService } from '../../../../_services/collection.service';
import { Role } from "../../../../_models/role";
import { ScriptLoaderService } from '../../../../../../../_services/script-loader.service';
import { Helpers } from "../../../../../../../helpers";
import { Collection } from "../../../../_models/collection";
import { SupplierService } from '../../../../_services/supplier.service';
import { CommonService } from '../../../../_services/common.service';
@Component({
  selector: "app-Collection-list",
  templateUrl: "./collection-list.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class CollectionListComponent implements OnInit {
  collectionForm: any;
  collectionObj: any;
  params: number;
  collectionList = [];
  supplierCodeList = [];
  categoriesCodeList = [];
  pageSize = 50;
  page = 1;
  totalCount = 0;
  search = '';
  toggleDiv = false;
  disabled: boolean = false;
  states = [];
  isFormSubmitted: boolean = false;
  tableEmptyMesssage = 'Loading...';
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private supplierService: SupplierService,
    private collectionService: CollectionService,
    private globalErrorHandler: GlobalErrorHandler,
    private confirmationService: ConfirmationService,
    private commonService: CommonService,
    private messageService: MessageService) {
  }

  ngOnInit() {
    // this.getCollectionList();
    this.states.push({ label: '--Select--', value: '0' });


    this.newRecord();
  }

  newRecord() {
    this.params = null;
    this.collectionObj = new Collection();
    this.collectionForm = this.formBuilder.group({
      id: 0,
      collectionCode: ['', [Validators.required]],
      collectionName: ['', [Validators.required]],
      purchaseDiscount: ['', [Validators.required]],
      categoryId: [null, [Validators.required]],
      supplierId: [null, [Validators.required]],
      manufacturerName: ['', [Validators.required]],
      description: [''],
    });
    this.collectionObj.id = 0;
    this.getCategoryCodeList();
    this.getSupplierCodeList();
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

  getCategoryCodeList() {
    this.commonService.getCategoryCodes().subscribe(
      results => {
        this.categoriesCodeList = results;
        this.categoriesCodeList.unshift({ label: '--Select--', value: null });
      },
      error => {
        this.globalErrorHandler.handleError(error);
      });
  }



  getCollectionList() {
    this.collectionService.getAllCollections(this.pageSize, this.page, this.search).subscribe(
      results => {
        this.collectionList = results.data;
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
    this.getCollectionList();
  }


  getsuplierById(id) {
    Helpers.setLoading(true);
    this.collectionService.getCollectionById(id).subscribe(
      results => {
        this.collectionObj = results;
        this.collectionForm.setValue({
          id: results.id,
          collectionCode: results.collectionCode,
          collectionName: results.collectionName,
          purchaseDiscount: results.purchaseDiscount,
          categoryId: results.categoryId,
          supplierId: results.supplierId,
          manufacturerName: results.manufacturerName,
          description: results.description,
        });
        console.log('this.collectionList', this.collectionObj);
        Helpers.setLoading(false);
      },
      error => {
        this.globalErrorHandler.handleError(error);
        Helpers.setLoading(false);
      });
  }


  onSubmit({ value, valid }: { value: any, valid: boolean }) {
    this.isFormSubmitted = true;
    if (valid)
      this.saveCollection(value);
  }

  saveCollection(value) {
    Helpers.setLoading(true);
    if (this.params) {
      this.collectionService.updateCollection(value)
        .subscribe(
        results => {
          this.getCollectionList();
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
      // value.id=this.params;
      this.collectionService.createCollection(value)
        .subscribe(
        results => {
          this.getCollectionList();
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

  onEditClick(Collection: Collection) {
    this.collectionService.perPage = this.pageSize;
    this.collectionService.currentPos = this.page;
    this.getsuplierById(Collection.id);
    this.params = Collection.id;
    // this.roleService.currentPageNumber = this.currentPageNumber;
    // this.router.navigate(['/features/master/Collection/edit', Collection.id]);
    this.toggleDiv = true;
    this.disabled = true;
    this.isFormSubmitted = false;
    window.scrollTo(0, 0);
  }

  onDelete(Collection: Collection) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        this.collectionService.deleteCollection(Collection.id).subscribe(
          results => {
            this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: results.message });
            this.getCollectionList();
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
