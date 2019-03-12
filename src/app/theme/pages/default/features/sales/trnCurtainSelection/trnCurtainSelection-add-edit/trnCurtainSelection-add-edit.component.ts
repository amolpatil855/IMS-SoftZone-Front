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
  shadeList = [];
  categoryId = null;
  collectionId = null;
  trnCurtainSelectionItems = [];
  customerTypeList = [];
  locationObj = null;
  selectedAddress: any;
  isFormSubmitted = false;
  courierList = [];
  courierModeList = [];
  selectionTypeList = [];
  accessoryCodeList = [];
  patternList = [];
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
  duplicateFlag: boolean = false;
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
    else {
      this.addArea();
    }
    this.getCollectionList();
    this.getAccessoryLookup();
    this.getPatternLookup();
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }


  addArea() {

    let areaObj = {
      area: null,
      contRoleId: Math.floor(Math.random() * 2000),
      unitList: []
    }

    let unitObj = {
      unit: null,
      contRoleId: Math.floor(Math.random() * 2000),
      patternId: null,
      fabricList: [
        {
          categoryId: 1,
          contRoleId: Math.floor(Math.random() * 2000),
          collectionId: null,
          shadeId: null,
          isPatch: false,
          isLining: false,
          rate: null,
          discount: null,
        }
      ],
      accessoryList: [
        {
          accessoryId: null,
          amount: null,
          contRoleId: Math.floor(Math.random() * 2000),
        }
      ]
    }
    areaObj.unitList.push(unitObj);
    this.trnCurtainSelectionObj.areaList.push(areaObj);
  }

  removeArea(areaIndex) {
    // this.trnCurtainSelectionObj.areaList.slice(index, 1);
    if (this.trnCurtainSelectionObj.areaList.length > 1)
      this.trnCurtainSelectionObj.areaList = _.remove(this.trnCurtainSelectionObj.areaList, function(rec, index) {
        if (areaIndex != index) {
          return rec;
        }
      });
  }

  addUnit(areaObj) {
    let unitObj = {
      unit: null,
      contRoleId: Math.floor(Math.random() * 2000),
      patternId: null,
      fabricList: [
        {
          contRoleId: Math.floor(Math.random() * 2000),
          categoryId: 1,
          collectionId: null,
          shadeId: null,
          isPatch: false,
          isLining: false,
          rate: null,
          discount: null,
        }
      ],
      accessoryList: [
        {
          contRoleId: Math.floor(Math.random() * 2000),
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
      this.trnCurtainSelectionObj.areaList[areaIndex].unitList = _.remove(this.trnCurtainSelectionObj.areaList[areaIndex].unitList, function(rec, index) {
        if (unitindex != index) {
          return rec;
        }
      });
  }

  addFabricRow(row) {
    row.fabricList.push({
      contRoleId: Math.floor(Math.random() * 2000),
      categoryId: 1,
      collectionId: null,
      shadeId: null,
      isPatch: false,
      isLining: false,
      rate: null,
      discount: null,
    });
  }

  onDeleteFabricRow(areaindex, unitIndex, fabricIndex, fabricList) {
    if (this.trnCurtainSelectionObj.areaList[areaindex].unitList[unitIndex].fabricList.length > 1)
      this.trnCurtainSelectionObj.areaList[areaindex].unitList[unitIndex].fabricList = _.remove(this.trnCurtainSelectionObj.areaList[areaindex].unitList[unitIndex].fabricList, function(rec, index) {
        if (fabricIndex != index) {
          return rec;
        }
      });

  }

  deleteAccessoryRow(areaindex, unitIndex, accesoryIndex, accessoryList) {
    if (this.trnCurtainSelectionObj.areaList[areaindex].unitList[unitIndex].accessoryList.length > 1)
      this.trnCurtainSelectionObj.areaList[areaindex].unitList[unitIndex].accessoryList = _.remove(this.trnCurtainSelectionObj.areaList[areaindex].unitList[unitIndex].accessoryList, function(rec, index) {
        if (accesoryIndex != index) {
          return rec;
        }
      });
  }

  addAccessoryRow(row) {
    row.accessoryList.push({
      contRoleId: Math.floor(Math.random() * 2000),
      accessoryId: null,
      amount: null,
      rate: null
    });
  }

  onUpdateAndCreateQuotation() {
    if (this.trnCurtainSelectionObj.isQuotationCreated) {
      if (this.trnCurtainSelectionObj.id != null) {
        Helpers.setLoading(true);
        this.trnCurtainSelectionService.viewCurtainQuotation(this.trnCurtainSelectionObj.id).subscribe(
          result => {
            this.router.navigate(['/features/sales/trnCurtainQuotation/edit', result], { queryParams: { curtainQuotationId: result } });
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
        this.formatrequest();
        this.trnCurtainSelectionService.updateTrnCurtainSelection(this.trnCurtainSelectionObj)
          .subscribe(
          results => {
            this.params = null;
            this.messageService.addMessage({ severity: results.type.toLowerCase(), summary: results.type, detail: results.message });
            Helpers.setLoading(false);
            this.router.navigate(['/features/sales/trnCurtainQuotation/add'], { queryParams: { curtainSelectionId: this.trnCurtainSelectionObj.id } });
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
        let vm = this;
        this.trnCurtainSelectionObj = results;
        if (this.trnCurtainSelectionObj.isQuotationCreated == false) {
          this.viewItem = true;
        } else {
          this.viewItem = false;
        }
        this.trnCurtainSelectionObj.curtainSelectionDate = new Date(this.trnCurtainSelectionObj.curtainSelectionDate);
        this.trnCurtainSelectionItems = results.trnCurtainSelectionItems;

        let areaObjList = _.uniqBy(results.trnCurtainSelectionItems, 'area');
        vm.trnCurtainSelectionObj.areaList = [];
        _.forEach(areaObjList, function(value) {
          vm.trnCurtainSelectionObj.areaList.push({
            area: value.area,
            contRoleId: Math.floor(Math.random() * 2000),
          });
        });

        _.forEach(vm.trnCurtainSelectionObj.areaList, function(areaObj) {

          areaObj.unitList = [];
          let repetedUnit = _.filter(results.trnCurtainSelectionItems, { 'area': areaObj.area });

          let unitObjList = _.uniqBy(repetedUnit, 'unit');

          _.forEach(unitObjList, function(value) {
            areaObj.unitList.push({
              unit: value.unit,
              area: value.area,
              patternId: value.patternId,
              contRoleId: Math.floor(Math.random() * 2000),
            });
          });

          //  if (this.trnCurtainSelectionObj.areaList.unitList.accessoryList.length == 0){
          //   accessoryList: [
          //       {
          //         contRoleId: Math.floor(Math.random() * 2000),
          //         accessoryId: null,
          //         amount: null,
          //       }
          //     ]
          //  }

          // _.forEach(results.trnCurtainSelectionItems, function (value) {
          //   let unitObj = _.find(areaObj.unitList, { 'unit': value.unit, 'area': value.area });
          //   if (!unitObj) {
          //     areaObj.unitList = areaObj.unitList || [];
          //     areaObj.unitList.push({
          //       unit: value.unit,
          //       area: value.area,
          //       patternId: value.patternId,
          //       contRoleId: Math.floor(Math.random() * 2000),
          //     });
          //   }
          // });
        });

        _.forEach(vm.trnCurtainSelectionObj.areaList, function(areaObj) {
          _.forEach(areaObj.unitList, function(value) {
            let fabricDataList = _.filter(results.trnCurtainSelectionItems, { 'unit': value.unit, 'area': value.area, 'categoryId': 1 });
            value.fabricList = fabricDataList;
            let accssoryDataList = _.filter(results.trnCurtainSelectionItems, { 'unit': value.unit, 'area': value.area, 'categoryId': 7 });
            if (accssoryDataList && accssoryDataList.length == 0) {
              accssoryDataList.push(
                {
                  contRoleId: Math.floor(Math.random() * 2000),
                  accessoryId: null,
                  amount: null,
                }
              );
            }
            value.accessoryList = accssoryDataList;
          });
        });


        // this.addressList = results.mstCustomer.mstCustomerAddresses;
        // _.forEach(this.trnCurtainSelectionItems, function (value) {
        //   if (value.mstCategory != null)
        //     value.categoryName = value.mstCategory.code;
        //   if (value.mstCollection != null)
        //     value.collectionName = value.mstCollection.collectionCode;

        // });
        delete this.trnCurtainSelectionObj['trnCurtainSelectionItems'];
        Helpers.setLoading(false);
      },
      error => {
        this.globalErrorHandler.handleError(error);
        Helpers.setLoading(false);
      });
  }

  selectedLining(areaIndex, unitIndex, fabricIndex) {
    _.forEach(this.trnCurtainSelectionObj.areaList[areaIndex].unitList[unitIndex].fabricList, function(fabObj) {
      fabObj.isLining = false;
    });
    this.trnCurtainSelectionObj.areaList[areaIndex].unitList[unitIndex].fabricList[fabricIndex].isLining = true;
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

  onChangeShade(fabricRow) {
    // let shadeObj = _.find(fabricRow.shadeList, ['shadeId', fabricRow.shadeId]);
    // fabricRow.rate = shadeObj.rrp;
    // fabricRow.discount = shadeObj.maxFlatRateDisc ? shadeObj.maxFlatRateDisc : 0;
  }


  onChangeAccesory(accessoryRow) {
    let shadeObj = _.find(this.accessoryCodeList, ['accessoryId', accessoryRow.accessoryId]);
    accessoryRow.rate = shadeObj.sellingRate;
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
    this.trnCurtainSelectionService.getAccessoryCodeListForselection().subscribe(
      results => {
        this.accessoryCodeList = results;
        this.accessoryCodeList.unshift({ itemCode: '--Select--', accessoryId: null });
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


  onChangeCollection(fabricRow) {
    this.shadeList = [];
    this.shadeList.unshift({ serialno: '--Select--', shadeId: null });
    if (fabricRow.collectionId != null) {
      this.getshadeList(fabricRow);
    }
  }


  getshadeList(fabricRow) {
    Helpers.setLoading(true);
    this.trnCurtainSelectionService.getShadeForCurtainSelectionByCollectionId(fabricRow.collectionId).subscribe(
      results => {
        fabricRow.shadeList = results;
        fabricRow.shadeList.unshift({ serialno: '--Select--', shadeId: null });
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



  getPatternLookup() {
    Helpers.setLoading(true);
    this.commonService.getPatternLookup().subscribe(
      results => {
        this.patternList = results;
        this.patternList.unshift({ label: '--Select--', value: null });
        Helpers.setLoading(false);
      },
      error => {
        this.globalErrorHandler.handleError(error);
        Helpers.setLoading(false);
      });
  }

  onSubmit({ value, valid }: { value: any, valid: boolean }) {
    this.isFormSubmitted = true;
    let custObj = _.find(this.customerList, ['value', this.trnCurtainSelectionObj.customerId]);
    this.trnCurtainSelectionObj.customerName = custObj ? custObj.label : '';
    this.formatrequest();
    if (valid) {
      if (!this.duplicateFlag)
        this.saveTrncurtainSelection(this.trnCurtainSelectionObj);
    }
  }

  formatrequest() {
    let vm = this;
    this.trnCurtainSelectionObj.trnCurtainSelectionItems = [];
    this.trnCurtainSelectionObj.areaList.forEach(function(areaObj) {
      if (vm.trnCurtainSelectionObj.areaList.length > 1) {
        let areaObject = _.filter(vm.trnCurtainSelectionObj.areaList, { 'area': areaObj.area });
        if (areaObject.length > 1) {
          vm.messageService.addMessage({ severity: 'error', summary: 'Error', detail: "Please choose different area name." });
          vm.duplicateFlag = true;
          return false;
        } else {
          vm.duplicateFlag = false;
        }

      }
      areaObj.unitList.forEach(function(unitObj) {
        unitObj.fabricList.forEach(function(fabricobj) {
          let collectionObj = _.find(vm.collectionList, ['value', fabricobj.collectionId]);
          let obj = {
            "area": areaObj.area,
            "unit": unitObj.unit,
            "patternId": unitObj.patternId,
            "categoryId": 1,
            "collectionId": fabricobj.collectionId,
            "shadeId": fabricobj.shadeId,
            "accessoryId": null,
            "isPatch": fabricobj.isPatch,
            "isLining": fabricobj.isLining,
            // "rate": fabricobj.rate,
            // "discount": null,
            "categoryName": 'Fabric',
            "collectionName": collectionObj ? collectionObj.label : '',
            // "serialno": "5",
            // "itemCode": null
          }
          vm.trnCurtainSelectionObj.trnCurtainSelectionItems.push(obj);
        });

        unitObj.accessoryList.forEach(function(accessoryobj) {

          if (accessoryobj.accessoryId != null) {
            let obj = {
              "area": areaObj.area,
              "unit": unitObj.unit,
              "patternId": unitObj.patternId,
              "categoryId": 7,
              "collectionId": null,
              "shadeId": null,
              "accessoryId": accessoryobj.accessoryId,
              "isPatch": false,
              "isLining": false,
              "rate": accessoryobj.rate,
              //"discount": null,
              "categoryName": null,
              "collectionName": null,
              // "serialno": "5",
              // "itemCode": null
            }
            vm.trnCurtainSelectionObj.trnCurtainSelectionItems.push(obj);
          }

          // if(unitObj.accessoryList[0].accessoryId == null){
          //   unitObj.accessoryList.shift();
          // }

        });

      });
    });
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
          this.router.navigate(['/features/sales/trnCurtainSelection/list']);
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
          this.router.navigate(['/features/sales/trnCurtainSelection/list']);
        },
        error => {
          this.globalErrorHandler.handleError(error);
          Helpers.setLoading(false);
        });
    }
  }

  onCancel() {
    this.router.navigate(['/features/sales/trnCurtainSelection/list']);
    this.disabled = false;
    this.viewItem = true;
  }
}
