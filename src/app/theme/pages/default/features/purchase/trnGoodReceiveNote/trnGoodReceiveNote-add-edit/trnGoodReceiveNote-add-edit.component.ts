import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash/index';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { ConfirmationService, DataTableModule, LazyLoadEvent, SelectItem, TRISTATECHECKBOX_VALUE_ACCESSOR } from 'primeng/primeng';
import { GlobalErrorHandler } from '../../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../../_services/message.service';
import { TrnGoodReceiveNoteService } from '../../../../_services/trnGoodReceiveNote.service';
import { ScriptLoaderService } from '../../../../../../../_services/script-loader.service';
import { Helpers } from "../../../../../../../helpers";
import { TrnGoodReceiveNote } from "../../../../_models/trnGoodReceiveNote";
import { SupplierService } from '../../../../_services/supplier.service';
import { CommonService } from '../../../../_services/common.service';
import { CollectionService } from '../../../../_services/collection.service';
import { TrnProductStockService } from '../../../../_services/trnProductStock.service';
import { MatSizeService } from '../../../../_services/matSize.service';
@Component({
  selector: "app-trnGoodReceiveNote-add-edit",
  templateUrl: "./trnGoodReceiveNote-add-edit.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class TrnGoodReceiveNoteAddEditComponent implements OnInit {
  trnGoodReceiveNoteForm: any;
  params: number;
  trnGoodReceiveNoteList = [];
  showUpdateBtn: boolean = true;
  pageSize = 50;
  page = 1;
  totalCount = 0;
  search = '';
  tableEmptyMesssage = 'Loading...';
  supplierCodeList = [];
  receivedQuantity = 0;
  locationList = [];
  trnGoodReceiveNoteObj: TrnGoodReceiveNote;
  collectionList = [];
  categoriesCodeList = [];
  shadeIdList = [];
  categoryId = null;
  purchaseOrderId = null;
  matThicknessId = null;
  collectionId = null;
  trnGoodReceiveNoteItems = [];
  shadeId = null;
  orderQuantity = null;
  orderType = null;
  locationObj = null;
  length = null;
  width = null;
  matSizeCode = null;
  isFormSubmitted = false;
  categoryIdError = false;
  collectionIdError = false;
  purchaseOrderIdIdError = false;
  shadeIdError = false;
  lengthError = false;
  widthError = false;
  orderQuantityError = false;
  fomQuantityInKGError = false;
  matThicknessIdError = false;
  accessoryIdError = false;
  fomSizeIdError = false;
  matSizeIdError = false;
  qualityIdError = false;
  courierList = [];
  courierModeList = [];
  matSizeList = [];
  fomSizeList = [];
  purchaseOrderList = [];
  purchaseItemList = [];
  matSizeId = null;
  fomSizeId = null;
  qualityId = null;
  rate = null;
  gst = null;
  fomQuantityInKG = null;
  amountWithGST = null;
  rateWithGST = null;
  purchaseDiscount = null;
  qualityList = [];
  thicknessList = [];
  productDetails = {
    purchaseRatePerMM: null,
    suggestedMM: null,
    length: null,
    width: null,
    gst: null,
    roleRate: null,
    cutRate: null,
    purchaseFlatRate: null,
    stock: null,
    purchaseRate: null,
    custRatePerSqFeet: null
  };
  accessoryId = null;
  accessoryCodeList = [];
  amount = null;
  disabled: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private supplierService: SupplierService,
    private commonService: CommonService,
    private trnGoodReceiveNoteService: TrnGoodReceiveNoteService,
    private globalErrorHandler: GlobalErrorHandler,
    private confirmationService: ConfirmationService,
    private collectionService: CollectionService,
    private messageService: MessageService,
    private trnProductStockService: TrnProductStockService,
    private matSizeService: MatSizeService
  ) {
  }

  ngOnInit() {
    this.trnGoodReceiveNoteObj = new TrnGoodReceiveNote();
    this.getSupplierCodeList();
    this.getLocationList();
    this.getCategoryCodeList();
    let today = new Date();
    this.locationObj = {};
    this.disabled = false;
    this.showUpdateBtn = true;
    this.trnGoodReceiveNoteObj.grnDate = today;
    this.courierModeList.push({ label: '--Select--', value: null });
    this.courierModeList.push({ label: 'Surface', value: 'Surface' });
    this.courierModeList.push({ label: 'Air', value: 'Air' });
    this.route.params.forEach((params: Params) => {
      this.params = params['id'];
    });
    if (this.params) {
      this.disabled = true;
      this.showUpdateBtn = false;
      this.getTrnGoodReceiveNoteById(this.params);
    }
  }

  getTrnGoodReceiveNoteById(id) {
    Helpers.setLoading(true);
    this.trnGoodReceiveNoteService.getTrnGoodReceiveNoteById(id).subscribe(
      results => {
        this.trnGoodReceiveNoteObj = results;
        this.trnGoodReceiveNoteObj.grnDate = new Date(this.trnGoodReceiveNoteObj.grnDate);
        this.trnGoodReceiveNoteItems = results.trnGoodReceiveNoteItems;
        // _.forEach(this.trnGoodReceiveNoteItems, function (value) {
        //   value.categoryName = value.mstCategory.code;
        //   value.collectionName = value.mstCollection?value.mstCollection.collectionCode:'';
        //   value.accessoryName = value.mstCollection?value.mstCollection.collectionCode:'';
        // });
        delete this.trnGoodReceiveNoteObj['trnGoodReceiveNoteItems'];
        this.locationObj = results.mstCompanyLocation;
        Helpers.setLoading(false);
      },
      error => {
        this.globalErrorHandler.handleError(error);
        Helpers.setLoading(false);
      });
  }

  addItemToList() {
    if (!this.categoryId)
      this.categoryIdError = true;
    else
      this.categoryIdError = false;

    if (!this.collectionId && this.categoryId != 7)
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

    if (!this.fomSizeId && this.categoryId == 2)
      this.fomSizeIdError = true;
    else
      this.fomSizeIdError = false;

    if (!this.accessoryId && this.categoryId == 7)
      this.accessoryIdError = true;
    else
      this.accessoryIdError = false;

    if (!this.purchaseOrderId)
      this.purchaseOrderIdIdError = true;
    else
      this.purchaseOrderIdIdError = false;

    if (this.categoryId == 4 && this.matSizeId == -1 && !this.length)
      this.lengthError = true;
    else
      this.lengthError = false;

    if (this.categoryId == 4 && this.matSizeId == -1 && !this.width)
      this.widthError = true;
    else
      this.widthError = false;

    if (this.categoryId == 4 && this.matSizeId == -1 && !this.matThicknessId)
      this.matThicknessIdError = true;
    else
      this.matThicknessIdError = false;

    if (this.categoryId == 4 && this.matSizeId == -1 && !this.qualityId)
      this.qualityIdError = true;
    else
      this.qualityIdError = false;

    if (!this.orderQuantity || !this.receivedQuantity)
      this.orderQuantityError = true;
    else
      this.orderQuantityError = false;

    if (this.orderQuantityError || this.widthError || this.matThicknessIdError || this.qualityIdError || this.fomSizeIdError || this.matSizeIdError || this.matSizeIdError || this.accessoryIdError
      || !this.receivedQuantity || this.lengthError || this.purchaseOrderIdIdError || this.shadeIdError || this.collectionIdError || this.categoryIdError) {
      return false;
    }

    if (this.receivedQuantity > this.orderQuantity) {
      this.messageService.addMessage({ severity: 'error', summary: 'Error', detail: "Recieved quantity should be less than ordered quantity." });
      return false;
    }


    if (this.trnGoodReceiveNoteItems.length > 0) {

      let poObj = _.find(this.trnGoodReceiveNoteItems, ['categoryId', this.categoryId]);
      if (poObj != null) {
        if (this.accessoryId == poObj.accessoryId && this.shadeId == poObj.shadeId && this.fomSizeId == poObj.fomSizeId && this.matSizeId == poObj.matSizeId && this.purchaseOrderId == poObj.purchaseOrderId) {
          this.messageService.addMessage({ severity: 'error', summary: 'Error', detail: "Cannot add duplicate items." });
          return false;
        }
      }

    }

    let catObj = _.find(this.categoriesCodeList, ['value', this.categoryId]);
    let collObj = _.find(this.collectionList, ['value', this.collectionId]);
    let shadeObj = _.find(this.shadeIdList, ['value', this.shadeId]);
    let fomSizeObj = _.find(this.fomSizeList, ['value', this.fomSizeId]);
    let matSizeObj = _.find(this.matSizeList, ['value', this.matSizeId]);
    let accessoryObj = _.find(this.accessoryCodeList, ['value', this.accessoryId]);
    let poItemObj = _.find(this.purchaseItemList, { 'purchaseOrderId': this.purchaseOrderId });
    if (matSizeObj && matSizeObj.value == -1) {
      matSizeObj.label = this.matSizeCode;
    }

    if (this.trnGoodReceiveNoteObj.totalAmount == null) {
      this.trnGoodReceiveNoteObj.totalAmount = 0;
    }
    this.trnGoodReceiveNoteObj.totalAmount = this.trnGoodReceiveNoteObj.totalAmount + this.amountWithGST;

    let itemObj = {
      categoryId: this.categoryId,
      categoryName: catObj ? catObj.label != "--Select--" ? catObj.label : '' : '',
      collectionName: collObj ? collObj.label != "--Select--" ? collObj.label : '' : '',
      accessoryName: accessoryObj ? accessoryObj.label != "--Select--" ? accessoryObj.label : '' : '',
      collectionId: this.collectionId,
      serialno: this.shadeId ? shadeObj.label != "--Select--" ? shadeObj.label : '' : '',
      size: this.fomSizeId ? fomSizeObj.label : this.matSizeId ? matSizeObj.label != "--Select--" ? matSizeObj.label : '' : '',
      shadeId: this.shadeId,
      fomSizeId: this.fomSizeId,
      matSizeId: this.matSizeId,
      qualityId: this.qualityId,
      matThicknessId: this.matThicknessId,
      orderQuantity: this.orderQuantity,
      receivedQuantity: this.receivedQuantity,
      fomQuantityInKG: this.fomQuantityInKG,
      rateWithGST: this.rateWithGST,
      gst: this.gst,
      rate: this.rate,
      amount: this.amount,
      amountWithGST: this.amountWithGST,
      orderType: this.orderType,
      length: this.length,
      width: this.width,
      matSizeCode: this.matSizeCode,
      accessoryId: this.accessoryId,
      purchaseOrderId: this.purchaseOrderId,
      purchaseOrderNumber: poItemObj.purchaseOrderNumber
    };
    this.trnGoodReceiveNoteItems.push(itemObj);
    this.onCancelItemDetails();
  }

  onCancelItemDetails() {
    this.categoryIdError = false;
    this.collectionIdError = false;
    this.shadeIdError = false;
    this.lengthError = false;
    this.widthError = false;
    this.orderQuantityError = false;
    this.accessoryIdError = false;
    this.categoryId = null;
    this.collectionId = null;
    this.accessoryId = null;
    this.shadeId = null;
    this.fomSizeId = null;
    this.matSizeId = null;
    this.qualityId = null;
    this.matThicknessId = null;
    this.qualityIdError = false;
    this.matThicknessIdError = false;
    this.purchaseOrderId = null;
    this.purchaseOrderList = [];
    this.purchaseOrderIdIdError = false;
    this.lengthError = null;
    this.widthError = null;
    this.orderQuantity = null;
    this.rateWithGST = null;
    this.gst = null;
    this.rate = null;
    this.purchaseDiscount = null;
    this.receivedQuantity = null;
    this.fomQuantityInKG = null;
    this.productDetails = {
      purchaseRatePerMM: null,
      suggestedMM: null,
      length: null,
      width: null,
      gst: null,
      roleRate: null,
      cutRate: null,
      purchaseFlatRate: null,
      stock: null,
      purchaseRate: null,
      custRatePerSqFeet: null,
    };
    this.orderType = '';
    this.amountWithGST = '';
  }

  enableEdit(row) {
    row.enable = true;
  }
  cancelEdit(row) {
    row.enable = false;
  }

  onMatSizeCodeChange() {
    let parameterId = null;
    if (this.categoryId == 4 && this.matSizeId == -1) {
      this.matSizeIdError = false;
      this.lengthError = false;
      this.widthError = false;
      this.purchaseOrderIdIdError = false;
      if (this.matSizeId != null) {
        parameterId = this.matSizeId;
        if (this.length && this.width) {
          this.matSizeCode = this.length + 'x' + this.width;
          this.trnGoodReceiveNoteService.getPOListForSelectedItem(this.categoryId, this.collectionId, parameterId, this.matSizeCode).subscribe(
            data => {
              this.purchaseItemList = data;
              this.purchaseOrderList = [];
              let vm = this;
              console.log('this.purchaseItemList', this.purchaseItemList);
              _.forEach(this.purchaseItemList, function (value) {
                vm.purchaseOrderList.push({ label: value.purchaseOrderNumber, value: value.purchaseOrderId });
              });
              this.purchaseOrderList.unshift({ label: '--Select--', value: null });
              console.log('this.purchaseOrderList', this.purchaseOrderList);
            }, error => {
              this.globalErrorHandler.handleError(error);
            });
        }
      }

    }
  }

  calculateProductStockDetails() {
    let parameterId = null;
    if (this.categoryId == 1 || this.categoryId == 5 || this.categoryId == 6) {
      this.shadeIdError = false;
      this.qualityId = null;
      this.qualityIdError = false;
      this.length = null;
      this.lengthError = false;
      this.width = null;
      this.widthError = false;
      this.purchaseOrderId = null;
      this.purchaseOrderList = [];
      this.purchaseOrderList.unshift({ label: '--Select--', value: null });
      this.purchaseOrderIdIdError = false;
      this.rateWithGST = null;
      this.gst = null;
      this.rate = null;
      this.purchaseDiscount = null;
      this.orderQuantity = null;
      this.orderQuantityError = false;
      this.fomQuantityInKGError = false;
      this.receivedQuantity = null;
      this.orderType = null;
      this.amountWithGST = null;
      this.matThicknessId = null;
      this.matThicknessIdError = false;
      if (this.shadeId != null) {
        parameterId = this.shadeId;
        this.trnGoodReceiveNoteService.getPOListForSelectedItem(this.categoryId, this.collectionId, parameterId, this.matSizeCode).subscribe(
          data => {
            this.purchaseItemList = data;
            this.purchaseOrderList = [];
            let vm = this;
            console.log('this.purchaseItemList', this.purchaseItemList);
            _.forEach(this.purchaseItemList, function (value) {
              vm.purchaseOrderList.push({ label: value.purchaseOrderNumber, value: value.purchaseOrderId });
            });
            this.purchaseOrderList.unshift({ label: '--Select--', value: null });
            console.log('this.purchaseOrderList', this.purchaseOrderList);
          }, error => {
            this.globalErrorHandler.handleError(error);
          });
      }
    }
    else if (this.categoryId == 2) {
      this.fomSizeIdError = false;
      this.qualityId = null;
      this.qualityIdError = false;
      this.length = null;
      this.lengthError = false;
      this.width = null;
      this.widthError = false;
      this.purchaseOrderId = null;
      this.purchaseOrderList = [];
      this.purchaseOrderList.unshift({ label: '--Select--', value: null });
      this.purchaseOrderIdIdError = false;
      this.rateWithGST = null;
      this.gst = null;
      this.rate = null;
      this.purchaseDiscount = null;
      this.orderQuantity = null;
      this.orderQuantityError = false;
      this.fomQuantityInKGError = false;
      this.receivedQuantity = null;
      this.orderType = null;
      this.amountWithGST = null;
      this.matThicknessId = null;
      this.matThicknessIdError = false;
      if (this.fomSizeId != null) {
        parameterId = this.fomSizeId;
        this.trnGoodReceiveNoteService.getPOListForSelectedItem(this.categoryId, this.collectionId, parameterId, this.matSizeCode).subscribe(
          data => {
            this.purchaseItemList = data;
            this.purchaseOrderList = [];
            let vm = this;
            console.log('this.purchaseItemList', this.purchaseItemList);
            _.forEach(this.purchaseItemList, function (value) {
              vm.purchaseOrderList.push({ label: value.purchaseOrderNumber, value: value.purchaseOrderId });
            });
            this.purchaseOrderList.unshift({ label: '--Select--', value: null });
            console.log('this.purchaseOrderList', this.purchaseOrderList);
          }, error => {
            this.globalErrorHandler.handleError(error);
          });
      }
    }
    else if (this.categoryId == 4 && this.matSizeId != -1) {
      this.matSizeIdError = false;
      this.qualityId = null;
      this.qualityIdError = false;
      this.length = null;
      this.lengthError = false;
      this.width = null;
      this.widthError = false;
      this.purchaseOrderId = null;
      this.purchaseOrderList = [];
      this.purchaseOrderList.unshift({ label: '--Select--', value: null });
      this.purchaseOrderIdIdError = false;
      this.rateWithGST = null;
      this.gst = null;
      this.rate = null;
      this.purchaseDiscount = null;
      this.orderQuantity = null;
      this.orderQuantityError = false;
      this.fomQuantityInKGError = false;
      this.receivedQuantity = null;
      this.fomQuantityInKG = null;
      this.orderType = null;
      this.amountWithGST = null;
      this.matThicknessId = null;
      this.matThicknessIdError = false;
      if (this.matSizeId != null) {
        parameterId = this.matSizeId;
        this.trnGoodReceiveNoteService.getPOListForSelectedItem(this.categoryId, this.collectionId, parameterId, this.matSizeCode).subscribe(
          data => {
            this.purchaseItemList = data;
            this.purchaseOrderList = [];
            let vm = this;
            console.log('this.purchaseItemList', this.purchaseItemList);
            _.forEach(this.purchaseItemList, function (value) {
              vm.purchaseOrderList.push({ label: value.purchaseOrderNumber, value: value.purchaseOrderId });
            });
            this.purchaseOrderList.unshift({ label: '--Select--', value: null });
            console.log('this.purchaseOrderList', this.purchaseOrderList);
          }, error => {
            this.globalErrorHandler.handleError(error);
          });
      }
    }
    else if (this.categoryId == 4 && this.matSizeId != -1 && !this.qualityId) {
      return;
    }
    else if (this.categoryId == 7) {
      this.accessoryIdError = false;
      this.length = null;
      this.lengthError = false;
      this.width = null;
      this.widthError = false;
      this.purchaseOrderId = null;
      this.purchaseOrderList = [];
      this.purchaseOrderList.unshift({ label: '--Select--', value: null });
      this.purchaseOrderIdIdError = false;
      this.rateWithGST = null;
      this.gst = null;
      this.rate = null;
      this.purchaseDiscount = null;
      this.orderQuantity = null;
      this.orderQuantityError = false;
      this.fomQuantityInKGError = false;
      this.receivedQuantity = null;
      this.fomQuantityInKG = null;
      this.orderType = null;
      this.amountWithGST = null;
      if (this.accessoryId != null) {
        parameterId = this.accessoryId;
        this.trnGoodReceiveNoteService.getPOListForSelectedItem(this.categoryId, this.collectionId, parameterId, this.matSizeCode).subscribe(
          data => {
            this.purchaseItemList = data;
            this.purchaseOrderList = [];
            let vm = this;
            console.log('this.purchaseItemList', this.purchaseItemList);
            _.forEach(this.purchaseItemList, function (value) {
              vm.purchaseOrderList.push({ label: value.purchaseOrderNumber, value: value.purchaseOrderId });
            });
            this.purchaseOrderList.unshift({ label: '--Select--', value: null });
            console.log('this.purchaseOrderList', this.purchaseOrderList);
          }, error => {
            this.globalErrorHandler.handleError(error);
          });
      }
    }
    else {
      parameterId = null;
    }
    //this.shadeId ? this.shadeId : this.fomSizeId ? this.fomSizeId : this.matSizeId != -1 ? this.matSizeId : null;

    // this.trnProductStockService.getAllTrnProductStocks(this.categoryId, this.collectionId, parameterId, this.qualityId).subscribe(
    //   data => {
    //     this.productDetails = data;
    //   }, error => {
    //     this.globalErrorHandler.handleError(error);
    //   });

  }

  onPuchaseOrderChange() {
    this.purchaseOrderIdIdError = false;
    this.orderQuantityError = false;
    this.fomQuantityInKGError = false;
    this.qualityIdError = false;
    this.lengthError = false;
    this.widthError = false;
    this.matThicknessIdError = false;
    this.orderQuantity = null;
    this.rateWithGST = null;
    this.gst = null;
    this.purchaseDiscount = null;
    this.amountWithGST = null;
    this.amount = null;
    this.receivedQuantity = null;
    this.fomQuantityInKG = null;
    this.orderType = '';
    this.rate = null;
    if (this.purchaseOrderId != null) {
      let poObj = _.find(this.purchaseItemList, { 'purchaseOrderId': this.purchaseOrderId });
      this.purchaseDiscount = poObj.purchaseDiscount || 0;
      this.gst = poObj.gst;
      this.orderQuantity = poObj.orderQuantity;
      this.rateWithGST = poObj.rateWithGST;
      this.orderType = poObj.orderType;
      this.rate = poObj.rate;
    }
  }

  changeRecivedQuantity() {
    if (this.receivedQuantity > this.orderQuantity) {
      this.messageService.addMessage({ severity: 'error', summary: 'Error', detail: "Recieved quantity should be less than ordered quantity." });
      return false;
    }

    let poObj = _.find(this.purchaseItemList, { 'purchaseOrderId': this.purchaseOrderId });

    if (this.categoryId == 1 || this.categoryId == 5 || this.categoryId == 6) {
      let applyDiscount = false;
      this.rate = (poObj.purchaseFlatRate ? poObj.purchaseFlatRate : poObj.orderQuantity >= 50 ? poObj.roleRate : poObj.cutRate);
      applyDiscount = (poObj.purchaseFlatRate ? true : poObj.orderQuantity >= 50 ? true : false);
      this.amount = this.rate * this.receivedQuantity;
      this.rate = parseFloat(this.rate).toFixed(2);
      if (applyDiscount)
        this.amount = Math.round(this.amount - ((this.amount * poObj.purchaseDiscount) / 100));
      this.amountWithGST = Math.round(this.amount + ((this.amount * poObj.gst) / 100));
    }
    else {
      // this.amountWithGST = poObj.rate * this.receivedQuantity;
      this.amount = this.rate * this.receivedQuantity;
      if (this.matSizeId != -1 && this.categoryId == 4)
        this.amount = Math.round(this.amount);
      else
        this.amount = Math.round(this.amount - ((this.amount * poObj.purchaseDiscount) / 100));
      this.amountWithGST = Math.round(this.amount + ((this.amount * poObj.gst) / 100));
    }
  }

  getMatQualityList() {
    this.matSizeService.getQualityLookUpByCollection(this.collectionId).subscribe(
      results => {
        this.qualityList = results;
        this.qualityList.unshift({ label: '--Select--', value: null });
        Helpers.setLoading(false);
      },
      error => {
        this.globalErrorHandler.handleError(error);
        Helpers.setLoading(false);
      });
  }

  getAccessoryLookup() {
    this.commonService.getAccessoryLookUp().subscribe(
      results => {
        this.accessoryCodeList = results;
        this.accessoryCodeList.unshift({ label: '--Select--', value: null });
        Helpers.setLoading(false);
      },
      error => {
        this.globalErrorHandler.handleError(error);
        Helpers.setLoading(false);
      });
  }


  onQualityClick() {

    this.thicknessList = [];
    this.thicknessList.unshift({ label: '--Select--', value: null });
    this.matThicknessId = null;
    this.qualityIdError = false;
    this.matSizeIdError = false;
    this.purchaseOrderId = null;
    this.purchaseOrderIdIdError = false;
    this.orderQuantityError = false;
    this.fomQuantityInKGError = false;
    this.orderQuantity = null;
    this.matThicknessIdError = false;
    this.productDetails.stock = null;
    this.length = null;
    this.lengthError = false;
    this.width = null;
    this.widthError = false;
    this.rateWithGST = null;
    this.gst = null;
    this.rate = null;
    this.purchaseDiscount = null;
    this.orderQuantity = null;
    this.receivedQuantity = null;
    this.fomQuantityInKG = null;
    this.amount = null,
      this.orderType = '';
    this.amountWithGST = null;
    this.calculateProductStockDetails();
    if (this.qualityId != null) {
      Helpers.setLoading(true);
      this.matSizeService.getMatThicknessLookUp().subscribe(
        results => {
          this.thicknessList = results;
          this.thicknessList.unshift({ label: '--Select--', value: null });
          Helpers.setLoading(false);
        },
        error => {
          this.globalErrorHandler.handleError(error);
          Helpers.setLoading(false);
        });
    }
  }

  onThicknessChange() {
    this.matThicknessIdError = false;
    this.lengthError = false;
    this.widthError = false;
    this.purchaseOrderIdIdError = false;
    this.orderQuantityError = false;
    this.fomQuantityInKGError = false;
  }

  onSaveItemDetails(row) {
    if (!row.id) {
      row.id = null;
      this.trnGoodReceiveNoteService.getTrnGoodReceiveNoteById(row).subscribe(
        data => {
          this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Record Added Successfully' });
          // this.getAllMerchants();

        }, error => {
          this.globalErrorHandler.handleError(error);
        });
    }
    else {
      this.trnGoodReceiveNoteService.updateTrnGoodReceiveNote(row).subscribe(
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
          if (this.trnGoodReceiveNoteObj.totalAmount >= 0) {
            if (this.trnGoodReceiveNoteItems.length > 0) {
              this.trnGoodReceiveNoteObj.totalAmount = this.trnGoodReceiveNoteObj.totalAmount - this.trnGoodReceiveNoteItems[index].amountWithGST;
            } else {
              this.trnGoodReceiveNoteObj.totalAmount = 0;
            }
          }
          this.trnGoodReceiveNoteItems.splice(index, 1);
          // this.trnGoodReceiveNoteService.deleteItem(id).subscribe(
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
      if (this.trnGoodReceiveNoteObj.totalAmount >= 0) {
        if (this.trnGoodReceiveNoteItems.length > 0) {
          this.trnGoodReceiveNoteObj.totalAmount = this.trnGoodReceiveNoteObj.totalAmount - this.trnGoodReceiveNoteItems[index].amountWithGST;
        } else {
          this.trnGoodReceiveNoteObj.totalAmount = 0;
        }
      }
      this.trnGoodReceiveNoteItems.splice(index, 1);
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

  calculateSizeCode() {
    if (this.width && this.length) {
      this.matSizeCode = this.length + 'x' + this.width;
    }
    else
      this.matSizeCode = '';
  }

  onChangeCategory() {
    this.collectionList = [];
    this.collectionList.unshift({ label: '--Select--', value: null });
    this.shadeIdList = [];
    this.shadeIdList.unshift({ label: '--Select--', value: null });
    this.matSizeList = [];
    this.matSizeList.unshift({ label: '--Select--', value: null });
    this.fomSizeList = [];
    this.fomSizeList.unshift({ label: '--Select--', value: null });
    this.accessoryCodeList = [];
    this.accessoryCodeList.unshift({ label: '--Select--', value: null });
    this.categoryIdError = false;
    this.orderQuantityError = false;
    this.fomQuantityInKGError = false;
    this.matSizeIdError = false;
    this.fomSizeIdError = false;
    this.shadeIdError = false;
    this.accessoryIdError = false;
    this.collectionIdError = false;
    this.collectionId = null;
    this.accessoryId = null;
    this.shadeId = null;
    this.fomSizeId = null;
    this.matSizeId = null;
    this.qualityId = null;
    this.qualityIdError = false;
    this.length = null;
    this.lengthError = false;
    this.width = null;
    this.widthError = false;
    this.purchaseOrderId = null;
    this.purchaseOrderList = [];
    this.purchaseOrderIdIdError = false;
    this.rateWithGST = null;
    this.gst = null;
    this.rate = null;
    this.purchaseDiscount = null;
    this.orderQuantity = null;
    this.receivedQuantity = null;
    this.fomQuantityInKG = null;
    this.orderType = null;
    this.amountWithGST = null;
    this.matThicknessId = null;
    this.matThicknessIdError = false;
    if (this.categoryId != null) {
      if (this.categoryId == 7) {
        if (this.trnGoodReceiveNoteObj.supplierId != null) {
          this.getAccessoryLookUpBySupplierId(this.trnGoodReceiveNoteObj.supplierId);
        }
      } else {
        this.getCollectionList();
      }
    }
  }

  onChangeSupplier() {
    this.categoryId = null;
    this.trnGoodReceiveNoteObj.totalAmount = 0;
    this.categoryIdError = false;
    this.onCancelItemDetails();
    this.trnGoodReceiveNoteItems = [];
    if (this.trnGoodReceiveNoteObj.supplierId != null) {
      this.onChangeCategory();
    }
  }

  getAccessoryLookUpBySupplierId(supplierId) {
    this.commonService.getAccessoryLookUpBySupplierId(supplierId).subscribe(
      results => {
        this.accessoryCodeList = results;
        this.accessoryCodeList.unshift({ label: '--Select--', value: null });
        Helpers.setLoading(false);
      },
      error => {
        this.globalErrorHandler.handleError(error);
        Helpers.setLoading(false);
      });
  }

  onChangeCollection() {
    if (this.categoryId == 1 || this.categoryId == 5 || this.categoryId == 6) {
      this.collectionIdError = false;
      this.matSizeIdError = false;
      this.fomSizeIdError = false;
      this.shadeIdError = false;
      this.accessoryIdError = false;
      this.orderQuantityError = false;
      this.fomQuantityInKGError = false;
      this.shadeIdList = [];
      this.shadeIdList.unshift({ label: '--Select--', value: null });
      this.shadeId = null;
      this.fomSizeId = null;
      this.matSizeId = null;
      this.qualityId = null;
      this.qualityIdError = false;
      this.length = null;
      this.lengthError = false;
      this.width = null;
      this.widthError = false;
      this.purchaseOrderId = null;
      this.purchaseOrderList = [];
      this.purchaseOrderIdIdError = false;
      this.rateWithGST = null;
      this.gst = null;
      this.rate = null;
      this.purchaseDiscount = null;
      this.orderQuantity = null;
      this.receivedQuantity = null;
      this.fomQuantityInKG = null;
      this.orderType = null;
      this.amountWithGST = null;
      this.matThicknessId = null;
      this.matThicknessIdError = false;
      if (this.collectionId != null) {
        this.getshadeIdList();
      }
    }
    else if (this.categoryId == 2) {
      this.collectionIdError = false;
      this.matSizeIdError = false;
      this.fomSizeIdError = false;
      this.shadeIdError = false;
      this.accessoryIdError = false;
      this.orderQuantityError = false;
      this.fomQuantityInKGError = false;
      this.fomSizeList = [];
      this.fomSizeList.unshift({ label: '--Select--', value: null });
      this.fomSizeId = null;
      this.shadeId = null;
      this.matSizeId = null;
      this.qualityId = null;
      this.qualityIdError = false;
      this.length = null;
      this.lengthError = false;
      this.width = null;
      this.widthError = false;
      this.purchaseOrderId = null;
      this.purchaseOrderList = [];
      this.purchaseOrderIdIdError = false;
      this.rateWithGST = null;
      this.gst = null;
      this.rate = null;
      this.purchaseDiscount = null;
      this.orderQuantity = null;
      this.receivedQuantity = null;
      this.fomQuantityInKG = null;
      this.orderType = null;
      this.amountWithGST = null;
      this.matThicknessId = null;
      this.matThicknessIdError = false;
      if (this.collectionId != null) {
        this.getFoamSizeList();
      }
    }
    else if (this.categoryId == 4) {
      this.collectionIdError = false;
      this.matSizeIdError = false;
      this.fomSizeIdError = false;
      this.shadeIdError = false;
      this.accessoryIdError = false;
      this.orderQuantityError = false;
      this.fomQuantityInKGError = false;
      this.matSizeList = [];
      this.matSizeList.unshift({ label: '--Select--', value: null });
      this.matSizeId = null;
      this.qualityList = [];
      this.qualityList.unshift({ label: '--Select--', value: null });
      this.qualityId = null;
      this.shadeId = null;
      this.fomSizeId = null;
      this.qualityIdError = false;
      this.length = null;
      this.lengthError = false;
      this.width = null;
      this.widthError = false;
      this.purchaseOrderId = null;
      this.purchaseOrderList = [];
      this.purchaseOrderIdIdError = false;
      this.rateWithGST = null;
      this.gst = null;
      this.rate = null;
      this.purchaseDiscount = null;
      this.orderQuantity = null;
      this.receivedQuantity = null;
      this.fomQuantityInKG = null;
      this.orderType = null;
      this.amountWithGST = null;
      this.matThicknessId = null;
      this.matThicknessIdError = false;
      if (this.collectionId != null) {
        this.getMatSizeList();
        this.getMatQualityList();
      }
    } else {
      this.matSizeIdError = false;
      this.fomSizeIdError = false;
      this.shadeIdError = false;
      this.accessoryIdError = false;
      this.orderQuantityError = false;
      this.fomQuantityInKGError = false;
      this.shadeIdList = [];
      this.shadeIdList.unshift({ label: '--Select--', value: null });
      this.matSizeList = [];
      this.matSizeList.unshift({ label: '--Select--', value: null });
      this.fomSizeList = [];
      this.fomSizeList.unshift({ label: '--Select--', value: null });
      this.shadeId = null;
      this.matSizeId = null;
      this.fomSizeId = null;
      this.qualityId = null;
      this.qualityIdError = false;
      this.rate = null;
      this.length = null;
      this.lengthError = false;
      this.width = null;
      this.widthError = false;
      this.purchaseOrderId = null;
      this.purchaseOrderList = [];
      this.purchaseOrderIdIdError = false;
      this.rateWithGST = null;
      this.gst = null;
      this.purchaseDiscount = null;
      this.orderQuantity = null;
      this.receivedQuantity = null;
      this.fomQuantityInKG = null;
      this.orderType = null;
      this.amountWithGST = null;
      this.matThicknessId = null;
      this.matThicknessIdError = false;
    }
  }

  getMatSizeList() {
    if (this.collectionId != null) {
      this.trnGoodReceiveNoteService.getMatsizeTrnGoodReceiveNotes(this.collectionId).subscribe(
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
  }

  getFoamSizeList() {
    if (this.collectionId != null) {
      this.trnGoodReceiveNoteService.getFoamSizeTrnGoodReceiveNotes(this.collectionId).subscribe(
        results => {
          this.fomSizeList = results;
          this.fomSizeList.unshift({ label: '--Select--', value: null });
        },
        error => {
          this.globalErrorHandler.handleError(error);
        });
    }
  }


  getshadeIdList() {
    if (this.collectionId != null) {
      this.trnGoodReceiveNoteService.getshadeIdTrnGoodReceiveNotes(this.collectionId).subscribe(
        results => {
          this.shadeIdList = results;
          this.shadeIdList.unshift({ label: '--Select--', value: null });
        },
        error => {
          this.globalErrorHandler.handleError(error);
        });
    }
  }

  onChangeLocation() {
    if (this.trnGoodReceiveNoteObj.locationId) {
      this.commonService.getLocationById(this.trnGoodReceiveNoteObj.locationId).subscribe(
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
    this.collectionService.getCollectionForGRNByCategorynSupplierId(this.categoryId, this.trnGoodReceiveNoteObj.supplierId).subscribe(
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
    this.supplierService.getSupplierLookupForGRN().subscribe(
      results => {
        this.supplierCodeList = results;
        this.supplierCodeList.unshift({ label: '--Select--', value: null });
      },
      error => {
        this.globalErrorHandler.handleError(error);
      });
  }
  onCancel() {
    this.router.navigate(['/features/purchase/trnGoodReceiveNote/list']);
    this.disabled = false;
    this.showUpdateBtn = true;
  }

  onSubmit({ value, valid }: { value: any, valid: boolean }) {
    this.isFormSubmitted = true;
    this.trnGoodReceiveNoteObj.TrnGoodReceiveNoteItems = this.trnGoodReceiveNoteItems;
    if (this.trnGoodReceiveNoteItems.length == 0) {
      this.messageService.addMessage({ severity: 'error', summary: 'Error', detail: "Please Select Items" });
      return false;
    }
    if (valid) {
      let supplierObj = _.find(this.supplierCodeList, ['value', this.trnGoodReceiveNoteObj.supplierId]);
      this.trnGoodReceiveNoteObj.supplierName = supplierObj.label,
        this.saveTrnGoodReceiveNote(this.trnGoodReceiveNoteObj);
    }
  }


  saveTrnGoodReceiveNote(value) {
    let tempGrnDate = new Date(value.grnDate);
    value.grnDate = new Date(tempGrnDate.setHours(23));
    Helpers.setLoading(true);
    if (this.params) {
      this.trnGoodReceiveNoteService.updateTrnGoodReceiveNote(value)
        .subscribe(
        results => {
          this.params = null;
          this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: results.message });
          Helpers.setLoading(false);
          this.router.navigate(['/features/purchase/trnGoodReceiveNote/list']);
        },
        error => {
          this.globalErrorHandler.handleError(error);
          Helpers.setLoading(false);
        });
    } else {
      this.trnGoodReceiveNoteService.createTrnGoodReceiveNote(value)
        .subscribe(
        results => {
          this.params = null;
          this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: results.message });
          Helpers.setLoading(false);
          this.router.navigate(['/features/purchase/trnGoodReceiveNote/list']);
        },
        error => {
          this.globalErrorHandler.handleError(error);
          Helpers.setLoading(false);
        });
    }
  }

}