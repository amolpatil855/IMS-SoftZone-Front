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
import { TrnPOItemsWithInsufficientStockService } from '../../../../_services/TrnPOItemsWithInsufficientStock.service';
import { MatSizeService } from '../../../../_services/matSize.service';
@Component({
  selector: "app-trnPOItemsWithInsufficientStock-list",
  templateUrl: "./trnPOItemsWithInsufficientStock-list.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class TrnPOItemsWithInsufficientStockListComponent implements OnInit {
  trnPurchaseOrderForm: any;
  params: number;
  isFormSubmitted: boolean;
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
  selectedItemsList = [];
  supplierCodeList = [];
  locationList = [];
  courierModeList = [];
  trnPurchaseOrderItems = [];
  filteredItems = [];
  trnPurchaseOrderObj: TrnPurchaseOrder;
  disabled: boolean = false;
  locationObj = null;
  courierList = [];
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
    private trnPOItemsWithInsufficientStockService: TrnPOItemsWithInsufficientStockService,
    private matSizeService: MatSizeService
  ) {
  }

  ngOnInit() {
    this.getLocationList();
    this.getCourierList();
    this.getLoggedInUserDetail();
    this.newPO();
    this.courierModeList.push({ label: '--Select--', value: null });
    this.courierModeList.push({ label: 'Surface', value: 'Surface' });
    this.courierModeList.push({ label: 'Air', value: 'Air' });
  }

  newPO() {
    this.isFormSubmitted=false;
    this.trnPurchaseOrderObj = new TrnPurchaseOrder();
    this.getSupplierCodeList();
    //this.getAccessoryLookup();
    let today = new Date();
    this.locationObj = {};
    this.disabled = false;
    this.trnPurchaseOrderObj.orderDate = today;
    this.getTrnPurchaseOrderById();
  }

  onRowSelect(event) {

    if (!this.trnPurchaseOrderObj.totalAmount) {
      this.trnPurchaseOrderObj.totalAmount = 0;
    }
    if (event.data.amountWithGST)
      this.trnPurchaseOrderObj.totalAmount = this.trnPurchaseOrderObj.totalAmount + event.data.amountWithGST;
    console.log(this.selectedItemsList);
  }

  onRowUnselect(event) {
    if (!this.trnPurchaseOrderObj.totalAmount) {
      this.trnPurchaseOrderObj.totalAmount = 0;
    }
    if (event.data.amountWithGST)
      this.trnPurchaseOrderObj.totalAmount = this.trnPurchaseOrderObj.totalAmount - event.data.amountWithGST;
    console.log(this.selectedItemsList);
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


  changeOrderType(row) {

    if (row.orderQuantity > 50) {
      row.orderType = 'RL';
    }
    else
      row.orderType = 'CL';

    if (row.categoryId == 2) {

      row.rate = ((row.purchaseRatePerMM * row.suggestedMM) / 2592) * row.length * row.width;
      row.rateWithGST = parseFloat(row.rate + (row.rate * row.gst) / 100).toFixed(2);
      //this.amountWithGST = this.rate * this.orderQuantity;
      row.amount = row.rate * row.orderQuantity;
      row.rate = parseFloat(row.rate).toFixed(2);
      row.amount = Math.round(row.amount - ((row.amount * row.purchaseDiscount) / 100));
      // this.amountWithGST= this.amountWithGST -  ((this.amountWithGST * row.purchaseDiscount)/100);
      row.amountWithGST = Math.round(row.amount + (row.amount * row.gst) / 100);
    }
    else if (row.categoryId == 1 || row.categoryId == 5 || row.categoryId == 6) {
      let applyDiscount = false;
      row.rate = (row.purchaseFlatRate ? row.purchaseFlatRate : row.orderQuantity >= 50 ? row.roleRate : row.cutRate);
      applyDiscount = (row.purchaseFlatRate ? true : row.orderQuantity >= 50 ? true : false);
      row.rateWithGST = parseFloat(row.rate + (row.rate * row.gst) / 100).toFixed(2);
      // this.amountWithGST = this.rateWithGST * this.orderQuantity;
      row.amount = row.rate * row.orderQuantity;
      row.rate = parseFloat(row.rate).toFixed(2);
      if (applyDiscount)
        row.amount = Math.round(row.amount - ((row.amount * row.purchaseDiscount) / 100));
      row.amountWithGST = Math.round(row.amount + ((row.amount * row.gst) / 100));

    }
    else if (row.categoryId == 4) {
      if (row.matSizeId != -1) {
        row.rate = row.purchaseRate;
        row.rateWithGST = parseFloat(row.rate + (row.rate * row.gst) / 100).toFixed(2);
        row.amount = Math.round(row.rate * row.orderQuantity);
        row.amountWithGST = Math.round(row.amount + ((row.amount * row.gst) / 100));
      }
      else {
        row.rate = ((row.length * row.width) / 1550.5) * row.custRatePerSqFeet;

        // this.rate = this.rate - Math.round((this.rate) / 100);
        row.rateWithGST = parseFloat(row.rate + (row.rate * row.gst) / 100).toFixed(2);
        // this.amountWithGST = this.rateWithGST * this.orderQuantity;
        row.amount = row.rate * row.orderQuantity;
        row.rate = parseFloat(row.rate).toFixed(2);
        //this.amountWithGST= Math.round( this.amountWithGST -  ( (this.amountWithGST * row.purchaseDiscount)/100));
        row.amount = Math.round(row.amount - ((row.amount * row.purchaseDiscount) / 100));
        row.amountWithGST = Math.round(row.amount + ((row.amount * row.gst) / 100));
      }
    }
    else if (row.categoryId == 7) {
      row.rate = row.purchaseRate;
      row.rateWithGST = parseFloat(row.rate + (row.rate * row.gst) / 100).toFixed(2);
      // this.amountWithGST =this.rateWithGST * this.orderQuantity;
      row.amount = row.rate * row.orderQuantity;
      //this.amountWithGST= Math.round( this.amountWithGST -  ( (this.amountWithGST * row.purchaseDiscount)/100));
      //this.amount = Math.round(this.amount - ((this.amount * row.purchaseDiscount) / 100));
      row.amountWithGST = Math.round(row.amount + ((row.amount * row.gst) / 100));
    }

    let sum = 0;
    _.forEach(this.selectedItemsList, function (selectedItem) {
      sum = sum + selectedItem.amountWithGST;
    });

    this.trnPurchaseOrderObj.totalAmount = sum;
  }


  getTrnPurchaseOrderById() {
    Helpers.setLoading(true);
    this.trnPOItemsWithInsufficientStockService.getPOItemsWithStockInsufficient().subscribe(
      results => {
        Helpers.setLoading(false);
        this.trnPurchaseOrderItems = results;
        this.filteredItems = this.trnPurchaseOrderItems;
        if (this.filteredItems.length == 0)
          this.tableEmptyMesssage = "Records Not Available";
      },
      error => {
        this.globalErrorHandler.handleError(error);
        Helpers.setLoading(false);
      });
  }

  onChangeSupplier() {
    let supplierId = this.trnPurchaseOrderObj.supplierId;
    if (supplierId != null) {
      this.filteredItems = _.filter(this.trnPurchaseOrderItems, function (o) { return o.supplierId == supplierId; });
      this.filteredItems = this.filteredItems.length == 0 ? [] : this.filteredItems;
      if (this.filteredItems.length == 0)
        this.tableEmptyMesssage = "Records Not Available";
    }
    else {
      this.filteredItems = this.trnPurchaseOrderItems;
    }
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

  getSupplierCodeList() {
    this.trnPOItemsWithInsufficientStockService.getSupplierListForPO().subscribe(
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

  onSubmit({ value, valid }: { value: any, valid: boolean }) {
    this.isFormSubmitted = true;
    let isAmountAvailable = true;
    this.trnPurchaseOrderObj.TrnPurchaseOrderItems = this.selectedItemsList;
    if (this.selectedItemsList.length == 0) {
      this.messageService.addMessage({ severity: 'error', summary: 'Error', detail: "Please Select Items" });
      return false;
    }

    _.forEach(this.selectedItemsList, function (selectedItem) {
      if (!selectedItem.amountWithGST || selectedItem.orderQuantity == 0 || !selectedItem.orderQuantity)
        isAmountAvailable = false;
    });

    if (!isAmountAvailable) {
      this.messageService.addMessage({ severity: 'error', summary: 'Error', detail: "Selected items should have Order Quantity/Amount" });
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
    Helpers.setLoading(true);
    this.trnPurchaseOrderService.createTrnPurchaseOrder(value)
      .subscribe(
      results => {
        this.params = null;
        this.messageService.addMessage({ severity: results.type.toLowerCase(), summary: results.type, detail: results.message });
        Helpers.setLoading(false);
        this.newPO();
      },
      error => {
        this.globalErrorHandler.handleError(error);
        Helpers.setLoading(false);
      });

  }

}

