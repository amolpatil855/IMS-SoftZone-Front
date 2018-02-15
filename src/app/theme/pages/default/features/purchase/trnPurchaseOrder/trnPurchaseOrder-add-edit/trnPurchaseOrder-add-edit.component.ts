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
  shadeIdList = [];
  categoryId = null;
  collectionId = null;
  itemDetails = [];
  shadeId = null;
  orderQuantity = null;
  orderType = null;
  locationObj = null;
  length = null;
  width = null;
  sizecode = null;
  isFormSubmitted = false;
  categoryIdError = false;
  collectionIdError = false;
  shadeIdError = false;
  lengthError = false;
  widthError = false;
  orderQuantityError = false;
  foamSizeIdError = false;
  matSizeIdError = false;
  courierList = [];
  courierModeList = [];
  matSizeList = [];
  foamSizeList = [];
  matSizeId = null;
  foamSizeId = null;

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

    this.trnPurchaseOrderObj.orderDate = today;
    this.newItem();
    this.courierModeList.push({ label: '--Select--', value: null });
    this.courierModeList.push({ label: 'Surface', value: 'Surface' });
    this.courierModeList.push({ label: 'Air', value: 'Air' });
  }

  newItem() {
    let itemObj = {
      categotryId: this.categoryId,
      // categotryName: catObj ? catObj.label : '',
      // collectionName: collObj ? catObj.label : '',
      collectionId: null,
      // serialno:  this.shadeId ?shadeObj.label:'',
      // size:  this.foamSizeId ?foamSizeObj.label :this.matSizeId? matSizeObj.label:'',
      shadeId:this.shadeId,
      foamSizeId:this.foamSizeId,
      matSizeId:this.matSizeId,
      quantity: this.orderQuantity,
      orderType: this.orderType,
      length: null,
      width: null,
      sizecode: null
    };
    this.itemDetails.push(itemObj);
  }

  addItemToList(row) {

    if (!row.categoryId)
      row.categoryIdError = true;
    else
      row.categoryIdError = false;

    if (!row.collectionId)
      row.collectionIdError = true;
    else
      row.collectionIdError = false;

    if (!row.shadeId && (row.categoryId == 1 || row.categoryId == 5 || row.categoryId == 6))
      row.shadeIdError = true;
    else
      row.shadeIdError = false;

    if (!row.matSizeId && row.categoryId == 4)
      row.matSizeIdError = true;
    else
      row.matSizeIdError = false;

    if (!row.foamSizeId && row.categoryId == 2)
      row.foamSizeIdError = true;
    else
      row.foamSizeIdError = false;

    if (row.collectionId == 4 && row.shadeId == -1 && !row.length)
      row.lengthError = true;
    else
      row.lengthError = false;

    if (row.collectionId == 4 && row.shadeId == -1 && !row.width)
      row.widthError = true;
    else
      row.widthError = false;

    if (!row.orderQuantity)
      row.orderQuantityError = true;
    else
      row.orderQuantityError = false;
    if (row.orderQuantityError || row.widthError || row.foamSizeIdError || row.matSizeIdError || row.lengthError || row.shadeIdError || row.collectionIdError || row.categoryIdError) {
      return false;
    }

    // let catObj = _.find(row.categoriesCodeList, ['value', row.categoryId]);
    // let collObj = _.find(row.collectionList, ['value', row.collectionId]);
    // let shadeObj = _.find(row.shadeIdList, ['value', row.shadeId]);
    // let foamSizeObj = _.find(row.foamSizeList, ['value', row.foamSizeId]);
    // let matSizeObj = _.find(row.matSizeList, ['value', this.matSizeId]);
    // if(matSizeObj.value==-1){
    //   matSizeObj.label=this.sizecode;
    // }
    let itemObj = {
      categotryId: row.categoryId,
      // categotryName: catObj ? catObj.label : '',
      // collectionName: collObj ? catObj.label : '',
      collectionId: null,
      // serialno:  this.shadeId ?shadeObj.label:'',
      // size:  this.foamSizeId ?foamSizeObj.label :this.matSizeId? matSizeObj.label:'',
      shadeId:null,
      foamSizeId:null,
      matSizeId:null,
      quantity: null,
      orderType: null,
      length: null,
      width: null,
      sizecode: null
    };
    this.itemDetails.push(itemObj);
    this.onCancelItemDetails();
  }

  onCancelItemDetails() {

    // this.categoryIdError = false;
    // this.collectionIdError = false;
    // this.shadeIdError = false;
    // this.lengthError = false;
    // this.widthError = false;
    // this.orderQuantityError = false;
    // this.categoryId = null;
    // this.collectionId = null;
    // this.shadeId = null;
    // this.foamSizeId=null;
    // this.matSizeId=null;
    // this.lengthError = null;
    // this.widthError = null;
    // this.orderQuantity = null;
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

  calculateSizeCode() {
    if (this.width && this.length) {
      this.sizecode = this.length + 'x' + this.width;
    }
    else
      this.sizecode = '';
  }

  changeOrderType(row) {
    if (row.orderQuantity > 50) {
      row.orderType = 'RL';
    }
    else
    row.orderType = 'CL';
  }


  onChangeCategory(row) {
    if (row.categoryId) {
      this.categoryId=row.categoryId;
      this.getCollectionList(row);
    }
    else {
      this.collectionList = [];
      this.collectionList.unshift({ label: '--Select--', value: null });
      this.shadeIdList = [];
      this.shadeIdList.unshift({ label: '--Select--', value: null });
      this.matSizeList = [];
      this.matSizeList.unshift({ label: '--Select--', value: null });
      this.shadeIdList = [];
      this.shadeIdList.unshift({ label: '--Select--', value: null });
    }
  }

  onChangeCollection(row) {
    // if (this.collectionId) {
    //   this.getshadeIdList(this.collectionId);
    // }

    if (row.categoryId == 1 || row.categoryId == 5 || row.categoryId == 6) {
      this.getshadeIdList(row);
    }
    else if (row.categoryId == 2) {
      this.getFoamSizeList(row);
    }
    else if (row.categoryId == 4) {
      this.getMatSizeList(row);
    }
    else {
      row.shadeIdList = [];
      row.shadeIdList.unshift({ label: '--Select--', value: null });
      row.matSizeList = [];
      row.matSizeList.unshift({ label: '--Select--', value: null });
      row.shadeIdList = [];
      row.shadeIdList.unshift({ label: '--Select--', value: null });
    }
  }

  getMatSizeList(row) {
    this.trnPurchaseOrderService.getMatsizePurchaseOrders(row.collectionId).subscribe(
      results => {
        row.matSizeList = results;
        row.matSizeList.unshift({ label: '--Select--', value: null });
        if (row.categoryId == 4)
        row.matSizeList.push({ label: 'Custom', value: -1 });
      },
      error => {
        this.globalErrorHandler.handleError(error);
      });
  }

  getFoamSizeList(row) {
    this.trnPurchaseOrderService.getFoamSizePurchaseOrders(row.collectionId).subscribe(
      results => {
        row.foamSizeList = results;
        row.foamSizeList.unshift({ label: '--Select--', value: null });
      },
      error => {
        this.globalErrorHandler.handleError(error);
      });
  }


  getshadeIdList(row) {
    this.trnPurchaseOrderService.getshadeIdPurchaseOrders(row.collectionId).subscribe(
      results => {
        row.shadeIdList = results;
        row.shadeIdList.unshift({ label: '--Select--', value: null });
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

  getCollectionList(row) {
    this.collectionService.getCollectionLookUp(row.categoryId).subscribe(
      results => {
        row.collectionList = results;
        row.collectionList.unshift({ label: '--Select--', value: null });
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
    this.trnPurchaseOrderObj.TrnPurchaseOrderItems = this.itemDetails;
    if (valid) {
      this.saveTrnPurchaseOrder(this.trnPurchaseOrderObj);
    }
  }


  saveTrnPurchaseOrder(value) {
    Helpers.setLoading(true);
    if (this.params) {
      this.trnPurchaseOrderService.updateTrnPurchaseOrder(value)
        .subscribe(
        results => {
          this.params = null;
          this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: results.message });
          Helpers.setLoading(false);

        },
        error => {
          this.globalErrorHandler.handleError(error);
          Helpers.setLoading(false);
        });
    } else {
      this.trnPurchaseOrderService.createTrnPurchaseOrder(value)
        .subscribe(
        results => {
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

}
