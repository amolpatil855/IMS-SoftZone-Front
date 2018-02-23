import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash/index';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { ConfirmationService, DataTableModule, LazyLoadEvent, SelectItem } from 'primeng/primeng';
import { GlobalErrorHandler } from '../../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../../_services/message.service';
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
  params: number;
  trnSalesOrderList = [];
  categoryList: SelectItem[];

  selectedCourierMode = null;
  selectedAgent = null;
  agentList = [];
  collectionList = [];
  addressList = [];
  categoriesCodeList = [];
  shadeIdList = [];
  categoryId = null;
  matThicknessId=null;
  collectionId = null;
  trnPurchaseOrderItems = [];
  shadeId = null;
  orderQuantity = null;
  orderType = null;
  locationObj = null;
  length = null;
  width = null;
  selectedAddress:any;
  matSizeCode = null;
  isFormSubmitted = false;
  categoryIdError = false;
  collectionIdError = false;
  shadeIdError = false;
  lengthError = false;
  widthError = false;
  orderQuantityError = false;
  matThicknessIdError = false;
  fomSizeIdError = false;
  matSizeIdError = false;
  qualityIdError=false;
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
  shippingAddressObj = null;
  selectedRadio: boolean;
  display: boolean = false;
  shadeEnable: boolean = false;
  matEnable: boolean = false;
  fomEnable: boolean = false;
  customerList=[];
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
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
    this.getCategoryCodeList();
    this.getCourierList();
    this.getAccessoryLookup();
    this.getAgentLookUp();
    this.getCustomerLookUp();
    let today = new Date();
    this.locationObj = {};
    this.disabled = false;
    this.trnSalesOrderObj.orderDate = today;
    // this.newItem();
    this.courierModeList.push({ label: '--Select--', value: null });
    this.courierModeList.push({ label: 'Surface', value: 'Surface' });
    this.courierModeList.push({ label: 'Air', value: 'Air' });
    this.route.params.forEach((params: Params) => {
      this.params = params['id'];
    });
    if (this.params) {
      this.disabled = true;
      this.getTrnPurchaseOrderById(this.params);
    }
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

  getTrnPurchaseOrderById(id) {
    Helpers.setLoading(true);
    this.trnSalesOrderService.getTrnSaleOrderById(id).subscribe(
      results => {
        this.trnSalesOrderObj = results;
        this.trnPurchaseOrderItems = results.trnPurchaseOrderItems;
        _.forEach(this.trnPurchaseOrderItems, function(value) {
         value.categoryName=value.mstCategory.code;
         value.collectionName=value.mstCollection.collectionCode;
         
        });
        delete this.trnSalesOrderObj['trnPurchaseOrderItems'];
        this.locationObj=results.mstCompanyLocation;
        Helpers.setLoading(false);
      },
      error => {
        this.globalErrorHandler.handleError(error);
        Helpers.setLoading(false);
      });
  }
  onRadioBtnClick(data) {
    this.shippingAddressObj = data;
    this.display = false;
  }
  // newItem() {
  //   let itemObj = {
  //     categotryId: this.categoryId,
  //     // categoryName: catObj ? catObj.label : '',
  //     // collectionName: collObj ? catObj.label : '',
  //     collectionId: null,
  //     // serialno:  this.shadeId ?shadeObj.label:'',
  //     // size:  this.fomSizeId ?fomSizeObj.label :this.matSizeId? matSizeObj.label:'',
  //     shadeId:null,
  //     fomSizeId:null,
  //     matSizeId:null,
  //     quantity: null,
  //     orderType: null,
  //     length: null,
  //     width: null,
  //     matSizeCode: null
  //   };
  //   this.trnPurchaseOrderItems.push(itemObj);
  // }

  onDateSelect(){
    if(this.trnSalesOrderObj.expectedDeliveryDate < this.trnSalesOrderObj.orderDate){
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
    if (this.orderQuantityError || this.widthError || this.fomSizeIdError || this.matSizeIdError || this.matSizeIdError
        || this.lengthError || this.shadeIdError || this.collectionIdError || this.categoryIdError) {
      return false;
    }

    let catObj = _.find(this.categoriesCodeList, ['value', this.categoryId]);
    let collObj = _.find(this.collectionList, ['value', this.collectionId]);
    let shadeObj = _.find(this.shadeIdList, ['value', this.shadeId]);
    let fomSizeObj = _.find(this.fomSizeList, ['value', this.fomSizeId]);
    let matSizeObj = _.find(this.matSizeList, ['value', this.matSizeId]);
    if (matSizeObj && matSizeObj.value == -1) {
      matSizeObj.label = this.matSizeCode;
    }
    let itemObj = {
      categoryId: this.categoryId,
      categoryName: catObj ? catObj.label : '',
      collectionName: collObj ? collObj.label : '',
      collectionId: this.collectionId,
      serialno: this.shadeId ? shadeObj.label : '',
      size: this.fomSizeId ? fomSizeObj.label : this.matSizeId ? matSizeObj.label : '',
      shadeId: this.shadeId,
      fomSizeId: this.fomSizeId,
      matSizeId: this.matSizeId,
      orderQuantity: this.orderQuantity,
      rateWithGST: this.rateWithGST,
      rate: this.rate,
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
    this.categoryId = null;
    this.collectionId = null;
    this.shadeId = null;
    this.fomSizeId = null;
    this.matSizeId = null;
    this.lengthError = null;
    this.widthError = null;
    this.orderQuantity = null;
    this.rateWithGST = null;
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
      custRatePerSqFeet: null
    };
  }

  enableEdit(row) {
    row.enable = true;
  }
  cancelEdit(row) {
    row.enable = false;
  }

  calculateProductStockDetails() {

    let parameterId = null;
    if (this.categoryId == 1 || this.categoryId == 5 || this.categoryId == 6)
      parameterId = this.shadeId;
    else if (this.categoryId == 2)
      parameterId = this.fomSizeId;
    else if (this.categoryId == 4 && this.matSizeId != -1)
      parameterId = this.matSizeId;
    else if (this.categoryId == 4 && this.matSizeId != -1 && !this.qualityId)
      return;
    else if (this.categoryId == 7)
      parameterId = this.accessoryId;
    else
      parameterId = null;
    //this.shadeId ? this.shadeId : this.fomSizeId ? this.fomSizeId : this.matSizeId != -1 ? this.matSizeId : null;
    this.trnProductStockService.getAllTrnProductStocks(this.categoryId, this.collectionId, parameterId, this.qualityId).subscribe(
      data => {
        this.productDetails = data;
      }, error => {
        this.globalErrorHandler.handleError(error);
      });
  }

  onCustomerChange() {
    this.shippingAddressObj = null;
    if (this.trnSalesOrderObj.customerId != null) {
      Helpers.setLoading(true);
      this.trnSalesOrderService.getCustomerAddressByCustomerId(this.trnSalesOrderObj.customerId).subscribe(
        results => {
          this.addressList = results;
          console.log('this.addressList', this.addressList);
          this.shippingAddressObj = _.find(this.addressList, ['isPrimary', true]);
          this.selectedAddress = this.trnSalesOrderObj.customerId;
          Helpers.setLoading(false);
        },
        error => {
          this.globalErrorHandler.handleError(error);
          Helpers.setLoading(false);
        });
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

  onSaveItemDetails(row) {
    if (!row.id) {
      row.id = null;
      this.trnSalesOrderService.createTrnSaleOrder(row).subscribe(
        data => {
          this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Record Added Successfully' });
          // this.getAllMerchants();

        }, error => {
          this.globalErrorHandler.handleError(error);
        });
    }
    else {
      this.trnSalesOrderService.updateTrnSaleOrder(row).subscribe(
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
          this.trnPurchaseOrderItems.splice(index, 1);
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
    this.trnSalesOrderService.getCourierLookup().subscribe(
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
    if (this.orderQuantity > 50) {
      this.orderType = 'RL';
    }
    else
      this.orderType = 'CL';

    if (this.categoryId == 2) {

      this.rate = Math.round((((this.productDetails.purchaseRatePerMM * this.productDetails.suggestedMM) / 2592) * this.productDetails.length * this.productDetails.width));
      this.rateWithGST = Math.round(this.rate + (this.rate * this.productDetails.gst) / 100);
      this.amountWithGST = Math.round(this.rateWithGST * this.orderQuantity);
      this.amount = Math.round(this.rate * this.orderQuantity);
    }
    else if (this.categoryId == 1 || this.categoryId == 5 || this.categoryId == 6) {
      this.rate = Math.round(this.productDetails.purchaseFlatRate ? this.productDetails.purchaseFlatRate : this.orderQuantity > 50 ? this.productDetails.roleRate : this.productDetails.cutRate);
      this.rateWithGST = Math.round(this.rate + (this.rate * this.productDetails.gst) / 100);
      this.amountWithGST = Math.round(this.rateWithGST * this.orderQuantity);
      this.amount = Math.round(this.rate * this.orderQuantity);
    }
    else if (this.categoryId == 4) {
      if (this.matSizeId != -1) {
        this.rate = Math.round(this.productDetails.purchaseRate);
        this.rateWithGST = Math.round(this.rate + (this.rate * this.productDetails.gst) / 100);
        this.amountWithGST = Math.round(this.rateWithGST * this.orderQuantity);
        this.amount = Math.round(this.rate * this.orderQuantity);
      }
      else {
        this.rate = Math.round(((this.length * this.width) / 1550.5) * this.productDetails.custRatePerSqFeet);
        this.rate = this.rate - Math.round((this.rate * 10) / 100);
        this.rateWithGST = Math.round(this.rate + (this.rate * this.productDetails.gst) / 100);
        this.amountWithGST = Math.round(this.rateWithGST * this.orderQuantity);
        this.amount = Math.round(this.rate * this.orderQuantity);
      }
    }
    else if (this.categoryId == 7) {
      this.rate = Math.round(this.productDetails.purchaseRate);
      this.rateWithGST = Math.round(this.rate + (this.rate * this.productDetails.gst) / 100);
      this.amountWithGST = Math.round(this.rateWithGST * this.orderQuantity);
      this.amount = Math.round(this.rate * this.orderQuantity);
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
      this.getMatQualityList();
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
    this.trnSalesOrderService.getMatSizeLookUpByCollection(this.collectionId).subscribe(
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
    this.trnSalesOrderService.getFomSizeLookUpByCollection(this.collectionId).subscribe(
      results => {
        this.fomSizeList = results;
        this.fomSizeList.unshift({ label: '--Select--', value: null });
      },
      error => {
        this.globalErrorHandler.handleError(error);
      });
  }


  getshadeIdList() {
    this.trnSalesOrderService.getSerialNumberLookUpByCollection(this.collectionId).subscribe(
      results => {
        this.shadeIdList = results;
        this.shadeIdList.unshift({ label: '--Select--', value: null });
      },
      error => {
        this.globalErrorHandler.handleError(error);
      });
  }

  onChangeLocation() {
    if (this.trnSalesOrderObj.locationId) {
      this.commonService.getLocationById(this.trnSalesOrderObj.locationId).subscribe(
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

  onSubmit({ value, valid }: { value: any, valid: boolean }) {
    this.isFormSubmitted = true;
    this.trnSalesOrderObj.TrnPurchaseOrderItems = this.trnPurchaseOrderItems;
    if (valid) {
     // let supplierObj = _.find(this.supplierCodeList, ['value', this.trnSalesOrderObj.supplierId]);
      let couierObj = _.find(this.courierList, ['value', this.trnSalesOrderObj.courierId]);
      let shippingAddress = "";
      this.trnSalesOrderObj.courierName = couierObj.label,
       // this.trnSalesOrderObj.supplierName = supplierObj.label,
        this.trnSalesOrderObj.shippingAddress = this.locationObj.addressLine1 + this.locationObj.addressLine2 +", " + this.locationObj.state +", "+this.locationObj.city+", PINCODE -"+this.locationObj.pin;
        this.saveTrnSalesOrder(this.trnSalesOrderObj);
    }
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
          this.router.navigate(['/features/purchase/trnPurchaseOrder/list']);
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
          this.router.navigate(['/features/purchase/trnPurchaseOrder/list']);
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
