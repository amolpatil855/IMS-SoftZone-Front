import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash/index';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { ConfirmationService, DataTableModule, LazyLoadEvent, SelectItem } from 'primeng/primeng';
import { GlobalErrorHandler } from '../../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../../_services/message.service';
import { TrnPurchaseOrderService } from '../../../../_services/trnPurchaseOrder.service';
import { ScriptLoaderService } from '../../../../../../../_services/script-loader.service';
import { Helpers } from "../../../../../../../helpers";
import { TrnPurchaseOrder } from "../../../../_models/trnPurchaseOrder";
import { SupplierService } from '../../../../_services/supplier.service';
import { CommonService } from '../../../../_services/common.service';
import { CollectionService } from '../../../../_services/collection.service';
@Component({
  selector: "app-trnPurchaseOrder-add-edit",
  templateUrl: "./trnPurchaseOrder-add-edit.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class TrnPurchaseOrderAddEditComponent implements OnInit {
  trnPurchaseOrderForm: any;
  params: number;
  trnPurchaseOrderList = [];
  pageSize = 50;
  page = 1;
  totalCount = 0;
  search = '';
  tableEmptyMesssage = 'Loading...';
  supplierCodeList = [];
  locationList = [];
  trnPurchaseOrderObj: TrnPurchaseOrder;
  collectionList = [];
  categoriesCodeList = [];
  serialNumberList = [];
  slectedCategory = null;
  slectedCollection = null;
  itemDetails = [];
  serialNumber = null;
  orderQuantity = null;
  orderType = null;
  locationObj = null;
  length = null;
  width = null;
  sizecode = null;
  isFormSubmitted = false;
  slectedCategoryError = false;
  slectedCollectionError = false;
  serialNumberError = false;
  lengthError = false;
  widthError = false;
  orderQuantityError = false;
  courierList = [];
  courierModeList = [];
  matSizeList=[];
  foamSizeList=[];
  matsizeId=null;
  foamSizeId=null;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private supplierService: SupplierService,
    private commonService: CommonService,
    private trnPurchaseOrderService: TrnPurchaseOrderService,
    private globalErrorHandler: GlobalErrorHandler,
    private confirmationService: ConfirmationService,
    private collectionService: CollectionService,
    private messageService: MessageService) {
  }

  ngOnInit() {
    this.trnPurchaseOrderObj = new TrnPurchaseOrder();
    this.getSupplierCodeList();
    this.getLocationList();
    this.getCategoryCodeList();
    this.getCourierList();
    let today = new Date();
    this.locationObj = {};

    this.trnPurchaseOrderObj.orderDate=  today  ;
    // this.newItem();
    this.courierModeList.push({ label: '--Select--', value: null });
    this.courierModeList.push({ label: 'Surface', value: 'Surface' });
    this.courierModeList.push({ label: 'Air', value: 'Air' });
  }

  newItem() {
    this.slectedCategory = null;
    this.slectedCollection = null;
    this.serialNumber = null;
    this.orderQuantity = null;
    this.orderType = null;
    this.length = null;
    this.width = null;
    this.sizecode = null;
  }

  addItemToList() {

    if (!this.slectedCategory)
      this.slectedCategoryError = true;
    else
      this.slectedCategoryError = false;

    if (!this.slectedCollection)
      this.slectedCollectionError = true;
    else
      this.slectedCollectionError = false;

    if (!this.serialNumber)
      this.serialNumberError = true;
    else
      this.serialNumberError = false;


    if (this.slectedCollection == 4 && this.serialNumber == -1 && !this.length)
      this.lengthError = true;
    else
      this.lengthError = false;

    if (this.slectedCollection == 4 && this.serialNumber == -1 && !this.width)
      this.widthError = true;
    else
      this.widthError = false;

    if (!this.orderQuantity)
      this.orderQuantityError = true;
    else
      this.orderQuantityError = false;
    if(this.orderQuantityError || this.widthError || this.lengthError || this.serialNumberError || this.slectedCollectionError ||  this.slectedCategoryError){
      return;
    }

    let catObj = _.find(this.categoriesCodeList, ['value', this.slectedCategory]);
    let collObj = _.find(this.collectionList, ['value', this.slectedCollection]);
    let itemObj = {
      categotryId: this.slectedCategory,
      categotryName: catObj ? catObj.label : '',
      collectionName: collObj ? catObj.label : '',
      collectionid: this.slectedCollection,
      serialno: this.serialNumber,
      quantity: this.orderQuantity,
      orderType: this.orderType,
      length: null,
      width: null,
      sizecode: null
    };
    this.itemDetails.push(itemObj);
  }

  onCancelItemDetails(){

    this.slectedCategoryError = false;
    this.slectedCollectionError = false;
    this.serialNumberError = false;
    this.lengthError = false;
    this.widthError = false;
    this.orderQuantityError = false;
    this.slectedCategory=null;
    this.slectedCollection=null;
    this.serialNumber=null;
    this.lengthError=null;
    this.widthError = null;
    this.orderQuantity=null;
  }

  enableEdit(row) {
    row.enable = true;
  }
  cancelEdit(row) {
    row.enable = false;
  }

  onSaveItemDetails(row) {
    if (!row.id) {
      row.id = null;
      this.trnPurchaseOrderService.getTrnPurchaseOrderById(row).subscribe(
        data => {
          this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Record Added Successfully' });
          // this.getAllMerchants();

        }, error => {
          this.globalErrorHandler.handleError(error);
        });
    }
    else {
      this.trnPurchaseOrderService.updateTrnPurchaseOrder(row).subscribe(
        data => {
          this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Record Updated Successfully' });
          // this.getAllMerchants();
        }, error => {
          this.globalErrorHandler.handleError(error);
        });
    }
  }
  onDeleteItemDetails(id, index) {
    if (id) {
      this.confirmationService.confirm({
        message: 'Do you want to delete this record?',
        header: 'Delete Confirmation',
        icon: 'fa fa-trash',
        accept: () => {
          // this.trnPurchaseOrderService.deleteItem(id).subscribe(
          //     data => {
          //         this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Record Deleted Successfully' });
          //        // this.getAllMerchants();
          //     }, error => {
          //         this.globalErrorHandler.handleError(error);
          //     });
        },
        reject: () => {
        }
      });
    }
    else {
      this.itemDetails.splice(index, 1);
    }
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



  getCourierList() {
    this.trnPurchaseOrderService.getCourierLookUp().subscribe(
      results => {
        this.courierList = results;
        this.courierList.unshift({ label: '--Select--', value: null });
      },
      error => {
        this.globalErrorHandler.handleError(error);
      });
  }

  onChangeCategory() {
    if (this.slectedCategory) {
      this.getCollectionList(this.slectedCategory);
    }
    else {
      this.collectionList = [];
      this.collectionList.unshift({ label: '--Select--', value: null });
    }
  }

  onChangeCollection() {
    if (this.slectedCollection) {
      this.getSerialNumberList(this.slectedCollection);
    }
    else {
      this.serialNumberList = [];
      this.serialNumberList.unshift({ label: '--Select--', value: null });
    }
  }

  getSerialNumberList(id) {
    this.trnPurchaseOrderService.getSerialNumberPurchaseOrders(id).subscribe(
      results => {
        this.serialNumberList = results;
        this.serialNumberList.unshift({ label: '--Select--', value: null });
        if (id == 4)
          this.serialNumberList.push({ label: 'Custom', value: -1 });
      },
      error => {
        this.globalErrorHandler.handleError(error);
      });
  }

  onChangeLocation() {
    if (this.trnPurchaseOrderObj.locationId) {
      this.commonService.getLocationById(this.trnPurchaseOrderObj.locationId).subscribe(
        data => {
          this.locationObj = data;
        }, error => {
          this.globalErrorHandler.handleError(error);
        });
    }
    else {
      this.locationObj = {};
    }
  }

  getCollectionList(id) {
    this.collectionService.getCollectionLookUp(id).subscribe(
      results => {
        this.collectionList = results;
        this.collectionList.unshift({ label: '--Select--', value: null });
      },
      error => {
        this.globalErrorHandler.handleError(error);
      });
  }
  getLocationList() {
    this.commonService.getLocation().subscribe(
      results => {
        this.locationList = results;
        this.locationList.unshift({ label: '--Select--', value: null });
      },
      error => {
        this.globalErrorHandler.handleError(error);
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
  onCancel() {
    this.router.navigate(['/features/purchase/trnPurchaseOrder/list']);
  }

  onSubmit({ value, valid }: { value: any, valid: boolean }) {
    this.isFormSubmitted = true;
  }
}
