import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash/index';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { ConfirmationService, DataTableModule, LazyLoadEvent, SelectItem } from 'primeng/primeng';
import { GlobalErrorHandler } from '../../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../../_services/message.service';
import { UserService } from "../../../../_services/user.service";
import { TrnCurtainSelectionService } from '../../../../_services/trnCurtainSelection.service';
import { ShadeService } from '../../../../_services/shade.service';
import { FomSizeService } from '../../../../_services/fomSize.service';
import { MatSizeService } from '../../../../_services/matSize.service';
import { ScriptLoaderService } from '../../../../../../../_services/script-loader.service';
import { CommonService } from '../../../../_services/common.service';
import { TrnMaterialSelectionService } from '../../../../_services/trnMaterialSelection.service';
import { Helpers } from "../../../../../../../helpers";
import { TrnCurtainSelection } from "../../../../_models/trncurtainSelection";
import { TrnProductStockService } from '../../../../_services/trnProductStock.service';
import { CollectionService } from '../../../../_services/collection.service';
import { CustomerService } from "../../../../_services/customer.service";

@Component({
  selector: "app-trnCurtainSelection-add-edit",
  templateUrl: "./trnCurtainSelection-add-edit.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class TrnCurtainSelectionAddEditComponent implements OnInit {
  trnCurtainSelectionForm: any;
  customerForm: any;
  trnCurtainSelectionObj: any;
  params: number;
  viewItem: boolean = true;
  isCustomerSubmitted: boolean = false;
  trncurtainSelectionList = [];
  MstCustomerAddresses = [];
  categoryList: SelectItem[];
  selectedCourierMode = null;
  selectedAgent = null;
  agentList = [];
  collectionList = [];
  addressList = [];
  categoriesCodeList = [];
  shadeIdList = [];
  categoryId = null;
  collectionId = null;
  trncurtainSelectionItems = [];
  customerTypeList = [];
  shadeId = null;
  locationObj = null;
  selectedAddress: any;
  isFormSubmitted = false;
  courierList = [];
  courierModeList = [];
  selectionTypeList = [];
  accessoryCodeList = [];
  disabled: boolean = false;
  shippingAddressObj = null;
  shippingAddress = '';
  selectedRadio: boolean;
  stateError: boolean;
  typeError: boolean;
  display: boolean = false;
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
    private trnCurtainSelectionService: TrnCurtainSelectionService,
    private shadeService: ShadeService,
    private fomSizeService: FomSizeService,
    private trnMaterialSelectionService: TrnMaterialSelectionService,
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
    this.trnCurtainSelectionObj = new TrnCurtainSelection();
    this.trnCurtainSelectionObj.customerId = null;
    this.trnCurtainSelectionObj.referById = null;
    this.states = this.commonService.states;
    this.customerTypeList.push({ label: '--Select--', value: null });
    this.customerTypeList.push({ label: 'Furniture Showroom', value: 'Furniture Showroom' });
    this.customerTypeList.push({ label: 'Workshop Big', value: 'Workshop Big' });
    this.customerTypeList.push({ label: 'Workshop Small', value: 'Workshop Small' });
    this.customerTypeList.push({ label: 'Karagir', value: 'Karagir' });
    this.customerTypeList.push({ label: 'Designer', value: 'Designer' });
    this.customerTypeList.push({ label: 'Miscellaneous', value: 'Miscellaneous' });
    this.getCourierList();
    this.getAgentLookUp();
    this.getCustomerLookUpWithoutWholesaleCustomer();
    let today = new Date();
    this.locationObj = {};
    this.disabled = false;
    this.trnCurtainSelectionObj.curtainSelectionDate = today;
    this.trnCurtainSelectionObj.selectionType = null;
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
      this.getTrncurtainSelectionById(this.params);
    }
    this.getCollectionList();
    this.addArea();
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }


  addArea() {

    let areaObj = {
      area: null,
      unitList: []
    }

    let unitObj = {
      unit: null,
      pattern: null,
      fabricList: [
        {
          categoryId: 1,
          collectionId: null,
          shadeId: null,
          isPatch: null,
          isLining: null,
          rate: null,
          discount: null,
        }
      ],
      accessoryList: [
        {
          accessoryId: null,
          amount: null,
        }
      ]
    }
    areaObj.unitList.push(unitObj);
    this.trnCurtainSelectionObj.areaList.push(areaObj);
  }

  removeArea(areaIndex) {
    // this.trnCurtainSelectionObj.areaList.slice(index, 1);
    if (this.trnCurtainSelectionObj.areaList.length > 1)
      this.trnCurtainSelectionObj.areaList = _.remove(this.trnCurtainSelectionObj.areaList, function (rec, index) {
        if (areaIndex != index) {
          return rec;
        }
      });
  }

  addUnit(areaObj) {
    let unitObj = {
      unit: null,
      pattern: null,
      fabricList: [
        {
          categoryId: 1,
          collectionId: null,
          shadeId: null,
          isPatch: null,
          isLining: null,
          rate: null,
          discount: null,
        }
      ],
      accessoryList: [
        {
          accessoryId: null,
          amount: null,
        }
      ]
    }
    areaObj.unitList.push(unitObj);
  }

  removeUnit(areaIndex, unitindex, unitList) {
    // this.trnCurtainSelectionObj.areaList[areaIndex].unitList.slice(unitindex, 1);
    if (this.trnCurtainSelectionObj.areaList[areaIndex].unitList.length > 1)
      this.trnCurtainSelectionObj.areaList[areaIndex].unitList = _.remove(this.trnCurtainSelectionObj.areaList[areaIndex].unitList, function (rec, index) {
        if (unitindex != index) {
          return rec;
        }
      });
  }

  addFabricRow(row) {
    row.fabricList.push({
      categoryId: 1,
      collectionId: null,
      shadeId: null,
      isPatch: null,
      isLining: null,
      rate: null,
      discount: null,
    });
  }

  onDeleteFabricRow(areaindex, unitIndex, fabricIndex, fabricList) {
    if (this.trnCurtainSelectionObj.areaList[areaindex].unitList[unitIndex].fabricList.length > 1)
      this.trnCurtainSelectionObj.areaList[areaindex].unitList[unitIndex].fabricList = _.remove(this.trnCurtainSelectionObj.areaList[areaindex].unitList[unitIndex].fabricList, function (rec, index) {
        if (fabricIndex != index) {
          return rec;
        }
      });

  }

  deleteAccessoryRow(areaindex, unitIndex, accesoryIndex, accessoryList) {
    if (this.trnCurtainSelectionObj.areaList[areaindex].unitList[unitIndex].accessoryList.length > 1)
      this.trnCurtainSelectionObj.areaList[areaindex].unitList[unitIndex].accessoryList = _.remove(this.trnCurtainSelectionObj.areaList[areaindex].unitList[unitIndex].accessoryList, function (rec, index) {
        if (accesoryIndex != index) {
          return rec;
        }
      });
  }

  addAccessoryRow(row) {
    row.accessoryList.push({
      accessoryId: null,
      amount: null,
    });
  }

  onUpdateAndCreateQuotation() {
    if (this.trnCurtainSelectionObj.isQuotationCreated) {
      if (this.trnCurtainSelectionObj.id != null) {
        Helpers.setLoading(true);
        this.trnCurtainSelectionService.getTrnCurtainSelectionById(this.trnCurtainSelectionObj.id).subscribe(
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
        this.trnCurtainSelectionObj.TrncurtainSelectionItems = this.trncurtainSelectionItems;
        this.trnCurtainSelectionService.updateTrnCurtainSelection(this.trnCurtainSelectionObj)
          .subscribe(
          results => {
            this.params = null;
            this.messageService.addMessage({ severity: results.type.toLowerCase(), summary: results.type, detail: results.message });
            Helpers.setLoading(false);
            this.router.navigate(['/features/sales/trnMaterialQuotation/add'], { queryParams: { curtainSelectionId: this.trnCurtainSelectionObj.id } });
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

  getTrncurtainSelectionById(id) {
    Helpers.setLoading(true);
    this.trnCurtainSelectionService.getTrnCurtainSelectionById(id).subscribe(
      results => {
        this.trnCurtainSelectionObj = results;
        if (this.trnCurtainSelectionObj.isQuotationCreated == false) {
          this.viewItem = true;
        } else {
          this.viewItem = false;
        }
        this.trnCurtainSelectionObj.curtainSelectionDate = new Date(this.trnCurtainSelectionObj.curtainSelectionDate);
        this.trncurtainSelectionItems = results.trncurtainSelectionItems;
        this.addressList = results.mstCustomer.mstCustomerAddresses;
        _.forEach(this.trncurtainSelectionItems, function (value) {
          if (value.mstCategory != null)
            value.categoryName = value.mstCategory.code;
          if (value.mstCollection != null)
            value.collectionName = value.mstCollection.collectionCode;

        });
        delete this.trnCurtainSelectionObj['trncurtainSelectionItems'];
        Helpers.setLoading(false);
      },
      error => {
        this.globalErrorHandler.handleError(error);
        Helpers.setLoading(false);
      });
  }

  addCustomer({ value, valid }: { value: any, valid: boolean }) {
    this.isCustomerSubmitted = true;

    if (this.state == null || this.state == "0" || this.state == "")
      this.stateError = true;
    else
      this.stateError = false;

    if (!this.type)
      this.typeError = true;
    else
      this.typeError = false;

    if (this.stateError || this.typeError)
      return false;

    if (!valid)
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

    this.customerService.createCustomerForAuthorizedUsers(customerObj)
      .subscribe(
      results => {
        this.params = null;
        if (results != null)
          this.trnCurtainSelectionObj.customerId = results.id;
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

  showDialog() {
    this.isFormSubmitted = false;
    this.display = true;
  }

  addItemToList() {

  }

  onCancelItemDetails() {

    this.trnCurtainSelectionObj.selectionType = null;
    this.trnCurtainSelectionObj.area = null;
    this.categoryId = null;
    this.collectionId = null;

  }

  enableEdit(row) {
    row.enable = true;
  }
  cancelEdit(row) {
    row.enable = false;
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


  onChangeCollection(collectionId) {
    this.shadeIdList = [];
    this.shadeIdList.unshift({ label: '--Select--', value: null });
    this.shadeId = null;
    if (collectionId != null) {
      this.getshadeIdList(collectionId);
    }
  }


  getshadeIdList(collectionId) {
    Helpers.setLoading(true);
    this.trnMaterialSelectionService.getSerialNumberLookUpByCollection(collectionId).subscribe(
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
    this.collectionService.getCollectionLookUp(1).subscribe(
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
    this.trnCurtainSelectionObj.TrncurtainSelectionItems = this.trncurtainSelectionItems;
    let custObj = _.find(this.customerList, ['value', this.trnCurtainSelectionObj.customerId]);
    this.trnCurtainSelectionObj.customerName = custObj ? custObj.label : '';
    if (this.trncurtainSelectionItems.length == 0) {
      this.messageService.addMessage({ severity: 'error', summary: 'Error', detail: "Please Select Items" });
      return false;
    }
    if (valid) {
      this.saveTrncurtainSelection(this.trnCurtainSelectionObj);
    }
  }


  saveTrncurtainSelection(value) {
    let tempcurtainSelectionDate = new Date(value.curtainSelectionDate);
    value.curtainSelectionDate = new Date(tempcurtainSelectionDate.setHours(23));
    Helpers.setLoading(true);
    if (this.params) {
      this.trnCurtainSelectionService.updateTrnCurtainSelection(value)
        .subscribe(
        results => {
          this.params = null;
          this.messageService.addMessage({ severity: results.type.toLowerCase(), summary: results.type, detail: results.message });
          Helpers.setLoading(false);
          this.router.navigate(['/features/sales/trncurtainSelection/list']);
        },
        error => {
          this.globalErrorHandler.handleError(error);
          Helpers.setLoading(false);
        });
    } else {
      this.trnCurtainSelectionService.createTrnCurtainSelection(value)
        .subscribe(
        results => {
          this.params = null;
          this.messageService.addMessage({ severity: results.type.toLowerCase(), summary: results.type, detail: results.message });
          Helpers.setLoading(false);
          this.router.navigate(['/features/sales/trncurtainSelection/list']);
        },
        error => {
          this.globalErrorHandler.handleError(error);
          Helpers.setLoading(false);
        });
    }
  }

  onCancel() {
    this.router.navigate(['/features/sales/trncurtainSelection/list']);
    this.disabled = false;
    this.viewItem = true;
  }
}
