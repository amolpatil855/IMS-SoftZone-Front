import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash/index';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { ConfirmationService, DataTableModule, LazyLoadEvent, SelectItem } from 'primeng/primeng';
import { GlobalErrorHandler } from '../../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../../_services/message.service';
import { TrnSalesOrderService } from '../../../../_services/trnSalesOrder.service';
import { ScriptLoaderService } from '../../../../../../../_services/script-loader.service';
import { CommonService } from '../../../../_services/common.service';
import { Helpers } from "../../../../../../../helpers";
import { TrnSaleOrder } from "../../../../_models/trnSaleOrder";

@Component({
  selector: "app-trnSalesOrder-add-edit",
  templateUrl: "./trnSalesOrder-add-edit.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class TrnSalesOrderAddEditComponent implements OnInit {
  trnSalesOrderForm: any;
  trnSalesOrderObj: any;
  params: number;
  trnSalesOrderList = [];
  categoryList: SelectItem[];
  selectedCourier = null;
  selectedCourierMode = null;
  selectedCustomer = null;
  selectedAgent = null;
  selectedCategory = null;
  selectedCollection = null;
  selectedShade = null;
  selectedMatSize = null;
  selectedTrnSalesOrder = null;
  selectedFomSize = null;
  selectedCompanyLocation = null;
  selectedAddress = null;
  collectionList = [];
  companyLocationList = [];
  addressList = [];
  courierList = [];
  customerList = [];
  agentList = [];
  shadeList = [];
  matSizeList = [];
  fomSizeList = [];
  courierMode = [];
  itemDetails = [];
  //itemDetails properties
  width = null;
  height = null;
  size = null;
  rate = null;
  availableStock = null;
  quantity = null;
  amount = null;
  // widthError = false;
  // heightError=false;
  // sizeError=false;
  // rateError=false;
  // availableStockError=false;
  // quantityError=false;
  // amountError=false;
  shippingAddressObj = null;
  selectedRadio: boolean;
  display: boolean = false;
  disabled: boolean = false;
  shadeEnable: boolean = false;
  matEnable: boolean = false;
  fomEnable: boolean = false;
  isFormSubmitted = false;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private trnSalesOrderService: TrnSalesOrderService,
    private globalErrorHandler: GlobalErrorHandler,
    private confirmationService: ConfirmationService,
    private commonService: CommonService,
    private messageService: MessageService) {
  }

  ngOnInit() {
    this.shippingAddressObj = {};
    this.courierMode = this.commonService.courierMode;
    this.route.params.forEach((params: Params) => {
      this.params = params['id'];
    });
    this.newRecord();
    this.getCustomerLookUp();
    this.getCourierLookup();
    this.getAgentLookUp();
    this.getCategoryLookUp();
    this.getCompanyLocationLookUp();
    if (this.params) {
      this.getTrnSaleOrderById();
    }
  }

  newRecord() {
    this.params = null;
    this.trnSalesOrderObj = {
      id: 0,
      orderNumber: '',
      customerId: null,
      shippingAddress: '',
      courierId: null,
      courierMode: '',
      referById: null,
      orderDate: '',
      remark: '',
      status: '',
      financialYear: '',
    };
    this.selectedCategory = null;
    this.courierList = [];
    this.courierList.unshift({ label: '--Select--', value: null });
    this.customerList = [];
    this.customerList.unshift({ label: '--Select--', value: null });
    this.agentList = [];
    this.agentList.unshift({ label: '--Select--', value: null });
    this.collectionList = [];
    this.collectionList.unshift({ label: '--Select--', value: null });
    this.shadeList = [];
    this.shadeList.unshift({ label: '--Select--', value: null });
    this.matSizeList = [];
    this.matSizeList.unshift({ label: '--Select--', value: null });
    this.matSizeList.push({ label: 'Custom', value: -1 });
    this.fomSizeList = [];
    this.fomSizeList.unshift({ label: '--Select--', value: null });
    this.selectedCourier = null;
    this.selectedCourierMode = null;
    this.selectedCustomer = null;
    this.selectedAgent = null;
    this.selectedCollection = null;
    this.selectedShade = null;
    this.selectedMatSize = null;
    this.selectedTrnSalesOrder = null;
    this.selectedFomSize = null;
    this.selectedCompanyLocation = null;
    this.selectedAddress = null;
    this.shadeEnable = false;
    this.matEnable = false;
    this.fomEnable = false;
  }

  toggleButton() {
    if (!this.params) {
      this.disabled = false;
      this.isFormSubmitted = false;
      this.newRecord();
    }
  }

  onRadioBtnClick(data) {
    this.shippingAddressObj = data;
    this.display = false;
  }

  showDialog() {
    this.display = true;
  }

  onInputChange() {
    if (this.width == '' || this.height == '') {
      this.size = '';
    }
    else {
      this.size = this.width + 'x' + this.height;
    }
  }

  calculateAmount() {
    if (this.rate == '' || this.quantity == '') {
      this.amount = '';
    }
    else {
      this.amount = this.rate * this.quantity;
    }
  }

  addItemToList() {
    let catObj = _.find(this.categoryList, ['value', this.selectedCategory]);
    let collObj = _.find(this.collectionList, ['value', this.selectedCollection]);
    let fomObj = _.find(this.fomSizeList, ['value', this.selectedFomSize]);
    let matObj = _.find(this.matSizeList, ['value', this.selectedMatSize]);
    let itemObj = {
      categotryId: this.selectedCategory,
      categotryName: catObj ? catObj.label : '',
      collectionName: collObj ? catObj.label : '',
      collectionid: this.selectedCollection,
      serialno: this.selectedShade,
      fomSize: fomObj ? fomObj.label : '',
      matSize: matObj ? matObj.label : '',
      width: null,
      height: null,
      size: this.size,
      rate: this.rate,
      availableStock: this.availableStock,
      quantity: this.quantity,
      amount: this.amount,
    };
    this.itemDetails.push(itemObj);
  }

  onDeleteItemDetails(id, index) {
    if (id) {
      this.confirmationService.confirm({
        message: 'Do you want to delete this record?',
        header: 'Delete Confirmation',
        icon: 'fa fa-trash',
        accept: () => {
        },
        reject: () => {
        }
      });
    }
    else {
      this.itemDetails.splice(index, 1);
    }
  }

  getTrnSaleOrderById() {
    Helpers.setLoading(true);
    this.trnSalesOrderService.getTrnSaleOrderById(this.params).subscribe(
      results => {
        this.trnSalesOrderObj = results;
        console.log('this.trnSalesOrderObj', this.trnSalesOrderObj);
        this.selectedCategory = this.trnSalesOrderObj.categoryId;
        if (this.selectedCategory > 0) {
          this.onCategoryClick();
        }
      },
      error => {
        this.globalErrorHandler.handleError(error);
        Helpers.setLoading(false);
      });
  }

  onCustomerChange() {

    if (this.selectedCustomer != null) {
      this.trnSalesOrderService.getCustomerAddressByCustomerId(this.selectedCustomer).subscribe(
        results => {
          this.addressList = results;
          console.log('this.addressList', this.addressList);
          this.selectedAddress = this.trnSalesOrderObj.customerId;
          Helpers.setLoading(false);
        },
        error => {
          this.globalErrorHandler.handleError(error);
          Helpers.setLoading(false);
        });
    }
  }

  getCourierLookup() {
    this.trnSalesOrderService.getCourierLookup().subscribe(
      results => {
        this.courierList = results;
        this.courierList.unshift({ label: '--Select--', value: null });
      },
      error => {
        this.globalErrorHandler.handleError(error);
      });
  }

  getCustomerLookUp() {
    this.trnSalesOrderService.getCustomerLookUp().subscribe(
      results => {
        this.customerList = results;
        this.customerList.unshift({ label: '--Select--', value: null });
      },
      error => {
        this.globalErrorHandler.handleError(error);
      });
  }

  getAgentLookUp() {
    this.trnSalesOrderService.getAgentLookUp().subscribe(
      results => {
        this.agentList = results;
        this.agentList.unshift({ label: '--Select--', value: null });
      },
      error => {
        this.globalErrorHandler.handleError(error);
      });
  }

  getCategoryLookUp() {
    this.trnSalesOrderService.getCategoryLookUp().subscribe(
      results => {
        this.categoryList = results;
        this.categoryList.unshift({ label: '--Select--', value: null });
      },
      error => {
        this.globalErrorHandler.handleError(error);
      });
  }

  getCompanyLocationLookUp() {
    this.trnSalesOrderService.getCompanyLocationLookUp().subscribe(
      results => {
        this.companyLocationList = results;
        this.companyLocationList.unshift({ label: '--Select--', value: null });
      },
      error => {
        this.globalErrorHandler.handleError(error);
      });
  }

  onCategoryClick() {
    this.collectionList = [];
    this.collectionList.unshift({ label: '--Select--', value: null });
    this.shadeList = [];
    this.shadeList.unshift({ label: '--Select--', value: null });
    this.matSizeList = [];
    this.matSizeList.unshift({ label: '--Select--', value: null });
    this.matSizeList.push({ label: 'Custom', value: -1 });
    this.fomSizeList = [];
    this.fomSizeList.unshift({ label: '--Select--', value: null });
    this.selectedCollection = null;
    this.selectedShade = null;
    this.selectedMatSize = null;
    this.selectedTrnSalesOrder = null;
    this.selectedFomSize = null;
    if (this.selectedCategory != null) {
      this.categoryList.forEach(item => {
        if (item.value == this.selectedCategory) {
          if (item.label === "Foam") {
            this.fomEnable = true;
            this.matEnable = false;
            this.shadeEnable = false;
          }
          if (item.label === "Mattress") {
            this.matEnable = true;
            this.fomEnable = false;
            this.shadeEnable = false;
          }
          if (item.label === "Fabric" || item.label === "Rug" || item.label === "Wallpaper") {
            this.shadeEnable = true;
            this.matEnable = false;
            this.fomEnable = false;
          }
        }
      });

      this.trnSalesOrderService.getCollectionLookUpByCategory(this.selectedCategory).subscribe(
        results => {
          this.collectionList = results;
          this.collectionList.unshift({ label: '--Select--', value: null });
          this.selectedCollection = this.trnSalesOrderObj.collectionId;
          if (this.selectedCollection > 0) {
            this.onCollectionClick();
          }
        },
        error => {
          this.globalErrorHandler.handleError(error);
        });
    }
  }

  onCollectionClick() {
    this.shadeList = [];
    this.shadeList.unshift({ label: '--Select--', value: null });
    this.matSizeList = [];
    this.matSizeList.unshift({ label: '--Select--', value: null });
    this.matSizeList.push({ label: 'Custom', value: -1 });
    this.fomSizeList = [];
    this.fomSizeList.unshift({ label: '--Select--', value: null });
    this.selectedShade = null;
    this.selectedMatSize = null;
    this.selectedTrnSalesOrder = null;
    this.selectedFomSize = null;
    if (this.selectedCollection != null) {
      this.trnSalesOrderService.getSerialNumberLookUpByCollection(this.selectedCollection).subscribe(
        results => {
          this.shadeList = results;
          this.shadeList.unshift({ label: '--Select--', value: null });
          this.selectedShade = this.trnSalesOrderObj.fwrShadeId;
          Helpers.setLoading(false);
        },
        error => {
          this.globalErrorHandler.handleError(error);
          Helpers.setLoading(false);
        });

      this.trnSalesOrderService.getMatSizeLookUpByCollection(this.selectedCollection).subscribe(
        results => {
          this.matSizeList = results;
          this.matSizeList.unshift({ label: '--Select--', value: null });
          this.matSizeList.push({ label: 'Custom', value: -1 });
          this.selectedMatSize = this.trnSalesOrderObj.matSizeId;
          Helpers.setLoading(false);
        },
        error => {
          this.globalErrorHandler.handleError(error);
          Helpers.setLoading(false);
        });

      this.trnSalesOrderService.getFomSizeLookUpByCollection(this.selectedCollection).subscribe(
        results => {
          this.fomSizeList = results;
          this.fomSizeList.unshift({ label: '--Select--', value: null });
          this.selectedFomSize = this.trnSalesOrderObj.fomSizeId;
          Helpers.setLoading(false);
        },
        error => {
          this.globalErrorHandler.handleError(error);
          Helpers.setLoading(false);
        });
    }
  }

  onSubmit({ value, valid }: { value: any, valid: boolean }) {
    this.isFormSubmitted = true;
    if (!valid)
      return;
    if (this.trnSalesOrderObj.id > 0) {

    } else {
      this.trnSalesOrderObj.customerId = value.customer;
      this.trnSalesOrderObj.courierId = value.courier;
      this.trnSalesOrderObj.referById = value.agent;
    }
    this.saveTrnSalesOrder(this.trnSalesOrderObj);
  }

  saveTrnSalesOrder(value) {
    Helpers.setLoading(true);
    if (this.params) {
      this.trnSalesOrderService.updateTrnSaleOrder(value)
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
      this.trnSalesOrderService.createTrnSaleOrder(value)
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

  onCancel() {
    this.router.navigate(['/features/sales/trnSalesOrder/list']);
  }
}
