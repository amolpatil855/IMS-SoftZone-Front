import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash/index';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { ConfirmationService, DataTableModule, LazyLoadEvent, SelectItem, TRISTATECHECKBOX_VALUE_ACCESSOR } from 'primeng/primeng';
import { GlobalErrorHandler } from '../../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../../_services/message.service';
import { TrnPurchaseOrderService } from '../../../../_services/trnPurchaseOrder.service';
import { ScriptLoaderService } from '../../../../../../../_services/script-loader.service';
import { Helpers } from "../../../../../../../helpers";
import { TrnPurchaseOrder } from "../../../../_models/trnPurchaseOrder";
import { SupplierService } from '../../../../_services/supplier.service';
import { CommonService } from '../../../../_services/common.service';
import { CollectionService } from '../../../../_services/collection.service';
import { TrnProductStockService } from '../../../../_services/trnProductStock.service';
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
  qualityId = null;
  rate = null;
  amount = null;
  productDetails = {
    purchaseRatePerMM:null,
    suggestedMM:null,
    length:null,
    width:null,
    gst:null,
    roleRate:null,
    cutRate:null,
    purchaseFlatRate:null
  };
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
    private messageService: MessageService,
    private trnProductStockService: TrnProductStockService
  ) {
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
    // this.newItem();
    this.courierModeList.push({ label: '--Select--', value: null });
    this.courierModeList.push({ label: 'Surface', value: 'Surface' });
    this.courierModeList.push({ label: 'Air', value: 'Air' });
  }

  // newItem() {
  //   let itemObj = {
  //     categotryId: this.categoryId,
  //     // categotryName: catObj ? catObj.label : '',
  //     // collectionName: collObj ? catObj.label : '',
  //     collectionId: null,
  //     // serialno:  this.shadeId ?shadeObj.label:'',
  //     // size:  this.foamSizeId ?foamSizeObj.label :this.matSizeId? matSizeObj.label:'',
  //     shadeId:null,
  //     foamSizeId:null,
  //     matSizeId:null,
  //     quantity: null,
  //     orderType: null,
  //     length: null,
  //     width: null,
  //     sizecode: null
  //   };
  //   this.itemDetails.push(itemObj);
  // }

  addItemToList() {
    if (!this.categoryId)
      this.categoryIdError = true;
    else
      this.categoryIdError = false;

    if (!this.collectionId)
      this.collectionIdError = true;
    else
      this.collectionIdError = false;

    if (!this.shadeId && (this.categoryId == 1 || this.categoryId == 5 || this.categoryId == 6))
      this.shadeIdError = true;
    else
      this.shadeIdError = false;

    if (!this.matSizeId && this.categoryId == 4)
      this.matSizeIdError = true;
    else
      this.matSizeIdError = false;

    if (!this.foamSizeId && this.categoryId == 2)
      this.foamSizeIdError = true;
    else
      this.foamSizeIdError = false;

    if (this.collectionId == 4 && this.shadeId == -1 && !this.length)
      this.lengthError = true;
    else
      this.lengthError = false;

    if (this.collectionId == 4 && this.shadeId == -1 && !this.width)
      this.widthError = true;
    else
      this.widthError = false;

    if (!this.orderQuantity)
      this.orderQuantityError = true;
    else
      this.orderQuantityError = false;
    if (this.orderQuantityError || this.widthError || this.foamSizeIdError || this.matSizeIdError || this.lengthError || this.shadeIdError || this.collectionIdError || this.categoryIdError) {
      return false;
    }

    let catObj = _.find(this.categoriesCodeList, ['value', this.categoryId]);
    let collObj = _.find(this.collectionList, ['value', this.collectionId]);
    let shadeObj = _.find(this.shadeIdList, ['value', this.shadeId]);
    let foamSizeObj = _.find(this.foamSizeList, ['value', this.foamSizeId]);
    let matSizeObj = _.find(this.matSizeList, ['value', this.matSizeId]);
    if (matSizeObj && matSizeObj.value == -1) {
      matSizeObj.label = this.sizecode;
    }
    let itemObj = {
      categoryId: this.categoryId,
      categotryName: catObj ? catObj.label : '',
      collectionName: collObj ? catObj.label : '',
      collectionId: this.collectionId,
      serialno: this.shadeId ? shadeObj.label : '',
      size: this.foamSizeId ? foamSizeObj.label : this.matSizeId ? matSizeObj.label : '',
      shadeId: this.shadeId,
      foamSizeId: this.foamSizeId,
      matSizeId: this.matSizeId,
      orderQuantity: this.orderQuantity,
      rate:this.rate,
      ammount:this.amount,
      orderType: this.orderType,
      length: this.length,
      width: this.width,
      sizecode: this.sizecode
    };
    this.itemDetails.push(itemObj);
    this.onCancelItemDetails();
  }

  onCancelItemDetails() {
    this.categoryIdError = false;
    this.collectionIdError = false;
    this.shadeIdError = false;
    this.lengthError = false;
    this.widthError = false;
    this.orderQuantityError = false;
    this.categoryId = null;
    this.collectionId = null;
    this.shadeId = null;
    this.foamSizeId = null;
    this.matSizeId = null;
    this.lengthError = null;
    this.widthError = null;
    this.orderQuantity = null;
    this.productDetails = {
      purchaseRatePerMM:null,
      suggestedMM:null,
      length:null,
      width:null,
      gst:null,
      roleRate:null,
      cutRate:null,
      purchaseFlatRate:null
    };
  }

  enableEdit(row) {
    row.enable = true;
  }
  cancelEdit(row) {
    row.enable = false;
  }

  calculateProductStockDetails() {
    let parameterId=this.shadeId?this.shadeId:this.foamSizeId?this.foamSizeId:this.matSizeId;
    this.trnProductStockService.getAllTrnProductStocks(this.categoryId, this.collectionId, this.shadeId, this.qualityId).subscribe(
      data => {
        // this.rate
        // availableStock
        // quantiy
        // ammount
        this.productDetails = data;
        // Foam Calculation 
        // rate=(selling rate x Suggested MM)/2592]x length x width x GST%
        // Amount= Rate x Quantity
        // if (this.categoryId == 2) {
        //   this.rate = ((((data.purchaseRatePerMM * data.suggestedMM) / 2592) * data.length * data.width) * data.gst) / 100;
        //   //this.amount = this.rate * this.orderQuantity;
        // }
        // else if(this.categoryId == 1 || this.categoryId == 5 || this.categoryId == 6){
        //   this.rate = data.purchaseFlatRate ? (data.purchaseFlatRate * data.gst) / 100:this.orderQuantity>50?(data.roleRate * data.gst) / 100:(data.cutRate * data.gst) / 100;
        //   //this.amount = this.rate * this.orderQuantity;
        // }

        // Mattress Calulation
        // Rate=define selling rate x GST%
        // Amount= Rate x Quantity



        // Custom Rate= [(Length x Width x Custom Rate)/1550.5] x Mat Thinkness (size)x 10 x GST%
        // Amount= Rate x Quantity
      }, error => {
        this.globalErrorHandler.handleError(error);
      });
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

  changeOrderType() {
    if (this.orderQuantity > 50) {
      this.orderType = 'RL';
    }
    else
      this.orderType = 'CL';

    if (this.categoryId == 2) {
      this.rate = ((((this.productDetails.purchaseRatePerMM * this.productDetails.suggestedMM) / 2592) * this.productDetails.length * this.productDetails.width) * this.productDetails.gst) / 100;
      this.amount = this.rate * this.orderQuantity;
    }
    else if (this.categoryId == 1 || this.categoryId == 5 || this.categoryId == 6) {
      this.rate = this.productDetails.purchaseFlatRate ? (this.productDetails.purchaseFlatRate * this.productDetails.gst) / 100 : this.orderQuantity > 50 ? (this.productDetails.roleRate * this.productDetails.gst) / 100 : (this.productDetails.cutRate * this.productDetails.gst) / 100;
      this.amount = this.rate * this.orderQuantity;
    }


  }


  onChangeCategory() {
    if (this.categoryId) {
      this.getCollectionList();
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

  onChangeCollection() {
    // if (this.collectionId) {
    //   this.getshadeIdList(this.collectionId);
    // }

    if (this.categoryId == 1 || this.categoryId == 5 || this.categoryId == 6) {
      this.getshadeIdList();
    }
    else if (this.categoryId == 2) {
      this.getFoamSizeList();
    }
    else if (this.categoryId == 4) {
      this.getMatSizeList();
    }
    else {
      this.shadeIdList = [];
      this.shadeIdList.unshift({ label: '--Select--', value: null });
      this.matSizeList = [];
      this.matSizeList.unshift({ label: '--Select--', value: null });
      this.shadeIdList = [];
      this.shadeIdList.unshift({ label: '--Select--', value: null });
    }
  }

  getMatSizeList() {
    this.trnPurchaseOrderService.getMatsizePurchaseOrders(this.collectionId).subscribe(
      results => {
        this.matSizeList = results;
        this.matSizeList.unshift({ label: '--Select--', value: null });
        if (this.categoryId == 4)
          this.matSizeList.push({ label: 'Custom', value: -1 });
      },
      error => {
        this.globalErrorHandler.handleError(error);
      });
  }

  getFoamSizeList() {
    this.trnPurchaseOrderService.getFoamSizePurchaseOrders(this.collectionId).subscribe(
      results => {
        this.foamSizeList = results;
        this.foamSizeList.unshift({ label: '--Select--', value: null });
      },
      error => {
        this.globalErrorHandler.handleError(error);
      });
  }


  getshadeIdList() {
    this.trnPurchaseOrderService.getshadeIdPurchaseOrders(this.collectionId).subscribe(
      results => {
        this.shadeIdList = results;
        this.shadeIdList.unshift({ label: '--Select--', value: null });
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

  getCollectionList() {
    this.collectionService.getCollectionLookUp(this.categoryId).subscribe(
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
