import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash/index';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { ConfirmationService, DataTableModule, LazyLoadEvent, SelectItem } from 'primeng/primeng';
import { GlobalErrorHandler } from '../../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../../_services/message.service';
import { UserService } from "../../../../_services/user.service";
import { TrnSalesOrderService } from '../../../../_services/trnSalesOrder.service';
import { ShadeService } from '../../../../_services/shade.service';
import { FomSizeService } from '../../../../_services/fomSize.service';
import { MatSizeService } from '../../../../_services/matSize.service';
import { ScriptLoaderService } from '../../../../../../../_services/script-loader.service';
import { CommonService } from '../../../../_services/common.service';
import { Helpers } from "../../../../../../../helpers";
import { TrnSaleOrder } from "../../../../_models/trnSaleOrder";
import { TrnProductStockService } from '../../../../_services/trnProductStock.service';
import { CollectionService } from '../../../../_services/collection.service';

@Component({
  selector: "app-trnSalesOrder-add-edit",
  templateUrl: "./trnSalesOrder-add-edit.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class TrnSalesOrderAddEditComponent implements OnInit {
  trnSalesOrderForm: any;
  trnSalesOrderObj: any;
  userRole: string;
  params: number;
  adminFlag: boolean = false;
  status: boolean = true;
  viewItem: boolean = true;
  trnSalesOrderList = [];
  categoryList: SelectItem[];
  discountOnRate = null;
  givenDiscount = null;
  selectedCourierMode = null;
  selectedAgent = null;
  agentList = [];
  collectionList = [];
  addressList = [];
  categoriesCodeList = [];
  shadeIdList = [];
  categoryId = null;
  matThicknessId = null;
  collectionId = null;
  trnSaleOrderItems = [];
  shadeId = null;
  orderQuantity = null;
  orderType = null;
  locationObj = null;
  length = null;
  width = null;
  selectedAddress: any;
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
  givenDiscountError = false;
  courierList = [];
  courierModeList = [];
  paymentModeList = [];
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
  productDetails = {
    sellingRate: null,
    flatRate: null,
    sellingRatePerMM: null,
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
    rrp: null,
    maxFlatRateDisc: null,
    maxRoleRateDisc: null,
    maxCutRateDisc: null,
    maxDiscount: null
  };
  accessoryId = null;
  accessoryCodeList = [];
  amount = null;
  disabled: boolean = false;
  shippingAddressObj = null;
  shippingAddress = null;
  selectedRadio: boolean;
  display: boolean = false;
  shadeEnable: boolean = false;
  matEnable: boolean = false;
  fomEnable: boolean = false;
  customerList = [];
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private trnSalesOrderService: TrnSalesOrderService,
    private shadeService: ShadeService,
    private fomSizeService: FomSizeService,
    private collectionService: CollectionService,
    private matSizeService: MatSizeService,
    private globalErrorHandler: GlobalErrorHandler,
    private confirmationService: ConfirmationService,
    private commonService: CommonService,
    private trnProductStockService: TrnProductStockService,
    private messageService: MessageService) {
  }

  ngOnInit() {
    this.trnSalesOrderObj = new TrnSaleOrder();
    this.getLoggedInUserDetail();
    this.getCategoryCodeList();
    this.getCourierList();
    this.getAgentLookUp();
    this.getCustomerLookUp();
    let today = new Date();
    this.locationObj = {};
    this.disabled = false;
    this.trnSalesOrderObj.orderDate = today;
    this.trnSalesOrderObj.chequeDate = today;
    this.trnSalesOrderObj.customerId = null;
    this.trnSalesOrderObj.courierId = null;
    this.trnSalesOrderObj.courierMode = null;
    this.trnSalesOrderObj.referById = null;
    this.trnSalesOrderObj.paymentMode = null;
    this.categoryId = null;
    // this.newItem();
    this.shippingAddress = null;
    this.courierModeList.push({ label: '--Select--', value: null });
    this.courierModeList.push({ label: 'Surface', value: 'Surface' });
    this.courierModeList.push({ label: 'Air', value: 'Air' });
    this.paymentModeList.push({ label: '--Select--', value: null });
    this.paymentModeList.push({ label: 'Cash', value: 'Cash' });
    this.paymentModeList.push({ label: 'Card', value: 'Card' });
    this.paymentModeList.push({ label: 'Credit', value: 'Credit' });
    this.paymentModeList.push({ label: 'Bank Transfer', value: 'Bank Transfer' });
    this.paymentModeList.push({ label: 'Cheque', value: 'Cheque' });

    this.route.params.forEach((params: Params) => {
      this.params = params['id'];
    });
    if (this.params) {
      this.disabled = true;
      this.getTrnSalesOrderById(this.params);
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

  onApprove() {
    if (this.params) {
      this.trnSalesOrderObj.TrnSaleOrderItems = this.trnSaleOrderItems;
      Helpers.setLoading(true);
      this.trnSalesOrderService.updateTrnSaleOrder(this.trnSalesOrderObj)
        .subscribe(
        results => {
          this.onApproveSalesOrder();
        },
        error => {
          this.globalErrorHandler.handleError(error);
          Helpers.setLoading(false);
        });
    }
  }

  onApproveSalesOrder() {
    this.trnSalesOrderService.approveSalesOrder(this.trnSalesOrderObj)
      .subscribe(
      results => {
        this.params = null;
        this.status = false;
        this.viewItem = false;
        this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: results.message });
        Helpers.setLoading(false);
        this.router.navigate(['/features/sales/trnSalesOrder/list']);
      },
      error => {
        this.globalErrorHandler.handleError(error);
        Helpers.setLoading(false);
      });
  }

  cancelSO() {
    Helpers.setLoading(true);
    this.trnSalesOrderService.cancelSO(this.trnSalesOrderObj).subscribe(
      results => {
        this.messageService.addMessage({ severity: results.type.toLowerCase(), summary: results.type, detail: results.message });
        Helpers.setLoading(false);
        this.router.navigate(['/features/sales/trnSalesOrder/list']);
      },
      error => {
        this.globalErrorHandler.handleError(error);
        Helpers.setLoading(false);
      });
  }

  getCustomerLookUp() {
    Helpers.setLoading(true);
    this.trnSalesOrderService.getCustomerLookUp().subscribe(
      results => {
        this.customerList = results;
        this.customerList.unshift({ label: '--Select--', value: null });
        Helpers.setLoading(false);
      },
      error => {
        this.globalErrorHandler.handleError(error);
        Helpers.setLoading(false);
      });
  }

  getTrnSalesOrderById(id) {
    Helpers.setLoading(true);
    this.trnSalesOrderService.getTrnSaleOrderById(id).subscribe(
      results => {
        this.trnSalesOrderObj = results;
        if (this.trnSalesOrderObj.status == "Created") {
          this.status = true;
          this.viewItem = true;
        } else {
          this.status = false;
          this.viewItem = false;
        }
        this.trnSalesOrderObj.orderDate = new Date(this.trnSalesOrderObj.orderDate);
        this.trnSalesOrderObj.expectedDeliveryDate = new Date(this.trnSalesOrderObj.expectedDeliveryDate);
        if (this.trnSalesOrderObj.expectedDeliveryDate.getFullYear() < 2017) {
          this.trnSalesOrderObj.expectedDeliveryDate = null;
        }
        this.trnSalesOrderObj.chequeDate = new Date(this.trnSalesOrderObj.chequeDate);
        this.trnSaleOrderItems = results.trnSaleOrderItems;
        this.addressList = results.mstCustomer.mstCustomerAddresses;
        let shippingAddressId = this.trnSalesOrderObj.shippingAddressId;
        this.shippingAddressObj = _.find(this.addressList, function (o) { return o.id == shippingAddressId; });
        // _.forEach(this.trnSaleOrderItems, function (value) {
        //   if (value.mstCategory != null)
        //     value.categoryName = value.mstCategory.code;
        //   if (value.mstCollection != null)
        //     value.collectionName = value.mstCollection.collectionCode;

        // });
        delete this.trnSalesOrderObj['trnSaleOrderItems'];
        //this.shippingAddressObj = results.MstCustomer;
        Helpers.setLoading(false);
      },
      error => {
        this.globalErrorHandler.handleError(error);
        Helpers.setLoading(false);
      });
  }
  onRadioBtnClick(data) {
    this.shippingAddressObj = data;
    this.trnSalesOrderObj.shippingAddressId = this.shippingAddressObj.id;// + this.shippingAddressObj.addressLine2 + ", " + this.shippingAddressObj.state + ", " + this.shippingAddressObj.city + ", PINCODE -" + this.shippingAddressObj.pin;
    this.display = false;
  }

  onDateSelect() {
    if (this.trnSalesOrderObj.expectedDeliveryDate < this.trnSalesOrderObj.orderDate) {
      this.trnSalesOrderObj.expectedDeliveryDate = new Date();
    }
  }

  showDialog() {
    this.display = true;
  }

  addItemToList() {
    if (!this.categoryId)
      this.categoryIdError = true;
    else
      this.categoryIdError = false;


    if (!this.givenDiscount && this.categoryId != 7)
      this.givenDiscountError = true;
    else
      this.givenDiscountError = false;

    if (!this.collectionId && this.categoryId != 7)
      this.collectionIdError = true;
    else
      this.collectionIdError = false;

    if (!this.accessoryId && this.categoryId == 7)
      this.accessoryIdError = true;
    else
      this.accessoryIdError = false;

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
    if (this.orderQuantityError || this.widthError || this.fomSizeIdError || this.matSizeIdError || this.qualityIdError || this.accessoryIdError
      || this.lengthError || this.shadeIdError || this.collectionIdError || this.categoryIdError || this.givenDiscountError) {
      return false;
    }

    if (this.trnSaleOrderItems.length > 0) {

      let soObj = _.find(this.trnSaleOrderItems, ['categoryId', this.categoryId]);
      if (soObj != null) {
        if (this.accessoryId == soObj.accessoryId && this.shadeId == soObj.shadeId && this.fomSizeId == soObj.fomSizeId && this.matSizeId == soObj.matSizeId) {
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

    if (this.trnSalesOrderObj.totalAmount == null) {
      this.trnSalesOrderObj.totalAmount = 0;
    }
    this.trnSalesOrderObj.totalAmount = Math.round(parseFloat(this.trnSalesOrderObj.totalAmount) + parseFloat(this.amountWithGST));

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
      availableStock: this.productDetails.stock,
      orderQuantity: this.orderQuantity,
      rateWithGST: this.rateWithGST,
      rate: this.rate,
      gst: this.productDetails.gst,
      discountPercentage: this.givenDiscount,
      amount: this.amount,
      amountWithGST: this.amountWithGST,
      orderType: this.orderType,
      length: this.length,
      width: this.width,
      matSizeCode: this.matSizeCode,
    };

    this.trnSaleOrderItems.push(itemObj);
    this.onCancelItemDetails();
  }

  onCancelItemDetails() {
    this.categoryIdError = false;
    this.collectionIdError = false;
    this.accessoryIdError = false;
    this.shadeIdError = false;
    this.lengthError = false;
    this.widthError = false;
    this.orderQuantityError = false;
    this.givenDiscountError = false;
    this.categoryId = null;
    this.collectionId = null;
    this.accessoryId = null;
    this.shadeId = null;
    this.fomSizeId = null;
    this.matSizeId = null;
    this.lengthError = null;
    this.widthError = null;
    this.orderQuantity = null;
    this.orderType = null;
    this.amountWithGST = null;
    this.discountOnRate = null;
    this.givenDiscount = null;
    this.rateWithGST = null;
    this.rate = null;
    this.productDetails = {
      sellingRate: null,
      flatRate: null,
      sellingRatePerMM: null,
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
      rrp: null,
      maxFlatRateDisc: null,
      maxRoleRateDisc: null,
      maxCutRateDisc: null,
      maxDiscount: null
    };
    this.amount = null,
      this.orderType = '';
    this.amountWithGST = null;
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
      this.productDetails.stock = null;
      this.orderQuantity = null;
      this.orderQuantityError = false;
      this.rateWithGST = null;
      this.rate = null;
      this.length = null;
      this.lengthError = false;
      this.width = null;
      this.widthError = false;
      this.matThicknessId = null;
      this.matThicknessIdError = false;
      this.givenDiscount = null;
      this.givenDiscountError = false;
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
      this.productDetails.stock = null;
      this.orderQuantity = null;
      this.orderQuantityError = false;
      this.rateWithGST = null;
      this.rate = null;
      this.length = null;
      this.lengthError = false;
      this.width = null;
      this.widthError = false;
      this.matThicknessId = null;
      this.matThicknessIdError = false;
      this.givenDiscount = null;
      this.givenDiscountError = false;
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
      this.matSizeIdError = false;
      this.productDetails.stock = null;
      this.orderQuantity = null;
      this.orderQuantityError = false;
      this.rateWithGST = null;
      this.rate = null;
      this.length = null;
      this.lengthError = false;
      this.width = null;
      this.widthError = false;
      this.matThicknessId = null;
      this.matThicknessIdError = false;
      this.givenDiscount = null;
      this.givenDiscountError = false;
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
      this.productDetails.stock = null;
      this.orderQuantity = null;
      this.orderQuantityError = false;
      this.rateWithGST = null;
      this.rate = null;
      this.length = null;
      this.lengthError = false;
      this.width = null;
      this.widthError = false;
      this.givenDiscount = null;
      this.givenDiscountError = false;
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

  onCustomerChange() {
    this.shippingAddressObj = '';
    if (this.trnSalesOrderObj.customerId != null) {
      Helpers.setLoading(true);
      this.trnSalesOrderService.getCustomerAddressByCustomerId(this.trnSalesOrderObj.customerId).subscribe(
        results => {
          this.addressList = results;
          this.shippingAddressObj = _.find(this.addressList, ['isPrimary', true]);

          if (this.shippingAddressObj.addressLine2 == null) {
            this.shippingAddressObj.addressLine2 = '';
          }
          //this.trnSalesOrderObj.shippingAddress = this.shippingAddressObj.addressLine1 + this.shippingAddressObj.addressLine2 + ", " + this.shippingAddressObj.state + ", " + this.shippingAddressObj.city + ", PINCODE -" + this.shippingAddressObj.pin;
          this.trnSalesOrderObj.shippingAddressId = this.shippingAddressObj.id;
          this.selectedAddress = this.trnSalesOrderObj.customerId;
          Helpers.setLoading(false);
        },
        error => {
          this.globalErrorHandler.handleError(error);
          Helpers.setLoading(false);
        });
    }
    else
      this.trnSalesOrderObj.shippingAddress = null;
  }

  getMatQualityList() {
    Helpers.setLoading(true);
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
    Helpers.setLoading(true);
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


  onDeleteItemDetails(id, index) {
    if (id) {
      this.confirmationService.confirm({
        message: 'Do you want to delete this record?',
        header: 'Delete Confirmation',
        icon: 'fa fa-trash',
        accept: () => {
          if (this.trnSalesOrderObj.totalAmount >= 0) {
            if (this.trnSaleOrderItems.length > 0) {
              this.trnSalesOrderObj.totalAmount = this.trnSalesOrderObj.totalAmount - this.trnSaleOrderItems[index].amountWithGST;
            } else {
              this.trnSalesOrderObj.totalAmount = 0;
            }
          }
          this.trnSaleOrderItems.splice(index, 1);
          // this.trnSalesOrderService.deleteItem(id).subscribe(
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
      if (this.trnSalesOrderObj.totalAmount >= 0) {
        if (this.trnSaleOrderItems.length > 0) {
          this.trnSalesOrderObj.totalAmount = this.trnSalesOrderObj.totalAmount - this.trnSaleOrderItems[index].amountWithGST;
        } else {
          this.trnSalesOrderObj.totalAmount = 0;
        }
      }
      this.trnSaleOrderItems.splice(index, 1);
    }
  }

  getCategoryCodeList() {
    Helpers.setLoading(true);
    this.commonService.getCategoryCodesForSO().subscribe(
      results => {
        this.categoriesCodeList = results;
        this.categoriesCodeList.unshift({ label: '--Select--', value: null });
        Helpers.setLoading(false);
      },
      error => {
        this.globalErrorHandler.handleError(error);
        Helpers.setLoading(false);
      });
  }

  getCourierList() {
    Helpers.setLoading(true);
    this.trnSalesOrderService.getCourierLookup().subscribe(
      results => {
        this.courierList = results;
        this.courierList.unshift({ label: '--Select--', value: null });
        Helpers.setLoading(false);
      },
      error => {
        this.globalErrorHandler.handleError(error);
        Helpers.setLoading(false);
      });
  }

  calculateSizeCode() {
    if (this.width && this.length) {
      this.matSizeCode = this.length + 'x' + this.width;
    }
    else
      this.matSizeCode = '';
  }

  getAgentLookUp() {
    Helpers.setLoading(true);
    this.trnSalesOrderService.getAgentLookUp().subscribe(
      results => {
        this.agentList = results;
        this.agentList.unshift({ label: '--Select--', value: null });
        Helpers.setLoading(false);
      },
      error => {
        this.globalErrorHandler.handleError(error);
        Helpers.setLoading(false);
      });
  }

  changeOrderType() {
    this.orderQuantityError = false;
    if (this.orderQuantity > 50) {
      this.orderType = 'RL';
    }
    else {
      if (!this.orderQuantity)
        this.orderType = '';
      else
        this.orderType = 'CL';
    }

    if (this.categoryId == 2) {
      this.rate = ((this.productDetails.sellingRatePerMM * this.productDetails.suggestedMM) / 2592) * this.productDetails.length * this.productDetails.width;
      this.rate = parseFloat(this.rate).toFixed(2);
      this.discountOnRate = this.productDetails.maxDiscount;
      this.calculateAmount();
    }
    else if (this.categoryId == 1 || this.categoryId == 5 || this.categoryId == 6) {
      this.rate = parseFloat(this.productDetails.flatRate ? this.productDetails.flatRate : this.productDetails.rrp).toFixed(2);
      this.discountOnRate = this.productDetails.flatRate ? this.productDetails.maxFlatRateDisc : this.orderQuantity >= 50 ? this.productDetails.maxRoleRateDisc : this.productDetails.maxCutRateDisc;
      this.calculateAmount();
    }
    else if (this.categoryId == 4) {
      if (this.matSizeId != -1) {
        this.rate = this.productDetails.sellingRate;
        this.discountOnRate = this.productDetails.maxDiscount;
        this.calculateAmount();
      }
      else {
        this.rate = (((this.length * this.width) / 1550.5) * this.productDetails.custRatePerSqFeet);
        this.rate = parseFloat(this.rate).toFixed(2);
        // this.rate = this.rate - Math.round((this.rate * 10) / 100);
        this.calculateAmount();
      }
    }
    else if (this.categoryId == 7) {
      this.rate = this.productDetails.sellingRate;
      this.discountOnRate = null;
      this.calculateAmount();
    }
  }


  calculateAmount(givenDicount = 0) {
    if (!this.rate)
      return;
    let rate = parseFloat(this.rate);
    if (rate) {
      this.rateWithGST = rate + (rate * this.productDetails.gst) / 100;
      //this.amountWithGST =this.rateWithGST * this.orderQuantity;
      this.amount = rate * this.orderQuantity;
      this.amount = parseFloat(this.amount).toFixed(2);
      //this.amountWithGST = Math.round(this.amountWithGST - ((this.amountWithGST * givenDicount) / 100));
      this.amount = Math.round(this.amount - ((this.amount * givenDicount) / 100));
      this.amountWithGST = Math.round(this.amount + ((this.amount * this.productDetails.gst) / 100));
    }
    this.rateWithGST = parseFloat(this.rateWithGST).toFixed(2);
  }

  onChangeDiscountAmount() {
    if (!this.givenDiscount) {
      this.givenDiscount = 0;
    }
    this.givenDiscountError = false;
    this.calculateAmount(this.givenDiscount);
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
    this.productDetails.stock = null;
    this.orderQuantity = null;
    this.rateWithGST = null;
    this.rate = null;
    this.length = null;
    this.lengthError = false;
    this.width = null;
    this.widthError = false;
    this.matThicknessId = null;
    this.matThicknessIdError = false;
    this.givenDiscount = null;
    this.givenDiscountError = false;
    this.amount = null,
      this.orderType = '';
    this.amountWithGST = null;
    if (this.categoryId != null) {
      if (this.categoryId == 7) {
        this.getAccessoryLookup();
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
      this.productDetails.stock = null;
      this.orderQuantity = null;
      this.orderQuantityError = false;
      this.rateWithGST = null;
      this.rate = null;
      this.length = null;
      this.lengthError = false;
      this.width = null;
      this.widthError = false;
      this.matThicknessId = null;
      this.matThicknessIdError = false;
      this.givenDiscount = null;
      this.givenDiscountError = false;
      this.amount = null,
        this.orderType = '';
      this.amountWithGST = null;
      if (this.collectionId != null) {
        this.getshadeIdList();
      }
    }
    else if (this.categoryId == 2) {
      this.collectionIdError = false;
      this.fomSizeList = [];
      this.fomSizeList.unshift({ label: '--Select--', value: null });
      this.fomSizeIdError = false;
      this.fomSizeId = null;
      this.productDetails.stock = null;
      this.orderQuantity = null;
      this.orderQuantityError = false;
      this.rateWithGST = null;
      this.rate = null;
      this.length = null;
      this.lengthError = false;
      this.width = null;
      this.widthError = false;
      this.matThicknessId = null;
      this.matThicknessIdError = false;
      this.givenDiscount = null;
      this.givenDiscountError = false;
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
      this.productDetails.stock = null;
      this.orderQuantity = null;
      this.orderQuantityError = false;
      this.rateWithGST = null;
      this.rate = null;
      this.length = null;
      this.lengthError = false;
      this.width = null;
      this.widthError = false;
      this.matThicknessId = null;
      this.matThicknessIdError = false;
      this.givenDiscount = null;
      this.givenDiscountError = false;
      this.amount = null,
        this.orderType = '';
      this.amountWithGST = null;
      if (this.collectionId != null) {
        this.getMatSizeList();
        this.getMatQualityList();
      }
    }
    else {
      this.shadeIdList = [];
      this.shadeIdList.unshift({ label: '--Select--', value: null });
      this.matSizeList = [];
      this.matSizeList.unshift({ label: '--Select--', value: null });
      this.fomSizeList = [];
      this.fomSizeList.unshift({ label: '--Select--', value: null });
      this.categoryIdError = true;
      this.collectionIdError = false;
      this.shadeIdError = false;
      this.matSizeIdError = false;
      this.fomSizeIdError = false;
      this.shadeId = null;
      this.matSizeId = null;
      this.givenDiscountError = false;
      this.fomSizeId = null;
      this.productDetails.stock = null;
      this.orderQuantity = null;
      this.orderQuantityError = false;
      this.rateWithGST = null;
      this.rate = null;
      this.length = null;
      this.lengthError = false;
      this.width = null;
      this.widthError = false;
      this.matThicknessId = null;
      this.matThicknessIdError = false;
      this.givenDiscount = null;
      this.amount = null,
        this.orderType = '';
      this.amountWithGST = null;
    }
  }

  getMatSizeList() {
    Helpers.setLoading(true);
    this.trnSalesOrderService.getMatSizeLookUpByCollection(this.collectionId).subscribe(
      results => {
        this.matSizeList = results;
        this.matSizeList.unshift({ label: '--Select--', value: null });
        if (this.categoryId == 4)
          this.matSizeList.push({ label: 'Custom', value: -1 });
        Helpers.setLoading(false);
      },
      error => {
        this.globalErrorHandler.handleError(error);
        Helpers.setLoading(false);
      });
  }

  getFoamSizeList() {
    Helpers.setLoading(true);
    this.trnSalesOrderService.getFomSizeLookUpByCollection(this.collectionId).subscribe(
      results => {
        this.fomSizeList = results;
        this.fomSizeList.unshift({ label: '--Select--', value: null });
        Helpers.setLoading(false);
      },
      error => {
        this.globalErrorHandler.handleError(error);
        Helpers.setLoading(false);
      });
  }


  getshadeIdList() {
    Helpers.setLoading(true);
    this.trnSalesOrderService.getSerialNumberLookUpByCollection(this.collectionId).subscribe(
      results => {
        this.shadeIdList = results;
        this.shadeIdList.unshift({ label: '--Select--', value: null });
        Helpers.setLoading(false);
      },
      error => {
        this.globalErrorHandler.handleError(error);
        Helpers.setLoading(false);
      });
  }

  getCollectionList() {
    Helpers.setLoading(true);
    this.collectionService.getCollectionLookUpForSo(this.categoryId).subscribe(
      results => {
        this.collectionList = results;
        this.collectionList.unshift({ label: '--Select--', value: null });
        Helpers.setLoading(false);
      },
      error => {
        this.globalErrorHandler.handleError(error);
        Helpers.setLoading(false);
      });
  }

  onSubmit({ value, valid }: { value: any, valid: boolean }) {
    this.isFormSubmitted = true;
    this.trnSalesOrderObj.TrnSaleOrderItems = this.trnSaleOrderItems;
    let custObj = _.find(this.customerList, ['value', this.trnSalesOrderObj.customerId]);
    this.trnSalesOrderObj.customerName = custObj ? custObj.label : '';
    if (this.trnSaleOrderItems.length == 0) {
      this.messageService.addMessage({ severity: 'error', summary: 'Error', detail: "Please Select Items" });
      return false;
    }
    if (valid) {
      // let supplierObj = _.find(this.supplierCodeList, ['value', this.trnSalesOrderObj.supplierId]);
      let couierObj = _.find(this.courierList, ['value', this.trnSalesOrderObj.courierId]);
      // let shippingAddress = "";
      this.trnSalesOrderObj.courierName = couierObj.label;
      // this.trnSalesOrderObj.supplierName = supplierObj.label,
      if (this.shippingAddressObj != null) {
        // if (this.shippingAddressObj.addressLine1 != null) {
        //   this.trnSalesOrderObj.shippingAddress = this.shippingAddressObj.addressLine1 + this.shippingAddressObj.addressLine2 + ", " + this.shippingAddressObj.state + ", " + this.shippingAddressObj.city + ", PINCODE -" + this.shippingAddressObj.pin;
        // } else {
        //   this.shippingAddressObj.addressLine1 = "";
        //   this.trnSalesOrderObj.shippingAddress = this.shippingAddressObj.addressLine1 + this.shippingAddressObj.addressLine2 + ", " + this.shippingAddressObj.state + ", " + this.shippingAddressObj.city + ", PINCODE -" + this.shippingAddressObj.pin;
        // }
        this.trnSalesOrderObj.shippingAddressId = this.shippingAddressObj.id;
      } else {
        this.trnSalesOrderObj.shippingAddressId = null;
      }
      // if(this.params){
      this.trnSalesOrderObj.shippingAddress = this.shippingAddressObj;

      // }
      this.saveTrnSalesOrder(this.trnSalesOrderObj);
    }
  }


  saveTrnSalesOrder(value) {
    let tempOrderDate = new Date(value.orderDate);
    let tempExpectedDeliveryDate = new Date(value.expectedDeliveryDate);
    let tempChequeDate = new Date(value.chequeDate);
    value.orderDate = new Date(tempOrderDate.setHours(23));
    value.expectedDeliveryDate = new Date(tempExpectedDeliveryDate.setHours(23));
    value.chequeDate = new Date(tempChequeDate.setHours(23));
    Helpers.setLoading(true);
    if (this.params) {
      this.trnSalesOrderService.updateTrnSaleOrder(value)
        .subscribe(
        results => {
          this.params = null;
          this.messageService.addMessage({ severity: results.type.toLowerCase(), summary: results.type, detail: results.message });
          Helpers.setLoading(false);
          this.router.navigate(['/features/sales/trnSalesOrder/list']);
        },
        error => {
          this.globalErrorHandler.handleError(error);
          Helpers.setLoading(false);
        });
    } else {
      this.trnSalesOrderService.createTrnSaleOrder(value)
        .subscribe(
        results => {
          this.params = null;
          this.messageService.addMessage({ severity: results.type.toLowerCase(), summary: results.type, detail: results.message });
          Helpers.setLoading(false);
          this.router.navigate(['/features/sales/trnSalesOrder/list']);
        },
        error => {
          this.globalErrorHandler.handleError(error);
          Helpers.setLoading(false);
        });
    }
  }

  onCancel() {
    this.router.navigate(['/features/sales/trnSalesOrder/list']);
    this.disabled = false;
    this.viewItem = true;
  }
}
