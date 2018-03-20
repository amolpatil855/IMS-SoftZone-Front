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
import { UserService } from "../../../../_services/user.service";
import { CommonService } from '../../../../_services/common.service';
import { CollectionService } from '../../../../_services/collection.service';
import { TrnProductStockService } from '../../../../_services/trnProductStock.service';
import { MatSizeService } from '../../../../_services/matSize.service';
@Component({
  selector: "app-trnPurchaseOrder-add-edit",
  templateUrl: "./trnPurchaseOrder-add-edit.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class TrnPurchaseOrderAddEditComponent implements OnInit {
  trnPurchaseOrderForm: any;
  params: number;
  userRole: string;
  adminFlag: boolean = false;
  status: boolean = false;
  viewItem: boolean = true;
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
  matThicknessId = null;
  collectionId = null;
  trnPurchaseOrderItems = [];
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
  shadeIdError = false;
  lengthError = false;
  widthError = false;
  orderQuantityError = false;
  matThicknessIdError = false;
  accessoryIdError = false;
  fomSizeIdError = false;
  matSizeIdError = false;
  qualityIdError = false;
  courierList = [];
  courierModeList = [];
  matSizeList = [];
  fomSizeList = [];
  matSizeId = null;
  fomSizeId = null;
  qualityId = null;
  rate = null;
  amountWithGST = null;
  rateWithGST = null;
  qualityList = [];
  thicknessList = [];
  tempPurchaseDiscount = 0;
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
    custRatePerSqFeet: null,
    purchaseDiscount: null
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
    private userService: UserService,
    private commonService: CommonService,
    private trnPurchaseOrderService: TrnPurchaseOrderService,
    private globalErrorHandler: GlobalErrorHandler,
    private confirmationService: ConfirmationService,
    private collectionService: CollectionService,
    private messageService: MessageService,
    private trnProductStockService: TrnProductStockService,
    private matSizeService: MatSizeService
  ) {
  }

  ngOnInit() {
    this.trnPurchaseOrderObj = new TrnPurchaseOrder();
    this.getLoggedInUserDetail();
    this.getSupplierCodeList();
    this.getLocationList();
    this.getCategoryCodeList();
    this.getCourierList();
    //this.getAccessoryLookup();
    let today = new Date();
    this.locationObj = {};
    this.disabled = false;
    this.trnPurchaseOrderObj.orderDate = today;
    // this.newItem();
    this.courierModeList.push({ label: '--Select--', value: null });
    this.courierModeList.push({ label: 'Surface', value: 'Surface' });
    this.courierModeList.push({ label: 'Air', value: 'Air' });
    this.route.params.forEach((params: Params) => {
      this.params = params['id'];
    });
    if (this.params) {

      this.viewItem = false;
      this.disabled = true;
      this.getTrnPurchaseOrderById(this.params);
    }
    else {
      this.status = true;
    }
  }

  getLoggedInUserDetail() {
    this.userService.getLoggedInUserDetail().subscribe(res => {
      this.userRole = res.mstRole.roleName;
      if (this.userRole == "Administrator") {
        this.adminFlag = true;
      } else {
        this.adminFlag = false;
      }
    });
  }

  onCancelPO() {
    Helpers.setLoading(true);
    if (this.params) {
      this.trnPurchaseOrderService.cancelPurchaseOrder(this.trnPurchaseOrderObj)
        .subscribe(
        results => {
          this.params = null;
          this.status = false;
          this.viewItem = false;
          Helpers.setLoading(false);
          this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: results.message });
          this.router.navigate(['/features/purchase/trnPurchaseOrder/list']);
          this.disabled = false;
          this.viewItem = true;

        },
        error => {
          this.globalErrorHandler.handleError(error);
          Helpers.setLoading(false);
        });
    }
  }


  onApprove() {
    Helpers.setLoading(true);
    if (this.params) {
      this.trnPurchaseOrderService.approvePurchaseOrder(this.trnPurchaseOrderObj)
        .subscribe(
        results => {
          this.params = null;
          this.status = false;
          this.viewItem = false;
          this.trnPurchaseOrderObj.status = 'Approved';
          this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: results.message });
          Helpers.setLoading(false);
        },
        error => {
          this.globalErrorHandler.handleError(error);
          Helpers.setLoading(false);
        });
    }
  }

  getTrnPurchaseOrderById(id) {
    Helpers.setLoading(true);
    this.trnPurchaseOrderService.getTrnPurchaseOrderById(id).subscribe(
      results => {
        this.trnPurchaseOrderObj = results;
        this.trnPurchaseOrderObj.orderDate = new Date(this.trnPurchaseOrderObj.orderDate);
        if (this.trnPurchaseOrderObj.status == "Created") {
          this.status = true;
        } else {
          this.status = false;
        }
        if (this.trnPurchaseOrderObj.status != "Created") {
          this.viewItem = false;
        } else {
          this.viewItem = true;
        }
        this.trnPurchaseOrderItems = results.trnPurchaseOrderItems;
        // _.forEach(this.trnPurchaseOrderItems, function (value) {
        //   if (value.mstCategory != null)
        //     value.categoryName = value.mstCategory.code;

        //   if (value.mstCollection != null)
        //     value.collectionName = value.mstCollection.collectionCode;

        // });
        delete this.trnPurchaseOrderObj['trnPurchaseOrderItems'];
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

    if (!this.orderQuantity)
      this.orderQuantityError = true;
    else
      this.orderQuantityError = false;

    if (this.orderQuantityError || this.widthError || this.matThicknessIdError || this.fomSizeIdError || this.matSizeIdError || this.qualityIdError || this.accessoryIdError
      || this.lengthError || this.shadeIdError || this.collectionIdError || this.categoryIdError) {
      return false;
    }


    if (this.trnPurchaseOrderItems.length > 0) {

      let poObj = _.find(this.trnPurchaseOrderItems, ['categoryId', this.categoryId]);
      if (poObj != null) {
        if (this.accessoryId == poObj.accessoryId && this.shadeId == poObj.shadeId && this.fomSizeId == poObj.fomSizeId && this.matSizeId == poObj.matSizeId) {
          this.messageService.addMessage({ severity: 'error', summary: 'Error', detail: "Cannot add duplicate items." });
          return false;
        }
      }
    }

    let catObj = _.find(this.categoriesCodeList, ['value', this.categoryId]);
    let collObj = _.find(this.collectionList, ['value', this.collectionId]);
    let accessoryObj = _.find(this.accessoryCodeList, ['value', this.accessoryId]);
    let shadeObj = _.find(this.shadeIdList, ['value', this.shadeId]);
    let fomSizeObj = _.find(this.fomSizeList, ['value', this.fomSizeId]);
    let matSizeObj = _.find(this.matSizeList, ['value', this.matSizeId]);
    if (matSizeObj && matSizeObj.value == -1) {
      matSizeObj.label = this.matSizeCode;
    }
    if (this.trnPurchaseOrderObj.totalAmount == null) {
      this.trnPurchaseOrderObj.totalAmount = 0;
    }
    this.trnPurchaseOrderObj.totalAmount = this.trnPurchaseOrderObj.totalAmount + this.amountWithGST;

    let itemObj = {
      categoryId: this.categoryId,
      categoryName: catObj ? catObj.label != "--Select--" ? catObj.label : '' : '',
      collectionName: collObj ? collObj.label != "--Select--" ? collObj.label : '' : '',
      collectionId: this.collectionId,
      serialno: this.shadeId ? shadeObj.label != "--Select--" ? shadeObj.label : '' : '',
      size: this.fomSizeId ? fomSizeObj.label : this.matSizeId ? matSizeObj.label != "--Select--" ? matSizeObj.label : '' : '',
      accessoryName: accessoryObj ? accessoryObj.label != "--Select--" ? accessoryObj.label : '' : '',
      accessoryId: this.accessoryId,
      shadeId: this.shadeId,
      fomSizeId: this.fomSizeId,
      matSizeId: this.matSizeId,
      matQualityId: this.qualityId,
      matThicknessId: this.matThicknessId,
      orderQuantity: this.orderQuantity,
      rateWithGST: this.rateWithGST,
      rate: this.rate,
      gst: this.productDetails.gst,
      amount: this.amount,
      amountWithGST: this.amountWithGST,
      orderType: this.orderType,
      length: this.length,
      width: this.width,
      matSizeCode: this.matSizeCode
    };
    this.trnPurchaseOrderItems.push(itemObj);
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
    this.lengthError = null;
    this.widthError = null;
    this.orderQuantity = null;
    this.rateWithGST = null;
    this.rate = null;
    this.matSizeCode = null;
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
      purchaseDiscount: null
    };
    this.amount = null,
      this.tempPurchaseDiscount = 0;
    this.orderType = '';
    this.amountWithGST = '';
  }

  enableEdit(row) {
    row.enable = true;
  }
  cancelEdit(row) {
    row.enable = false;
  }

  calculateProductStockDetails() {

    let parameterId = null;
    if (this.categoryId == 1 || this.categoryId == 5 || this.categoryId == 6) {
      this.shadeIdError = false;
      this.orderQuantityError = false;
      this.productDetails.stock = null;
      this.productDetails.purchaseDiscount = null;
      this.tempPurchaseDiscount = 0;
      this.productDetails.gst = null;
      this.rateWithGST = null;
      this.rate = null;
      this.orderQuantity = null;
      this.amount = null,
        this.matSizeCode = null;
      this.orderType = '';
      this.amountWithGST = null;
      if (this.shadeId != null) {
        parameterId = this.shadeId;
        this.trnProductStockService.getAllTrnProductStocks(this.categoryId, this.collectionId, parameterId, this.qualityId, null, null).subscribe(
          data => {
            this.productDetails = data;
          }, error => {
            this.globalErrorHandler.handleError(error);
          });
      }
    }
    else if (this.categoryId == 2) {
      this.fomSizeIdError = false;
      this.orderQuantityError = false;
      this.productDetails.stock = null;
      this.productDetails.purchaseDiscount = null;
      this.tempPurchaseDiscount = 0;
      this.productDetails.gst = null;
      this.rateWithGST = null;
      this.rate = null;
      this.matSizeCode = null;
      this.orderQuantity = null;
      this.amount = null,
        this.orderType = '';
      this.amountWithGST = null;
      if (this.fomSizeId != null) {
        parameterId = this.fomSizeId;
        this.trnProductStockService.getAllTrnProductStocks(this.categoryId, this.collectionId, parameterId, this.qualityId, null, null).subscribe(
          data => {
            this.productDetails = data;
          }, error => {
            this.globalErrorHandler.handleError(error);
          });
      }
    }
    else if (this.categoryId == 4 && this.matSizeId != -1) {
      this.matThicknessIdError = false;
      this.qualityId = null;
      this.thicknessList = [];
      this.thicknessList.unshift({ label: '--Select--', value: null });
      this.matThicknessId = null;
      this.matSizeIdError = false;
      this.orderQuantityError = false;
      this.productDetails.stock = null;
      this.productDetails.purchaseDiscount = null;
      this.tempPurchaseDiscount = 0;
      this.productDetails.gst = null;
      this.length = null;
      this.lengthError = false;
      this.width = null;
      this.widthError = false;
      this.rateWithGST = null;
      this.rate = null;
      this.orderQuantity = null;
      this.amount = null,
        this.orderType = '';
      this.amountWithGST = null;
      if (this.matSizeId != null) {
        parameterId = this.matSizeId;
        this.trnProductStockService.getAllTrnProductStocks(this.categoryId, this.collectionId, parameterId, this.qualityId, null, null).subscribe(
          data => {
            this.productDetails = data;
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
      this.orderQuantityError = false;
      this.productDetails.stock = null;
      this.productDetails.purchaseDiscount = null;
      this.tempPurchaseDiscount = 0;
      this.productDetails.gst = null;
      this.rateWithGST = null;
      this.rate = null;
      this.orderQuantity = null;
      this.matSizeCode = null;
      this.amount = null,
        this.orderType = '';
      this.amountWithGST = null;
      if (this.accessoryId != null) {
        parameterId = this.accessoryId;
        this.trnProductStockService.getAllTrnProductStocks(this.categoryId, this.collectionId, parameterId, this.qualityId, null, null).subscribe(
          data => {
            this.productDetails = data;
          }, error => {
            this.globalErrorHandler.handleError(error);
          });
      }
    }
    else {
      parameterId = null;
    }
    //this.shadeId ? this.shadeId : this.fomSizeId ? this.fomSizeId : this.matSizeId != -1 ? this.matSizeId : null;
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
    //this.calculateProductStockDetails();
    this.qualityIdError = false;
    this.matSizeIdError = false;
    this.orderQuantityError = false;
    this.orderQuantity = null;
    this.matThicknessIdError = false;
    this.productDetails.stock = null;
    this.productDetails.purchaseDiscount = null;
    this.tempPurchaseDiscount = 0;
    this.productDetails.gst = null;
    this.lengthError = false;
    this.length = null;
    this.width = null;
    this.widthError = false;
    this.rateWithGST = null;
    this.rate = null;
    this.orderQuantity = null;
    this.amount = null,
      this.orderType = '';
    this.amountWithGST = null;


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
    this.orderQuantityError = false;
    this.orderQuantity = null;
    this.matThicknessIdError = false;
    this.productDetails.stock = null;
    this.productDetails.purchaseDiscount = null;
    this.tempPurchaseDiscount = 0;
    this.productDetails.gst = null;
    this.lengthError = false;
    this.widthError = false;
    this.rateWithGST = null;
    this.rate = null;
    this.amount = null,
      this.orderType = '';
    this.amountWithGST = null;
    if (this.qualityId != null && this.matSizeCode && this.matThicknessId != null) {
      this.trnProductStockService.getAllTrnProductStocks(this.categoryId, this.collectionId, null, this.qualityId, this.matThicknessId, this.matSizeCode).subscribe(
        data => {
          this.productDetails = data;
        }, error => {
          this.globalErrorHandler.handleError(error);
        });
    }
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
          if (this.trnPurchaseOrderObj.totalAmount >= 0) {
            if (this.trnPurchaseOrderItems.length > 0) {
              this.trnPurchaseOrderObj.totalAmount = this.trnPurchaseOrderObj.totalAmount - this.trnPurchaseOrderItems[index].amountWithGST;
            } else {
              this.trnPurchaseOrderObj.totalAmount = 0;
            }
          }
          this.trnPurchaseOrderItems.splice(index, 1);
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
      if (this.trnPurchaseOrderObj.totalAmount >= 0) {
        if (this.trnPurchaseOrderItems.length > 0) {
          this.trnPurchaseOrderObj.totalAmount = this.trnPurchaseOrderObj.totalAmount - this.trnPurchaseOrderItems[index].amountWithGST;
        } else {
          this.trnPurchaseOrderObj.totalAmount = 0;
        }
      }
      this.trnPurchaseOrderItems.splice(index, 1);
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
      this.width = parseFloat(this.width).toFixed(2);
      this.length = parseFloat(this.length).toFixed(2);
      this.matSizeCode = this.length + 'x' + this.width;
      this.onThicknessChange();
    }
    else {
      this.matSizeCode = '';
      this.matSizeIdError = false;
      this.orderQuantityError = false;
      this.orderQuantity = null;
      this.matThicknessIdError = false;
      this.productDetails.stock = null;
      this.productDetails.purchaseDiscount = null;
      this.tempPurchaseDiscount = 0;
      this.productDetails.gst = null;
      this.lengthError = false;
      this.widthError = false;
      this.rateWithGST = null;
      this.rate = null;
      this.orderQuantity = null;
      this.amount = null,
        this.orderType = '';
      this.amountWithGST = null;
    }

  }

  changeOrderType() {
    this.orderQuantityError = false;
    if (this.orderQuantity >= 50) {
      this.orderType = 'RL';
    }
    else {
      if (!this.orderQuantity)
        this.orderType = '';
      else
        this.orderType = 'CL';
    }


    if (this.categoryId == 2) {

      this.rate = ((this.productDetails.purchaseRatePerMM * this.productDetails.suggestedMM) / 2592) * this.productDetails.length * this.productDetails.width;
      this.rateWithGST = parseFloat(this.rate + (this.rate * this.productDetails.gst) / 100).toFixed(2);
      //this.amountWithGST = this.rate * this.orderQuantity;
      this.amount = this.rate * this.orderQuantity;
      this.rate = parseFloat(this.rate).toFixed(2);
      this.amount = Math.round(this.amount - ((this.amount * this.productDetails.purchaseDiscount) / 100));
      // this.amountWithGST= this.amountWithGST -  ((this.amountWithGST * this.productDetails.purchaseDiscount)/100);
      this.amountWithGST = Math.round(this.amount + (this.amount * this.productDetails.gst) / 100);
      this.tempPurchaseDiscount = this.productDetails.purchaseDiscount;
    }
    else if (this.categoryId == 1 || this.categoryId == 5 || this.categoryId == 6) {
      let applyDiscount = false;
      this.rate = (this.productDetails.purchaseFlatRate ? this.productDetails.purchaseFlatRate : this.orderQuantity >= 50 ? this.productDetails.roleRate : this.productDetails.cutRate);
      applyDiscount = (this.productDetails.purchaseFlatRate ? true : this.orderQuantity >= 50 ? true : false);
      this.rateWithGST = parseFloat(this.rate + (this.rate * this.productDetails.gst) / 100).toFixed(2);
      // this.amountWithGST = this.rateWithGST * this.orderQuantity;
      this.amount = this.rate * this.orderQuantity;
      this.rate = parseFloat(this.rate).toFixed(2);
      if (applyDiscount) {
        this.amount = Math.round(this.amount - ((this.amount * this.productDetails.purchaseDiscount) / 100));
        this.tempPurchaseDiscount = this.productDetails.purchaseDiscount;
      }
      else
        this.tempPurchaseDiscount = 0;

      this.amountWithGST = Math.round(this.amount + ((this.amount * this.productDetails.gst) / 100));

    }
    else if (this.categoryId == 4) {
      if (this.matSizeId != -1) {
        this.rate = this.productDetails.purchaseRate;
        this.rateWithGST = parseFloat(this.rate + (this.rate * this.productDetails.gst) / 100).toFixed(2);
        this.amount = Math.round(this.rate * this.orderQuantity);
        this.amountWithGST = Math.round(this.amount + ((this.amount * this.productDetails.gst) / 100));
        this.tempPurchaseDiscount = 0;
      }
      else {
        this.rate = ((this.length * this.width) / 1550.5) * this.productDetails.custRatePerSqFeet;

        // this.rate = this.rate - Math.round((this.rate) / 100);
        this.rateWithGST = parseFloat(this.rate + (this.rate * this.productDetails.gst) / 100).toFixed(2);
        // this.amountWithGST = this.rateWithGST * this.orderQuantity;
        this.amount = this.rate * this.orderQuantity;
        this.rate = parseFloat(this.rate).toFixed(2);
        //this.amountWithGST= Math.round( this.amountWithGST -  ( (this.amountWithGST * this.productDetails.purchaseDiscount)/100));
        this.amount = Math.round(this.amount - ((this.amount * this.productDetails.purchaseDiscount) / 100));
        this.amountWithGST = Math.round(this.amount + ((this.amount * this.productDetails.gst) / 100));
        this.tempPurchaseDiscount = this.productDetails.purchaseDiscount;
      }
    }
    else if (this.categoryId == 7) {
      this.rate = this.productDetails.purchaseRate;
      this.rateWithGST = parseFloat(this.rate + (this.rate * this.productDetails.gst) / 100).toFixed(2);
      // this.amountWithGST =this.rateWithGST * this.orderQuantity;
      this.amount = this.rate * this.orderQuantity;
      //this.amountWithGST= Math.round( this.amountWithGST -  ( (this.amountWithGST * this.productDetails.purchaseDiscount)/100));
      //this.amount = Math.round(this.amount - ((this.amount * this.productDetails.purchaseDiscount) / 100));
      this.amountWithGST = Math.round(this.amount + ((this.amount * this.productDetails.gst) / 100));
      this.tempPurchaseDiscount = 0;

    }
  }


  onChangeSupplier() {
    this.categoryId = null;
    this.categoryIdError = false;
    this.trnPurchaseOrderObj.totalAmount = 0;
    this.onCancelItemDetails();
    this.trnPurchaseOrderItems = [];
    if (this.trnPurchaseOrderObj.supplierId != null) {
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
    this.matThicknessId = null;
    this.matThicknessIdError = false;
    this.orderQuantityError = false;
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
    this.matSizeCode = null;
    this.productDetails.stock = null;
    this.productDetails.purchaseDiscount = null;
    this.productDetails.gst = null;
    this.length = null;
    this.lengthError = false;
    this.width = null;
    this.widthError = false;
    this.rateWithGST = null;
    this.rate = null;
    this.orderQuantity = null;
    this.amount = null,
      this.orderType = '';
    this.amountWithGST = null;
    if (this.categoryId != null) {
      if (this.categoryId == 7) {
        if (this.trnPurchaseOrderObj.supplierId != null) {
          this.getAccessoryLookUpBySupplierId(this.trnPurchaseOrderObj.supplierId);
        }
      } else {
        this.getCollectionList();
      }
    }
  }

  onChangeCollection() {
    if (this.categoryId == 1 || this.categoryId == 5 || this.categoryId == 6) {
      this.collectionIdError = false;
      this.shadeIdList = [];
      this.shadeIdList.unshift({ label: '--Select--', value: null });
      this.shadeIdError = false;
      this.shadeId = null;
      this.matSizeCode = null;
      this.productDetails.stock = null;
      this.productDetails.purchaseDiscount = null;
      this.tempPurchaseDiscount = 0;
      this.productDetails.gst = null;
      this.length = null;
      this.lengthError = false;
      this.width = null;
      this.widthError = false;
      this.rateWithGST = null;
      this.rate = null;
      this.orderQuantity = null;
      this.amount = null,
        this.orderType = '';
      this.amountWithGST = null;
      this.orderQuantityError = false;
      if (this.collectionId != null) {
        this.getshadeIdList();
      }
    }
    else if (this.categoryId == 2) {
      this.collectionIdError = false;
      this.fomSizeList = [];
      this.fomSizeList.unshift({ label: '--Select--', value: null });
      this.fomSizeIdError = false;
      this.orderQuantityError = false;
      this.fomSizeId = null;
      this.matSizeCode = null;
      this.productDetails.stock = null;
      this.productDetails.purchaseDiscount = null;
      this.tempPurchaseDiscount = 0;
      this.productDetails.gst = null;
      this.length = null;
      this.lengthError = false;
      this.width = null;
      this.widthError = false;
      this.rateWithGST = null;
      this.rate = null;
      this.orderQuantity = null;
      this.amount = null,
        this.orderType = '';
      this.amountWithGST = null;
      if (this.collectionId != null) {
        this.getFoamSizeList();
      }
    }
    else if (this.categoryId == 4) {
      this.collectionIdError = false;
      this.matSizeList = [];
      this.matSizeList.unshift({ label: '--Select--', value: null });
      this.matSizeIdError = false;
      this.matSizeId = null;
      this.qualityList = [];
      this.qualityList.unshift({ label: '--Select--', value: null });
      this.qualityIdError = false;
      this.qualityId = null;
      this.thicknessList = [];
      this.thicknessList.unshift({ label: '--Select--', value: null });
      this.matThicknessId = null;
      this.orderQuantityError = false;
      this.productDetails.stock = null;
      this.productDetails.purchaseDiscount = null;
      this.tempPurchaseDiscount = 0;
      this.productDetails.gst = null;
      this.length = null;
      this.lengthError = false;
      this.width = null;
      this.widthError = false;
      this.rateWithGST = null;
      this.rate = null;
      this.orderQuantity = null;
      this.amount = null,
        this.orderType = '';
      this.amountWithGST = null;
      if (this.collectionId != null) {
        this.getMatSizeList();
        this.getMatQualityList();
      }
    } else {
      this.categoryIdError = true;
      this.collectionIdError = true;
      this.productDetails.stock = null;
      this.productDetails.purchaseDiscount = null;
      this.tempPurchaseDiscount = 0;
      this.productDetails.gst = null;
      this.shadeIdList = [];
      this.shadeIdList.unshift({ label: '--Select--', value: null });
      this.matSizeList = [];
      this.matSizeList.unshift({ label: '--Select--', value: null });
      this.fomSizeList = [];
      this.fomSizeList.unshift({ label: '--Select--', value: null });
      this.shadeIdError = false;
      this.matSizeIdError = false;
      this.fomSizeIdError = false;
      this.qualityIdError = false;
      this.orderQuantityError = false;
      this.shadeId = null;
      this.matSizeId = null;
      this.fomSizeId = null;
      this.qualityId = null;
      this.matSizeCode = null;
      this.productDetails.stock = null;
      this.productDetails.purchaseDiscount = null;
      this.tempPurchaseDiscount = 0;
      this.productDetails.gst = null;
      this.length = null;
      this.lengthError = false;
      this.width = null;
      this.widthError = false;
      this.rateWithGST = null;
      this.rate = null;
      this.orderQuantity = null;
      this.amount = null,
        this.orderType = '';
      this.amountWithGST = null;
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
        this.fomSizeList = results;
        this.fomSizeList.unshift({ label: '--Select--', value: null });
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
    if ((this.trnPurchaseOrderObj.supplierId != null) && (this.categoryId != null)) {
      this.trnPurchaseOrderService.getCollectionBySuppliernCategoryId(this.trnPurchaseOrderObj.supplierId, this.categoryId).subscribe(
        results => {
          this.collectionList = results;
          this.collectionList.unshift({ label: '--Select--', value: null });
        },
        error => {
          this.globalErrorHandler.handleError(error);
        });
    }
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
    this.disabled = false;
    this.viewItem = true;
  }

  onSubmit({ value, valid }: { value: any, valid: boolean }) {
    this.isFormSubmitted = true;
    this.trnPurchaseOrderObj.TrnPurchaseOrderItems = this.trnPurchaseOrderItems;
    if (this.trnPurchaseOrderItems.length == 0) {
      this.messageService.addMessage({ severity: 'error', summary: 'Error', detail: "Please Select Items" });
      return false;
    }
    if (valid) {
      let supplierObj = _.find(this.supplierCodeList, ['value', this.trnPurchaseOrderObj.supplierId]);
      let couierObj = _.find(this.courierList, ['value', this.trnPurchaseOrderObj.courierId]);
      let shippingAddress = "";
      this.trnPurchaseOrderObj.courierName = couierObj.label;
      this.trnPurchaseOrderObj.supplierName = supplierObj.label;
      if (this.locationObj) {
        if (this.locationObj.addressLine1 != null) {
          this.trnPurchaseOrderObj.shippingAddress = this.locationObj.addressLine1 + this.locationObj.addressLine2 + ", " + this.locationObj.state + ", " + this.locationObj.city + ", PINCODE -" + this.locationObj.pin;
        } else {
          this.trnPurchaseOrderObj.shippingAddress = "";
        }
      } else {
        this.trnPurchaseOrderObj.shippingAddress = "";
      }
      this.saveTrnPurchaseOrder(this.trnPurchaseOrderObj);
    }
  }


  saveTrnPurchaseOrder(value) {
    let tempOrderDate = new Date(value.orderDate);
    value.orderDate = new Date(tempOrderDate.setHours(23));
    Helpers.setLoading(true);
    if (this.params) {
      this.trnPurchaseOrderService.updateTrnPurchaseOrder(value)
        .subscribe(
        results => {
          this.params = null;
          this.messageService.addMessage({ severity: results.type.toLowerCase(), summary: results.type, detail: results.message });
          Helpers.setLoading(false);
          this.router.navigate(['/features/purchase/trnPurchaseOrder/list']);
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
          this.messageService.addMessage({ severity: results.type.toLowerCase(), summary: results.type, detail: results.message });
          Helpers.setLoading(false);
          this.router.navigate(['/features/purchase/trnPurchaseOrder/list']);
        },
        error => {
          this.globalErrorHandler.handleError(error);
          Helpers.setLoading(false);
        });
    }
  }

}
