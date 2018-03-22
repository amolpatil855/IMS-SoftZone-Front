import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash/index';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { ConfirmationService, DataTableModule, LazyLoadEvent, SelectItem } from 'primeng/primeng';
import { GlobalErrorHandler } from '../../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../../_services/message.service';
import { UserService } from "../../../../_services/user.service";
import { TrnMaterialSelectionService } from '../../../../_services/trnMaterialSelection.service';
import { ShadeService } from '../../../../_services/shade.service';
import { FomSizeService } from '../../../../_services/fomSize.service';
import { MatSizeService } from '../../../../_services/matSize.service';
import { ScriptLoaderService } from '../../../../../../../_services/script-loader.service';
import { CommonService } from '../../../../_services/common.service';
import { Helpers } from "../../../../../../../helpers";
import { TrnMaterialSelection } from "../../../../_models/trnMaterialSelection";
import { TrnProductStockService } from '../../../../_services/trnProductStock.service';
import { CollectionService } from '../../../../_services/collection.service';
import { CustomerService } from "../../../../_services/customer.service";

@Component({
  selector: "app-trnMaterialSelection-add-edit",
  templateUrl: "./trnMaterialSelection-add-edit.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class TrnMaterialSelectionAddEditComponent implements OnInit {
  trnMaterialSelectionForm: any;
  trnMaterialSelectionObj: any;
  userRole: string;
  params: number;
  adminFlag: boolean = false;
  status: boolean = true;
  viewItem: boolean = true;
  isCustomerSubmitted: boolean = false;
  trnMaterialSelectionList = [];
  MstCustomerAddresses = [];
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
  trnMaterialSelectionItems = [];
  customerTypeList = [];
  shadeId = null;
  orderQuantity = null;
  orderType = null;
  locationObj = null;
  matHeight = null;
  matWidth = null;
  selectedAddress: any;
  matSizeCode = null;
  isFormSubmitted = false;
  selectionTypeError = false;
  areaError = false;
  categoryIdError = false;
  collectionIdError = false;
  shadeIdError = false;
  matHeightError = false;
  matWidthError = false;
  orderQuantityError = false;
  matThicknessIdError = false;
  accessoryIdError = false;
  fomSizeIdError = false;
  matSizeIdError = false;
  qualityIdError = false;
  givenDiscountError = false;
  courierList = [];
  courierModeList = [];
  selectionTypeList = [];
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
    matHeight: null,
    matWidth: null,
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
  shippingAddress = '';
  selectedRadio: boolean;
  display: boolean = false;
  shadeEnable: boolean = false;
  matEnable: boolean = false;
  fomEnable: boolean = false;
  nameError: boolean = false;
  codeError: boolean = false;
  emailError: boolean = false;
  phoneError: boolean = false;
  address1Error: boolean = false;
  cityError: boolean = false;
  pinError: boolean = false;
  typeError: boolean = false;
  stateError: boolean = false;
  name: string = null;
  code: string = null;
  email: string = null;
  phone: string = null;
  address1: string = null;
  address2: string = null;
  pin: string = null;
  type: string = null;
  city: string = null;
  state: string = null;
  customerList = [];
  states = [];
  constructor(
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private trnMaterialSelectionService: TrnMaterialSelectionService,
    private shadeService: ShadeService,
    private fomSizeService: FomSizeService,
    private collectionService: CollectionService,
    private customerService: CustomerService,
    private matSizeService: MatSizeService,
    private globalErrorHandler: GlobalErrorHandler,
    private confirmationService: ConfirmationService,
    private commonService: CommonService,
    private trnProductStockService: TrnProductStockService,
    private messageService: MessageService) {
  }

  ngOnInit() {
    this.trnMaterialSelectionObj = new TrnMaterialSelection();
    this.states = this.commonService.states;
    this.customerTypeList.push({ label: '--Select--', value: null });
    this.customerTypeList.push({ label: 'Furniture Showroom', value: 'Furniture Showroom' });
    this.customerTypeList.push({ label: 'Workshop Big', value: 'Workshop Big' });
    this.customerTypeList.push({ label: 'Workshop Small', value: 'Workshop Small' });
    this.customerTypeList.push({ label: 'Karagir', value: 'Karagir' });
    this.customerTypeList.push({ label: 'Designer', value: 'Designer' });
    this.customerTypeList.push({ label: 'Miscellaneous', value: 'Miscellaneous' });
    this.getLoggedInUserDetail();
    this.getCourierList();
    this.getAgentLookUp();
    this.getCustomerLookUpWithoutWholesaleCustomer();
    let today = new Date();
    this.locationObj = {};
    this.disabled = false;
    this.trnMaterialSelectionObj.materialSelectionDate = today;
    this.selectionTypeList.push({ label: '--Select--', value: null });
    this.selectionTypeList.push({ label: 'Sofa', value: 'Sofa' });
    this.selectionTypeList.push({ label: 'Bedback', value: 'Bedback' });
    this.selectionTypeList.push({ label: 'Mattress', value: 'Mattress' });
    this.selectionTypeList.push({ label: 'Wallpaper', value: 'Wallpaper' });
    this.selectionTypeList.push({ label: 'Rug', value: 'Rug' });
    this.route.params.forEach((params: Params) => {
      this.params = params['id'];
    });
    if (this.params) {
      this.disabled = true;
      this.getTrnMaterialSelectionById(this.params);
    }
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
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

  onUpdateAndCreateQuotation() {
    if (this.trnMaterialSelectionObj.isQuotationCreated) {
      if (this.trnMaterialSelectionObj.id != null) {
        Helpers.setLoading(true);
        this.trnMaterialSelectionService.viewMaterialQuotationById(this.trnMaterialSelectionObj.id).subscribe(
          result => {
            this.router.navigate(['/features/sales/trnMaterialQuotation/edit', result], { queryParams: { materialQuotationId: result } });
            Helpers.setLoading(false);
          },
          error => {
            this.globalErrorHandler.handleError(error);
            Helpers.setLoading(false);
          });
      }
    }
    else {
      if (this.params) {
        Helpers.setLoading(true);
        this.trnMaterialSelectionObj.TrnMaterialSelectionItems = this.trnMaterialSelectionItems;
        this.trnMaterialSelectionService.updateTrnMaterialSelection(this.trnMaterialSelectionObj)
          .subscribe(
          results => {
            this.params = null;
            this.trnMaterialSelectionObj = results;
            this.messageService.addMessage({ severity: results.type.toLowerCase(), summary: results.type, detail: results.message });
            Helpers.setLoading(false);
            this.router.navigate(['/features/sales/trnMaterialQuotation/add'], { queryParams: { materialSelectionId: this.trnMaterialSelectionObj.id } });
          },
          error => {
            this.globalErrorHandler.handleError(error);
            Helpers.setLoading(false);
          });
      }
    }
  }

  getCustomerLookUpWithoutWholesaleCustomer() {
    Helpers.setLoading(true);
    this.trnMaterialSelectionService.getCustomerLookUpWithoutWholesaleCustomer().subscribe(
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

  onChangeSelectionType() {
    this.categoriesCodeList = [];
    this.collectionList = [];
    this.shadeIdList = [];
    this.matSizeList = [];
    this.fomSizeList = [];
    this.accessoryCodeList = [];
    this.selectionTypeError = false;
    this.areaError = false;
    this.trnMaterialSelectionObj.area = null;
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
    this.matSizeCode = null;
    this.matHeight = null;
    this.matHeightError = false;
    this.matWidth = null;
    this.matWidthError = false;
    this.qualityId = null;
    this.qualityIdError = false;
    this.matThicknessId = null;
    this.matThicknessIdError = false;

    if (this.trnMaterialSelectionObj.selectionType != null) {
      Helpers.setLoading(true);
      this.trnMaterialSelectionService.getCategoryLookupBySelectionType(this.trnMaterialSelectionObj.selectionType).subscribe(
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
  }

  getTrnMaterialSelectionById(id) {
    Helpers.setLoading(true);
    this.trnMaterialSelectionService.getTrnMaterialSelectionById(id).subscribe(
      results => {
        this.trnMaterialSelectionObj = results;
        if (this.trnMaterialSelectionObj.isQuotationCreated == false) {
          this.status = true;
          this.viewItem = true;
        } else {
          this.status = false;
          this.viewItem = false;
        }
        this.trnMaterialSelectionObj.materialSelectionDate = new Date(this.trnMaterialSelectionObj.materialSelectionDate);
        this.trnMaterialSelectionItems = results.trnMaterialSelectionItems;
        this.addressList = results.mstCustomer.mstCustomerAddresses;
        this.shippingAddress = this.trnMaterialSelectionObj.shippingAddress;
        _.forEach(this.trnMaterialSelectionItems, function (value) {
          if (value.mstCategory != null)
            value.categoryName = value.mstCategory.code;
          if (value.mstCollection != null)
            value.collectionName = value.mstCollection.collectionCode;

        });
        delete this.trnMaterialSelectionObj['trnMaterialSelectionItems'];
        Helpers.setLoading(false);
      },
      error => {
        this.globalErrorHandler.handleError(error);
        Helpers.setLoading(false);
      });
  }

  onRadioBtnClick(data) {
    this.shippingAddressObj = data;
    this.trnMaterialSelectionObj.shippingAddress = this.shippingAddressObj.addressLine1 + this.shippingAddressObj.addressLine2 + ", " + this.shippingAddressObj.state + ", " + this.shippingAddressObj.city + ", PINCODE -" + this.shippingAddressObj.pin;
    this.display = false;
  }

  addCustomer() {
    this.isCustomerSubmitted = true;
    if (!this.name)
      this.nameError = true;
    else
      this.nameError = false;

    if (!this.code)
      this.codeError = true;
    else
      this.codeError = false;

    if (!this.email)
      this.emailError = true;
    else
      this.emailError = false;

    if (!this.phone)
      this.phoneError = true;
    else
      this.phoneError = false;

    if (!this.address1)
      this.address1Error = true;
    else
      this.address1Error = false;

    if (!this.city)
      this.cityError = true;
    else
      this.cityError = false;

    if (!this.pin)
      this.pinError = true;
    else
      this.pinError = false;

    if (!this.state)
      this.stateError = true;
    else
      this.stateError = false;

    if (!this.type)
      this.typeError = true;
    else
      this.typeError = false;

    if (this.nameError || this.codeError || this.emailError || this.phoneError || this.address1Error || this.cityError || this.pinError || this.stateError || this.typeError)
      return false;

    let customerObj = {
      name: this.name,
      code: this.code,
      email: this.email,
      phone: this.phone,
      type: this.type,
      MstCustomerAddresses: [{
        addressLine1: this.address1,
        city: this.city,
        pin: this.pin,
        state: this.state,
        isPrimary: true,
      }],
    };

    this.customerService.createCustomer(customerObj)
      .subscribe(
      results => {
        this.params = null;
        if (results != null)
          this.trnMaterialSelectionObj.customerId = results.id;
        this.messageService.addMessage({ severity: results.type.toLowerCase(), summary: results.type, detail: results.message });
        this.Cancel();
        this.customerList = [];
        this.getCustomerLookUpWithoutWholesaleCustomer();
        Helpers.setLoading(false);
      },
      error => {
        this.globalErrorHandler.handleError(error);
        Helpers.setLoading(false);
      });

  }

  Cancel() {
    this.isCustomerSubmitted = false;
    this.nameError = false;
    this.codeError = false;
    this.emailError = false;
    this.phoneError = false;
    this.address1Error = false;
    this.cityError = false;
    this.pinError = false;
    this.stateError = false;
    this.typeError = false;
    this.name = null;
    this.code = null;
    this.email = null;
    this.phone = null;
    this.type = null;
    this.address1 = null;
    this.address2 = null;
    this.city = null;
    this.pin = null;
    this.state = null;
    this.display = false;
  }

  onStateChange() {
    this.stateError = false;
  }

  onTypeChange() {
    this.typeError = false;
  }

  onBlurArea() {
    this.areaError = false;
  }

  calculateProductStockDetails() {
    if (this.categoryId == 1 || this.categoryId == 5 || this.categoryId == 6) {
      this.shadeIdError = false;
      this.productDetails.stock = null;
      this.orderQuantity = null;
      this.orderQuantityError = false;
      this.rateWithGST = null;
      this.qualityId = null;
      this.qualityIdError = false;
      this.matThicknessId = null;
      this.matThicknessIdError = false;
      this.givenDiscount = null;
      this.givenDiscountError = false;
      this.orderType = '';
      this.amountWithGST = null;
    }
    else if (this.categoryId == 2) {
      this.fomSizeIdError = false;
      this.productDetails.stock = null;
      this.orderQuantity = null;
      this.orderQuantityError = false;
      this.rateWithGST = null;
      this.rate = null;
      this.qualityId = null;
      this.qualityIdError = false;
      this.matThicknessId = null;
      this.matThicknessIdError = false;
      this.givenDiscount = null;
      this.givenDiscountError = false;
      this.orderType = '';
      this.amountWithGST = null;
    }
    else if (this.categoryId == 4 && this.matSizeId != null) {
      this.matSizeIdError = false;
      this.productDetails.stock = null;
      this.orderQuantity = null;
      this.orderQuantityError = false;
      this.rateWithGST = null;
      this.rate = null;
      this.matThicknessId = null;
      this.matThicknessIdError = false;
      this.givenDiscount = null;
      this.givenDiscountError = false;
      this.orderType = '';
      this.amountWithGST = null;
    }
    else if (this.categoryId == 4 && this.matSizeId != -1 && !this.qualityId) {
      return;
    }
    else if (this.categoryId == 7) {
      this.accessoryIdError = false;
      this.productDetails.stock = null;
      this.orderQuantity = null;
      this.orderQuantityError = false;
      this.qualityId = null;
      this.qualityIdError = false;
      this.matThicknessId = null;
      this.matThicknessIdError = false;
      this.rateWithGST = null;
      this.rate = null;
      this.givenDiscount = null;
      this.givenDiscountError = false;
      this.orderType = '';
      this.amountWithGST = null;
    }
    //this.shadeId ? this.shadeId : this.fomSizeId ? this.fomSizeId : this.matSizeId != -1 ? this.matSizeId : null;
  }

  showDialog() {
    this.isFormSubmitted = false;
    this.display = true;
  }

  addItemToList() {
    if (!this.trnMaterialSelectionObj.selectionType)
      this.selectionTypeError = true;
    else
      this.selectionTypeError = false;

    if (!this.trnMaterialSelectionObj.area)
      this.areaError = true;
    else
      this.areaError = false;

    if (!this.categoryId)
      this.categoryIdError = true;
    else
      this.categoryIdError = false;

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

    if (this.categoryId == 4 && this.matSizeId == -1 && !this.matHeight)
      this.matHeightError = true;
    else
      this.matHeightError = false;

    if (this.categoryId == 4 && this.matSizeId == -1 && !this.matWidth)
      this.matWidthError = true;
    else
      this.matWidthError = false;

    if (this.categoryId == 4 && this.matSizeId == -1 && !this.matThicknessId)
      this.matThicknessIdError = true;
    else
      this.matThicknessIdError = false;

    if (this.categoryId == 4 && this.matSizeId == -1 && !this.qualityId)
      this.qualityIdError = true;
    else
      this.qualityIdError = false;

    if (this.matWidthError || this.fomSizeIdError || this.matSizeIdError || this.qualityIdError || this.accessoryIdError || this.matThicknessIdError
      || this.matHeightError || this.shadeIdError || this.collectionIdError || this.categoryIdError || this.selectionTypeError || this.areaError) {
      return false;
    }

    if (this.trnMaterialSelectionItems.length > 0) {

      let soObj = _.find(this.trnMaterialSelectionItems, ['area', this.trnMaterialSelectionObj.area]);
      if (soObj != null) {
        if (this.trnMaterialSelectionObj.selectionType == soObj.selectionType && this.accessoryId == soObj.accessoryId && this.categoryId == soObj.categoryId && this.collectionId == soObj.collectionId && this.trnMaterialSelectionObj.area == soObj.area && this.shadeId == soObj.shadeId && this.fomSizeId == soObj.fomSizeId && this.matSizeId == soObj.matSizeId) {
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

    let itemObj = {
      selectionType: this.trnMaterialSelectionObj.selectionType,
      area: this.trnMaterialSelectionObj.area,
      categoryId: this.categoryId,
      categoryName: catObj ? catObj.label != "--Select--" ? catObj.label : '' : '',
      collectionName: collObj ? collObj.label != "--Select--" ? collObj.label : '' : '',
      collectionId: this.collectionId,
      serialno: this.shadeId ? shadeObj.label != "--Select--" ? shadeObj.label : '' : '',
      size: this.matSizeId != -1 ? matSizeObj.label != "--Select--" ? matSizeObj.label : '' : (this.matHeight + 'x' + this.matWidth),
      accessoryId: this.accessoryId,
      shadeId: this.shadeId,
      fomSizeId: this.fomSizeId,
      matSizeId: this.matSizeId,
      qualityId: this.qualityId,
      matThicknessId: this.matThicknessId,
      matHeight: this.matHeight,
      matWidth: this.matWidth,
    };

    this.trnMaterialSelectionItems.push(itemObj);
    this.onCancelItemDetails();
  }

  onCancelItemDetails() {
    this.selectionTypeError = false;
    this.areaError = false;
    this.categoryIdError = false;
    this.collectionIdError = false;
    this.accessoryIdError = false;
    this.shadeIdError = false;
    this.qualityIdError = false;
    this.matHeightError = false;
    this.matWidthError = false;
    this.orderQuantityError = false;
    this.givenDiscountError = false;
    this.trnMaterialSelectionObj.selectionType = null;
    this.trnMaterialSelectionObj.area = null;
    this.categoryId = null;
    this.collectionId = null;
    this.accessoryId = null;
    this.shadeId = null;
    this.fomSizeId = null;
    this.matSizeId = null;
    this.qualityId = null;
    this.matSizeCode = null;
    this.matHeight = null;
    this.matWidth = null;
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
      matHeight: null,
      matWidth: null,
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


  onCustomerChange() {
    this.shippingAddressObj = '';
    if (this.trnMaterialSelectionObj.customerId != null) {
      Helpers.setLoading(true);
      this.trnMaterialSelectionService.getCustomerAddressByCustomerId(this.trnMaterialSelectionObj.customerId).subscribe(
        results => {
          this.addressList = results;
          this.shippingAddressObj = _.find(this.addressList, ['isPrimary', true]);

          if (this.shippingAddressObj.addressLine2 == null) {
            this.shippingAddressObj.addressLine2 = '';
          }
          this.trnMaterialSelectionObj.shippingAddress = this.shippingAddressObj.addressLine1 + this.shippingAddressObj.addressLine2 + ", " + this.shippingAddressObj.state + ", " + this.shippingAddressObj.city + ", PINCODE -" + this.shippingAddressObj.pin;

          this.selectedAddress = this.trnMaterialSelectionObj.customerId;
          Helpers.setLoading(false);
        },
        error => {
          this.globalErrorHandler.handleError(error);
          Helpers.setLoading(false);
        });
    }
    this.trnMaterialSelectionObj.shippingAddress = '';
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
    this.qualityIdError = false;
    this.thicknessList = [];
    this.thicknessList.unshift({ label: '--Select--', value: null });
    this.areaError = false;
    this.matThicknessId = null;
    this.matThicknessIdError = false;
    this.matHeight = null;
    this.matHeightError = false;
    this.matWidth = null;
    this.matWidthError = false;
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
          if (this.trnMaterialSelectionObj.totalAmount >= 0) {
            if (this.trnMaterialSelectionItems.length > 0) {
              this.trnMaterialSelectionObj.totalAmount = this.trnMaterialSelectionObj.totalAmount - this.trnMaterialSelectionItems[index].amountWithGST;
            } else {
              this.trnMaterialSelectionObj.totalAmount = 0;
            }
          }
          this.trnMaterialSelectionItems.splice(index, 1);
          // this.trnMaterialSelectionService.deleteItem(id).subscribe(
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
      if (this.trnMaterialSelectionObj.totalAmount >= 0) {
        if (this.trnMaterialSelectionItems.length > 0) {
          this.trnMaterialSelectionObj.totalAmount = this.trnMaterialSelectionObj.totalAmount - this.trnMaterialSelectionItems[index].amountWithGST;
        } else {
          this.trnMaterialSelectionObj.totalAmount = 0;
        }
      }
      this.trnMaterialSelectionItems.splice(index, 1);
    }
  }

  getCourierList() {
    this.trnMaterialSelectionService.getCourierLookup().subscribe(
      results => {
        this.courierList = results;
        this.courierList.unshift({ label: '--Select--', value: null });
      },
      error => {
        this.globalErrorHandler.handleError(error);
      });
  }

  calculateSizeCode() {

    if (this.matWidth && this.matHeight) {
      this.matHeightError = false;
      this.matWidthError = false;
      this.matWidth = parseFloat(this.matWidth).toFixed(2);
      this.matHeight = parseFloat(this.matHeight).toFixed(2);
      this.matSizeCode = this.matHeight + 'x' + this.matWidth;
    }
    else
      this.matSizeCode = '';
  }

  onThicknessChange() {
    this.matThicknessIdError = false;
  }

  getAgentLookUp() {
    Helpers.setLoading(true);
    this.trnMaterialSelectionService.getAgentLookUp().subscribe(
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
      this.rate = ((this.productDetails.sellingRatePerMM * this.productDetails.suggestedMM) / 2592) * this.productDetails.matHeight * this.productDetails.matWidth;
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
        this.rate = (((this.matHeight * this.matWidth) / 1550.5) * this.productDetails.custRatePerSqFeet);
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
    this.areaError = false;
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
    this.matHeight = null;
    this.matHeightError = false;
    this.matWidth = null;
    this.matWidthError = false;
    this.qualityId = null;
    this.qualityIdError = false;
    this.matThicknessId = null;
    this.matThicknessIdError = false;
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
      this.areaError = false;
      this.matSizeCode = null;
      this.matHeight = null;
      this.matHeightError = false;
      this.matWidth = null;
      this.matWidthError = false;
      this.qualityId = null;
      this.qualityIdError = false;
      this.matThicknessId = null;
      this.matThicknessIdError = false;
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
      this.areaError = false;
      this.matSizeCode = null;
      this.matHeight = null;
      this.matHeightError = false;
      this.matWidth = null;
      this.matWidthError = false;
      this.qualityId = null;
      this.qualityIdError = false;
      this.matThicknessId = null;
      this.matThicknessIdError = false;
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
      this.areaError = false;
      this.matHeight = null;
      this.matHeightError = false;
      this.matWidth = null;
      this.matWidthError = false;
      this.matThicknessId = null;
      this.matThicknessIdError = false;
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
      this.areaError = false;
      this.shadeIdError = false;
      this.matSizeIdError = false;
      this.fomSizeIdError = false;
      this.shadeId = null;
      this.matSizeId = null;
      this.fomSizeId = null;
      this.matSizeCode = null;
      this.matHeight = null;
      this.matHeightError = false;
      this.matWidth = null;
      this.matWidthError = false;
      this.qualityId = null;
      this.qualityIdError = false;
      this.matThicknessId = null;
      this.matThicknessIdError = false;
    }
  }

  getMatSizeList() {
    this.trnMaterialSelectionService.getMatSizeLookUpByCollection(this.collectionId).subscribe(
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
    this.trnMaterialSelectionService.getFomSizeLookUpByCollection(this.collectionId).subscribe(
      results => {
        this.fomSizeList = results;
        this.fomSizeList.unshift({ label: '--Select--', value: null });
      },
      error => {
        this.globalErrorHandler.handleError(error);
      });
  }


  getshadeIdList() {
    this.trnMaterialSelectionService.getSerialNumberLookUpByCollection(this.collectionId).subscribe(
      results => {
        this.shadeIdList = results;
        this.shadeIdList.unshift({ label: '--Select--', value: null });
      },
      error => {
        this.globalErrorHandler.handleError(error);
      });
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
    this.trnMaterialSelectionObj.TrnMaterialSelectionItems = this.trnMaterialSelectionItems;
    let custObj = _.find(this.customerList, ['value', this.trnMaterialSelectionObj.customerId]);
    this.trnMaterialSelectionObj.customerName = custObj ? custObj.label : '';
    if (this.trnMaterialSelectionItems.length == 0) {
      this.messageService.addMessage({ severity: 'error', summary: 'Error', detail: "Please Select Items" });
      return false;
    }
    if (valid) {
      this.saveTrnMaterialSelection(this.trnMaterialSelectionObj);
    }
  }


  saveTrnMaterialSelection(value) {
    let tempMaterialSelectionDate = new Date(value.materialSelectionDate);
    value.materialSelectionDate = new Date(tempMaterialSelectionDate.setHours(23));
    Helpers.setLoading(true);
    if (this.params) {
      this.trnMaterialSelectionService.updateTrnMaterialSelection(value)
        .subscribe(
        results => {
          this.params = null;
          this.messageService.addMessage({ severity: results.type.toLowerCase(), summary: results.type, detail: results.message });
          Helpers.setLoading(false);
          this.router.navigate(['/features/sales/trnMaterialSelection/list']);
        },
        error => {
          this.globalErrorHandler.handleError(error);
          Helpers.setLoading(false);
        });
    } else {
      this.trnMaterialSelectionService.createTrnMaterialSelection(value)
        .subscribe(
        results => {
          this.params = null;
          this.messageService.addMessage({ severity: results.type.toLowerCase(), summary: results.type, detail: results.message });
          Helpers.setLoading(false);
          this.router.navigate(['/features/sales/trnMaterialSelection/list']);
        },
        error => {
          this.globalErrorHandler.handleError(error);
          Helpers.setLoading(false);
        });
    }
  }

  onCancel() {
    this.router.navigate(['/features/sales/trnMaterialSelection/list']);
    this.disabled = false;
    this.viewItem = true;
  }
}
