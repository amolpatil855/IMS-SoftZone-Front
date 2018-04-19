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
import { TrnCurtainQuotationService } from '../../../../_services/trnCurtainQuotation.service';
import { ShadeService } from '../../../../_services/shade.service';
import { ScriptLoaderService } from '../../../../../../../_services/script-loader.service';
import { CommonService } from '../../../../_services/common.service';
import { TrnMaterialSelectionService } from '../../../../_services/trnMaterialSelection.service';
import { Helpers } from "../../../../../../../helpers";
import { TrnCurtainQuotation } from "../../../../_models/trnCurtainQuotation";
import { TrnProductStockService } from '../../../../_services/trnProductStock.service';
import { CollectionService } from '../../../../_services/collection.service';
import { CustomerService } from "../../../../_services/customer.service";
@Component({
  selector: "app-trnCurtainQuotation-add-edit",
  templateUrl: "./trnCurtainQuotation-add-edit.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class TrnCurtainQuotationAddEditComponent implements OnInit {
  trnCurtainQuotationForm: any;
  customerForm: any;
  trnCurtainQuotationObj: any;
  params: number;
  userRole: string;
  viewItem: boolean = true;
  adminFlag: boolean = false;
  isCustomerSubmitted: boolean = false;
  trnCurtainQuotationList = [];
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
  trnCurtainQuotationItems = [];
  customerTypeList = [];
  locationObj = null;
  selectedAddress: any;
  customerShippingAddress: any;
  isFormSubmitted = false;
  courierList = [];
  courierModeList = [];
  selectionTypeList = [];
  accessoryCodeList = [];
  patternList = [];
  trackAccessoryCodeList = [];
  disabled: boolean = false;
  shippingAddressObj = null;
  shippingAddress = '';
  selectedRadio: boolean;
  stateError: boolean;
  typeError: boolean;
  display: boolean = false;
  curtainSelectionId: null;
  trackCodeList = [];
  rodCodeList = [];
  rodAccessoriesCodeList = [];
  rodAccessoryCodeList = [];
  motorCodeList = [];
  remoteCodeList = [];
  fabricTotal = 0;
  minAllowedDiscount = 0;
  accessoriesTotal = 0;
  tempAccessory = 0;
  stitchingTotal = 0;
  grandTotal = 0;
  grandTotalWithoutLabourCharges = 0;
  isAlreadySubtracted= true;
  constructor(
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,

    private trnCurtainSelectionService: TrnCurtainSelectionService,
    private trnCurtainQuotationService: TrnCurtainQuotationService,
    private shadeService: ShadeService,
    private trnMaterialSelectionService: TrnMaterialSelectionService,
    private collectionService: CollectionService,
    private customerService: CustomerService,
    private globalErrorHandler: GlobalErrorHandler,
    private confirmationService: ConfirmationService,
    private commonService: CommonService,
    private trnProductStockService: TrnProductStockService,
    private messageService: MessageService) {
  }

  ngOnInit() {
    this.getLoggedInUserDetail();
    this.trnCurtainQuotationObj = new TrnCurtainQuotation();
    this.trnCurtainQuotationObj.customerId = null;
    this.trnCurtainQuotationObj.referById = null;
    this.getCourierList();
    this.getAgentLookUp();
    let today = new Date();
    this.locationObj = {};
    this.disabled = false;
    this.trnCurtainQuotationObj.curtainQuotationDate = today;
    this.trnCurtainQuotationObj.selectionType = null;
    this.route.queryParams
      .subscribe(params => {
        this.curtainSelectionId = params.curtainSelectionId;
        if (this.curtainSelectionId) {
          this.trnCurtainSelectionService.createCurtainQuotation(this.curtainSelectionId).subscribe(
            results => {
              this.trnCurtainQuotationObj = results;
              this.trnCurtainQuotationObj.curtainQuotationDate = new Date();
              this.trnCurtainQuotationObj.expectedDeliveryDate = null;
              this.trnCurtainQuotationItems = this.trnCurtainQuotationObj.trnCurtainQuotationItems;
              this.formatGetData(results);
              Helpers.setLoading(false);
            },
            error => {
              this.globalErrorHandler.handleError(error);
              Helpers.setLoading(false);
            });
        }
      });


    this.route.params.forEach((params: Params) => {
      this.params = params['id'];
    });
    if (this.params) {
      this.disabled = true;
      this.getTrnCurtainQuotationById(this.params);
    }
    else {
      this.addArea();
    }
    this.getCollectionList();
    this.getAccessoryLookup();
    this.getPatternLookup();
    this.getRodAccessoryLookup();
    this.getRodAccessoriesItemCodeLookup();
    this.getTrackAccessoryLookup();
    this.getMotorLookup();
    this.getRemoteLookup();
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

  onApprove() {
    let vm = this;
    if (this.params) {
      if (Math.round(vm.grandTotalWithoutLabourCharges * 0.8) > parseInt(this.trnCurtainQuotationObj.advanceAmount)) {
        this.messageService.addMessage({ severity: 'error', summary: 'Error', detail: "Advance amount must be greater than grand total." });
        return false;
      }

      if (this.params) {
        this.trnCurtainQuotationObj.trnCurtainQuotationItems = this.trnCurtainQuotationItems;
        Helpers.setLoading(true);
        this.trnCurtainQuotationService.updateTrnCurtainQuotation(this.trnCurtainQuotationObj)
          .subscribe(
            results => {
              this.approveCurtainQuotation();
              Helpers.setLoading(false);
            },
            error => {
              this.globalErrorHandler.handleError(error);
              Helpers.setLoading(false);
            });
      }
    }
  }

  approveCurtainQuotation() {
    this.trnCurtainQuotationService.approveCurtainQuotation(this.trnCurtainQuotationObj)
      .subscribe(
        results => {
          this.messageService.addMessage({ severity: results.type.toLowerCase(), summary: results.type, detail: results.message });
          if (results.type == 'Success') {
            this.params = null;
            this.viewItem = false;
            this.trnCurtainQuotationObj.status = 'Approved';
          }
          Helpers.setLoading(false);
        },
        error => {
          this.globalErrorHandler.handleError(error);
          Helpers.setLoading(false);
        });
  }

  onCancelCQ() {
    if (this.params) {
      Helpers.setLoading(true);
      this.trnCurtainQuotationService.cancelCurtainQuotation(this.trnCurtainQuotationObj)
        .subscribe(
          results => {
            this.params = null;
            this.viewItem = false;
            this.messageService.addMessage({ severity: results.type.toLowerCase(), summary: results.type, detail: results.message });
            this.router.navigate(['/features/sales/trnCurtainQuotation/list']);
            Helpers.setLoading(false);
            this.disabled = false;
            this.viewItem = true;
          },
          error => {
            this.globalErrorHandler.handleError(error);
            Helpers.setLoading(false);
          });
    }
  }

  onChangeIsVerticalPatchCheckbox(fabricRow, fabricRowNum, unitRowNum, rowNum, unitRow) {
    if (fabricRow.isVerticalPatch == false) {
      fabricRow.noOfVerticalPatch = null;
      fabricRow.verticalPatchWidth = null;
      fabricRow.verticalPatchQuantity = null;
      if (fabricRow.isHorizontalPatch == true && fabricRow.noOfHorizontalPatch && fabricRow.horizontalPatchHeight)
        this.calculateHorizontalQuantity(fabricRow, fabricRowNum, unitRowNum, rowNum, unitRow);
      else {
        fabricRow.orderQuantity = 0;
        this.changeDiscount(fabricRow, fabricRowNum, unitRowNum, rowNum);
      }

    } else {
      this.calculateVerticalQuantity(fabricRow, fabricRowNum, unitRowNum, rowNum, unitRow);
    }
  }

  onChangeIsHorizontalPatchCheckbox(fabricRow, fabricRowNum, unitRowNum, rowNum, unitRow) {
    if (fabricRow.isHorizontalPatch == false) {
      fabricRow.noOfHorizontalPatch = null;
      fabricRow.horizontalPatchHeight = null;
      fabricRow.horizontalPatchQuantity = null;
      if (fabricRow.isVerticalPatch == true && fabricRow.noOfVerticalPatch && fabricRow.verticalPatchWidth)
        this.calculateVerticalQuantity(fabricRow, fabricRowNum, unitRowNum, rowNum, unitRow);
      else {
        fabricRow.orderQuantity = 0;
        this.changeDiscount(fabricRow, fabricRowNum, unitRowNum, rowNum);
      }

    } else {
      this.calculateHorizontalQuantity(fabricRow, fabricRowNum, unitRowNum, rowNum, unitRow);
    }
  }

  onChangeIsTrackCheckbox(unitRow) {
    if (unitRow.isTrack == false) {
      unitRow.trackAccessoryId = null;
      unitRow.trackRate = null;
      unitRow.trackQuantity = null;
      unitRow.trackAmountWithGST = null;
    }
  }

  onChangeIsMotorCheckbox(unitRow) {
    if (unitRow.isMotor == false) {
      unitRow.motorAccessoryId = null;
      unitRow.motorRate = null;
      unitRow.motorQuantity = null;
      unitRow.motorAmountWithGST = null;
    }
  }

  onChangeIsRemoteCheckbox(unitRow) {
    if (unitRow.isRemote == false) {
      unitRow.remoteAccessoryId = null;
      unitRow.remoteRate = null;
      unitRow.remoteQuantity = null;
      unitRow.remoteAmountWithGST = null;
    }
  }

  onChangeIsRodCheckbox() {
    if (this.trnCurtainQuotationObj.isRod == false) {
      this.trnCurtainQuotationObj.rodAccessoryId = null;
      this.trnCurtainQuotationObj.rodRate = null;
      this.trnCurtainQuotationObj.rodQuantity = null;
      this.trnCurtainQuotationObj.rodAmountWithGST = null;
    }
  }

  onChangeIsRodAccessoryCheckbox() {
    if (this.trnCurtainQuotationObj.isRodAccessory == false) {
      this.trnCurtainQuotationObj.rodItemAccessoryId = null;
      this.trnCurtainQuotationObj.rodItemAccessoryRate = null;
      this.trnCurtainQuotationObj.rodItemAccessoryQuantity = null;
      this.trnCurtainQuotationObj.rodItemAccessoryAmountWithGST = null;
    }
  }

  print(): void {
    let printContents, popupWin;
    printContents = document.getElementById('invoiceMainBox').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.title = "Curtain_Quotation.pdf";
    popupWin.document.write(`
      <html>
        <head>
          <style>
          //........Customized style.......
          </style>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
  }

  formatGetData(results) {
    let vm = this;
    let areaObjList = _.uniqBy(results.trnCurtainQuotationItems, 'area');
    vm.trnCurtainQuotationObj.areaList = [];
    _.forEach(areaObjList, function (value) {
      vm.trnCurtainQuotationObj.areaList.push({
        area: value.area,
        contRoleId: Math.floor(Math.random() * 2000),
      });
    });

    _.forEach(vm.trnCurtainQuotationObj.areaList, function (areaObj) {

      areaObj.unitList = [];
      let repetedUnit = _.filter(results.trnCurtainQuotationItems, { 'area': areaObj.area });

      let unitObjList = _.uniqBy(repetedUnit, 'unit');

      _.forEach(unitObjList, function (value) {
        areaObj.unitList.push({
          unit: value.unit,
          area: value.area,
          unitHeight: value.unitHeight,
          unitWidth: value.unitWidth,
          patternId: value.patternId,
          contRoleId: Math.floor(Math.random() * 2000),
        });
      });

    });

    _.forEach(vm.trnCurtainQuotationObj.areaList, function (areaObj) {
      _.forEach(areaObj.unitList, function (value) {
        let fabricDataList = _.filter(results.trnCurtainQuotationItems, { 'unit': value.unit, 'area': value.area, 'categoryId': 1 });
        _.forEach(fabricDataList, function (temp) {
          temp.contRoleId = Math.floor(Math.random() * 2000)
        });

        value.fabricList = fabricDataList;
        let accssoryDataList = _.filter(results.trnCurtainQuotationItems, { 'unit': value.unit, 'area': value.area, 'categoryId': 7 });
        _.forEach(accssoryDataList, function (temp) {
          temp.contRoleId = Math.floor(Math.random() * 2000)
          temp.rate = temp.accessoriesDetails.sellingRate;
          temp.rateWithGST = temp.rate + ((temp.rate * temp.accessoriesDetails.gst) / 100);
        });
        value.accessoryList = accssoryDataList;
      });
    });
    this.findMinGlobalDiscount();
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
      trackAccessoryId: null,
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
    this.trnCurtainQuotationObj.areaList.push(areaObj);
  }

  removeArea(areaIndex) {
    // this.trnCurtainQuotationObj.areaList.slice(index, 1);
    if (this.trnCurtainQuotationObj.areaList.length > 1)
      this.trnCurtainQuotationObj.areaList = _.remove(this.trnCurtainQuotationObj.areaList, function (rec, index) {
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
    // this.trnCurtainQuotationObj.areaList[areaIndex].unitList.slice(unitindex, 1);
    if (this.trnCurtainQuotationObj.areaList[areaIndex].unitList.length > 1)
      this.trnCurtainQuotationObj.areaList[areaIndex].unitList = _.remove(this.trnCurtainQuotationObj.areaList[areaIndex].unitList, function (rec, index) {
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
    if (this.trnCurtainQuotationObj.areaList[areaindex].unitList[unitIndex].fabricList.length > 1)
      this.trnCurtainQuotationObj.areaList[areaindex].unitList[unitIndex].fabricList = _.remove(this.trnCurtainQuotationObj.areaList[areaindex].unitList[unitIndex].fabricList, function (rec, index) {
        if (fabricIndex != index) {
          return rec;
        }
      });

  }

  deleteAccessoryRow(areaindex, unitIndex, accesoryIndex, accessoryList) {
    if (this.trnCurtainQuotationObj.areaList[areaindex].unitList[unitIndex].accessoryList.length > 1)
      this.trnCurtainQuotationObj.areaList[areaindex].unitList[unitIndex].accessoryList = _.remove(this.trnCurtainQuotationObj.areaList[areaindex].unitList[unitIndex].accessoryList, function (rec, index) {
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
    });
  }



  onUnitWidthChange(unitRow, unitIndex, areaIndex) {
    if (unitRow.unitWidth) {
      let selectedPatternId = this.trnCurtainQuotationObj.areaList[areaIndex].unitList[unitIndex].patternId;
      let selectedPatternObj = _.find(this.patternList, { id: selectedPatternId });
      if (selectedPatternObj) {
        this.trnCurtainQuotationObj.areaList[areaIndex].unitList[unitIndex].numberOfPanel = Math.ceil(unitRow.unitWidth / selectedPatternObj.widthPerInch);

        this.trnCurtainQuotationObj.areaList[areaIndex].unitList[unitIndex].laborCharges = Math.round(this.trnCurtainQuotationObj.areaList[areaIndex].unitList[unitIndex].numberOfPanel * selectedPatternObj.setRateForCustomer);
        this.onUnitHeightChange(unitRow, unitIndex, areaIndex);
        this.calculateGrandTotal();

        if (unitRow.isTrack)
          unitRow.trackQuantity = Math.round(unitRow.unitWidth / 12);
        this.changeTrackQuantity(unitRow, unitIndex, areaIndex);
      }
    }
  }

  onFabricDirectionChange(fabObj, unitIndex, areaIndex, unitRow) {
    let vm = this;
    let selectedPatternId = this.trnCurtainQuotationObj.areaList[areaIndex].unitList[unitIndex].patternId;
    let selectedPatternObj = _.find(this.patternList, { id: selectedPatternId });
    if (fabObj.isLining && fabObj.fabricDirection == "Vertical") {
      fabObj.orderQuantity = parseFloat(((54 * parseFloat(unitRow.numberOfPanel)) / parseFloat(selectedPatternObj.meterPerInch)).toString()).toFixed(2);
      let tempQuantity = parseFloat(fabObj.orderQuantity);
      let fabricWidth = _.cloneDeep(fabObj.shadeDetails.fabricWidth);
      while (fabricWidth < unitRow.unitHeight) {
        fabricWidth = parseFloat(fabricWidth) + parseFloat(fabObj.shadeDetails.fabricWidth);
        fabObj.orderQuantity = parseFloat(fabObj.orderQuantity) + tempQuantity;
      }
    }
    else if (fabObj.isLining && fabObj.fabricDirection == "Horizontal")
      fabObj.orderQuantity = (((parseFloat(unitRow.unitHeight) + parseFloat(selectedPatternObj.liningHeight)) / parseFloat(selectedPatternObj.meterPerInch)) * (parseFloat(unitRow.unitWidth) / 50)).toFixed(2);
    else if (!fabObj.isLining && fabObj.fabricDirection == "Vertical") {
      fabObj.orderQuantity = parseFloat(((54 * parseFloat(unitRow.numberOfPanel)) / parseFloat(selectedPatternObj.meterPerInch)).toString()).toFixed(2);
      let tempQuantity = parseFloat(fabObj.orderQuantity);
      let fabricWidth = _.cloneDeep(fabObj.shadeDetails.fabricWidth);
      while (fabricWidth < unitRow.unitHeight) {
        fabricWidth = parseFloat(fabricWidth) + parseFloat(fabObj.shadeDetails.fabricWidth);
        fabObj.orderQuantity = parseFloat(fabObj.orderQuantity) + tempQuantity;
      }
    } else if (!fabObj.isLining && fabObj.fabricDirection == "Horizontal")
      fabObj.orderQuantity = (((parseFloat(unitRow.unitHeight) + parseFloat(selectedPatternObj.fabricHeight)) / parseFloat(selectedPatternObj.meterPerInch)) * (parseFloat(unitRow.unitWidth) / 50)).toFixed(2);
    else
      fabObj.orderQuantity = 0;

    fabObj.orderQuantity = vm.adjustMainFabricQuantity(fabObj.orderQuantity);
  }

  onUnitHeightChange(unitRow, unitIndex, areaIndex) {
    if (!unitRow.unitHeight)
      return;
    let vm = this;
    let selectedPatternId = this.trnCurtainQuotationObj.areaList[areaIndex].unitList[unitIndex].patternId;
    let selectedPatternObj = _.find(this.patternList, { id: selectedPatternId });
    if (selectedPatternObj) {
      let quantity = 0;// ((unitRow.unitHeight + )/ selectedPatternObj.meterPerInch);

      _.forEach(this.trnCurtainQuotationObj.areaList[areaIndex].unitList[unitIndex].fabricList, function (fabObj, index) {
        fabObj.orderQuantity = 0;
        if (fabObj.isLining || (!fabObj.isLining && !fabObj.isPatch)) {
          if (fabObj.shadeDetails.fabricWidth <= 100) {
            if (fabObj.isLining)
              fabObj.orderQuantity = parseFloat(((parseFloat(unitRow.unitHeight) + parseFloat(selectedPatternObj.liningHeight)) / parseFloat(selectedPatternObj.meterPerInch)).toString()).toFixed(2);
            else
              fabObj.orderQuantity = parseFloat(((parseFloat(unitRow.unitHeight) + parseFloat(selectedPatternObj.fabricHeight)) / parseFloat(selectedPatternObj.meterPerInch)).toString()).toFixed(2);

            if (vm.trnCurtainQuotationObj.areaList[areaIndex].unitList[unitIndex].numberOfPanel)
              fabObj.orderQuantity = fabObj.orderQuantity * vm.trnCurtainQuotationObj.areaList[areaIndex].unitList[unitIndex].numberOfPanel;
          }
          else {
            if (fabObj.isLining && fabObj.fabricDirection == "Vertical") {
              if (unitRow.numberOfPanel) {
                fabObj.orderQuantity = parseFloat(((54 * parseFloat(unitRow.numberOfPanel)) / parseFloat(selectedPatternObj.meterPerInch)).toString()).toFixed(2);
                let tempQuantity = parseFloat(fabObj.orderQuantity);
                let fabricWidth = _.cloneDeep(fabObj.shadeDetails.fabricWidth);
                while (fabricWidth < unitRow.unitHeight) {
                  fabricWidth = parseFloat(fabricWidth) + parseFloat(fabObj.shadeDetails.fabricWidth);
                  fabObj.orderQuantity = parseFloat(fabObj.orderQuantity) + tempQuantity;
                }
              }
            }
            else if (fabObj.isLining && fabObj.fabricDirection == "Horizontal")
              fabObj.orderQuantity = (((parseFloat(unitRow.unitHeight) + parseFloat(selectedPatternObj.liningHeight)) / parseFloat(selectedPatternObj.meterPerInch)) * (parseFloat(unitRow.unitWidth) / 50)).toFixed(2);
            else if (!fabObj.isLining && fabObj.fabricDirection == "Vertical") {
              if (unitRow.numberOfPanel) {
                fabObj.orderQuantity = parseFloat(((54 * parseFloat(unitRow.numberOfPanel)) / parseFloat(selectedPatternObj.meterPerInch)).toString()).toFixed(2);
                let tempQuantity = parseFloat(fabObj.orderQuantity);
                let fabricWidth = _.cloneDeep(fabObj.shadeDetails.fabricWidth);
                while (fabricWidth < unitRow.unitHeight) {
                  fabricWidth = parseFloat(fabricWidth) + parseFloat(fabricWidth);
                  fabObj.orderQuantity = parseFloat(fabObj.orderQuantity) + tempQuantity;
                }
              }
            } else if (!fabObj.isLining && fabObj.fabricDirection == "Horizontal")
              fabObj.orderQuantity = (((parseFloat(unitRow.unitHeight) + parseFloat(selectedPatternObj.fabricHeight)) / parseFloat(selectedPatternObj.meterPerInch)) * (parseFloat(unitRow.unitWidth) / 50)).toFixed(2);
          }


          fabObj.orderQuantity = vm.adjustMainFabricQuantity(fabObj.orderQuantity);
          //let shadeObj = _.find(fabObj.shadeList, { shadeId: fabObj.shadeId });
          if (fabObj.shadeDetails) {
            fabObj.rate = parseFloat(fabObj.shadeDetails.flatRate ? fabObj.shadeDetails.flatRate : fabObj.shadeDetails.rrp).toFixed(2);
            fabObj.maxDiscount = fabObj.shadeDetails.flatRate ? 0 : fabObj.orderQuantity >= 50 ? fabObj.shadeDetails.maxRoleRateDisc : fabObj.shadeDetails.maxCutRateDisc;
            fabObj.discount = 0;
            vm.changeDiscount(fabObj, index, unitIndex, areaIndex);
          }
        }
      });
    }
  }

  findMinGlobalDiscount() {
    let vm = this;
    let discountArray = [];
    _.forEach(vm.trnCurtainQuotationObj.areaList, function (areaObj) {
      _.forEach(areaObj.unitList, function (unitObj) {
        _.forEach(unitObj.fabricList, function (fabObj) {
          discountArray.push(fabObj.shadeDetails.maxCutRateDisc);
        });
      });
    });
    vm.trnCurtainQuotationObj.minAllowedDiscount = _.min(discountArray);
  }
  changeGlobalDiscount() {
    let vm = this;
    _.forEach(vm.trnCurtainQuotationObj.areaList, function (areaObj, rowNum) {
      _.forEach(areaObj.unitList, function (unitObj, unitRowNum) {
        _.forEach(unitObj.fabricList, function (fabricRow, fabricRowNum) {
          if (!fabricRow.shadeDetails.flatRate) {
            fabricRow.discount = vm.trnCurtainQuotationObj.commonDiscount;
            vm.changeDiscount(fabricRow, fabricRowNum, unitRowNum, rowNum);
          }

        });
      });
    });
  }

  changeDiscount(fabricRow, fabricRowNum, unitRowNum, rowNum) {
    if (!fabricRow.rate)
      return;
    //let shadeObj = _.find(fabricRow.shadeList, { shadeId: fabricRow.shadeId });
    let rate = parseFloat(fabricRow.rate);
    if (rate) {
      fabricRow.rateWithGST = rate + (rate * fabricRow.shadeDetails.gst) / 100;
      //this.amountWithGST =this.rateWithGST * this.orderQuantity;
      fabricRow.amount = rate * fabricRow.orderQuantity;
      //this.amountWithGST = Math.round(this.amountWithGST - ((this.amountWithGST * givenDicount) / 100));
      fabricRow.amount = Math.round(fabricRow.amount - ((fabricRow.amount * fabricRow.discount) / 100));
      fabricRow.amountWithGST = Math.round(fabricRow.amount + ((fabricRow.amount * fabricRow.shadeDetails.gst) / 100));
    }
    this.calculateGrandTotal();

  }

  calculateGrandTotal() {
    let vm = this;
    vm.fabricTotal = 0;
    vm.accessoriesTotal = 0;
    vm.grandTotal = 0;
    vm.grandTotalWithoutLabourCharges = 0;
    _.forEach(vm.trnCurtainQuotationObj.areaList, function (areaObj, rowNum) {
      _.forEach(areaObj.unitList, function (unitObj, unitRowNum) {
        _.forEach(unitObj.fabricList, function (fabricRow, fabricRowNum) {
          vm.fabricTotal += fabricRow.amountWithGST;
        });
        _.forEach(unitObj.accessoryList, function (accessoryObj) {
          vm.accessoriesTotal += accessoryObj.amountWithGST;
        });
      });
    });
    vm.accessoriesTotal +=  vm.tempAccessory;
    vm.grandTotal = vm.grandTotal + vm.fabricTotal + vm.accessoriesTotal + vm.stitchingTotal;
    vm.grandTotalWithoutLabourCharges = Math.round(vm.grandTotal - vm.stitchingTotal);
  }

  calculateVerticalQuantity(fabricRow, fabricRowNum, unitRowNum, rowNum, unitRow) {
    if (!fabricRow.verticalPatchWidth || !fabricRow.noOfVerticalPatch)
      return false;
    let selectedPatternId = this.trnCurtainQuotationObj.areaList[rowNum].unitList[unitRowNum].patternId;
    let selectedPatternObj = _.find(this.patternList, { id: selectedPatternId });
    if (selectedPatternObj) {
      if (unitRow.unitHeight) {
        let tempQuantity = ((parseFloat(unitRow.unitHeight) + 12) / parseFloat(selectedPatternObj.meterPerInch)).toFixed(2);
        let patchQuantity = parseFloat(tempQuantity);
        let patchsize = (parseFloat(fabricRow.verticalPatchWidth) + parseFloat(selectedPatternObj.verticalPatch)) * parseFloat(fabricRow.noOfVerticalPatch);
        let fabricWidth = _.cloneDeep(fabricRow.shadeDetails.fabricWidth);
        while (fabricWidth < patchsize) {
          fabricWidth = fabricWidth + fabricRow.shadeDetails.fabricWidth;
          patchQuantity = patchQuantity + parseFloat(tempQuantity);
        }
        fabricRow.verticalPatchQuantity = patchQuantity;
        fabricRow.verticalPatchQuantity = fabricRow.verticalPatchQuantity.toFixed(2);
        fabricRow.orderQuantity = (fabricRow.horizontalPatchQuantity ? parseFloat(fabricRow.horizontalPatchQuantity) : 0) + parseFloat(fabricRow.verticalPatchQuantity);
        fabricRow.orderQuantity = this.adjustPatchQuantity(fabricRow.orderQuantity);
        //let shadeObj = _.find(fabricRow.shadeList, { shadeId: fabricRow.shadeId });
        fabricRow.verticalPatchRate = parseFloat(fabricRow.shadeDetails.flatRate ? fabricRow.shadeDetails.flatRate : fabricRow.shadeDetails.rrp).toFixed(2);
        fabricRow.verticalPatchMaxDiscount = fabricRow.shadeDetails.flatRate ? fabricRow.shadeDetails.maxFlatRateDisc : fabricRow.verticalPatchQuantity >= 50 ? fabricRow.shadeDetails.maxRoleRateDisc : fabricRow.shadeDetails.maxCutRateDisc;
        fabricRow.verticalPatchDiscount = 0;
        this.changeDiscount(fabricRow, fabricRowNum, unitRowNum, rowNum);
      }
    }

  }


  calculateHorizontalQuantity(fabricRow, fabricRowNum, unitRowNum, rowNum, unitRow) {
    if (!fabricRow.horizontalPatchHeight || !fabricRow.noOfHorizontalPatch)
      return false;
    let selectedPatternId = this.trnCurtainQuotationObj.areaList[rowNum].unitList[unitRowNum].patternId;
    let selectedPatternObj = _.find(this.patternList, { id: selectedPatternId });
    if (selectedPatternObj) {
      let tempQuantity = (((parseFloat(fabricRow.horizontalPatchHeight) + parseFloat(selectedPatternObj.horizontalPatch)) / parseFloat(selectedPatternObj.meterPerInch)) * parseFloat(fabricRow.noOfHorizontalPatch)).toFixed(2);
      let patchQuantity = parseFloat(tempQuantity);
      // let patchsize = (parseFloat(fabricRow.horizontalPatchHeight) + parseFloat(selectedPatternObj.horizontalPatch)) * parseFloat(fabricRow.noOfVerticalPatch);
      // while (patchsize < unitRow.unitWidth) {
      //   patchsize = patchsize + patchsize;
      //   patchQuantity = patchQuantity + patchQuantity;
      // }
      fabricRow.horizontalPatchQuantity = patchQuantity;
      fabricRow.horizontalPatchQuantity = fabricRow.horizontalPatchQuantity.toFixed(2);
      //let shadeObj = _.find(fabricRow.shadeList, { shadeId: fabricRow.shadeId });
      fabricRow.horizontalPatchRate = parseFloat(fabricRow.shadeDetails.flatRate ? fabricRow.shadeDetails.flatRate : fabricRow.shadeDetails.rrp).toFixed(2);
      fabricRow.horizontalPatchMaxDiscount = fabricRow.shadeDetails.flatRate ? fabricRow.shadeDetails.maxFlatRateDisc : fabricRow.horizontalPatchQuantity >= 50 ? fabricRow.shadeDetails.maxRoleRateDisc : fabricRow.shadeDetails.maxCutRateDisc;
      fabricRow.horizontalPatchDiscount = 0;
      fabricRow.orderQuantity = parseFloat(fabricRow.horizontalPatchQuantity) + (fabricRow.verticalPatchQuantity ? parseFloat(fabricRow.verticalPatchQuantity) : 0);
      fabricRow.orderQuantity = this.adjustPatchQuantity(fabricRow.orderQuantity);
      this.changeDiscount(fabricRow, fabricRowNum, unitRowNum, rowNum);
    }
  }

  adjustPatchQuantity(orderQuantity) {
    if (!orderQuantity)
      return 0;

    let tempQuantity = parseFloat(orderQuantity).toFixed(2);
    let quantityArray = tempQuantity.split('.');
    if (quantityArray.length > 1) {

      if (parseInt(quantityArray[1]) > 50) {
        orderQuantity = parseInt(quantityArray[0]) + 1;
      }
      else {
        orderQuantity = parseInt(quantityArray[0]) + 0.5;
      }
    }
    return orderQuantity;
  }


  adjustMainFabricQuantity(orderQuantity) {
    if (!orderQuantity)
      return 0;
    let partNumber = 0;
    let tempQuantity = parseFloat(orderQuantity).toFixed(2);
    let quantityArray = tempQuantity.split('.');
    if (quantityArray.length > 1) {
      if (parseInt(quantityArray[1]) > 50) {
        // partNumber = parseInt(quantityArray[1]) % 10;
        // partNumber = (10 - partNumber) / 10;
        // orderQuantity = parseInt(quantityArray[0]) + partNumber;
        orderQuantity = parseInt(quantityArray[0]) + 1;
      }
      else {
        orderQuantity = parseInt(quantityArray[0]) + 0.5;
      }
    }
    return orderQuantity;
  }

  changeTrackQuantity(unitRow, unitRowNum, rowNum) {
    unitRow.trackAmount = 0;
    unitRow.trackAmountWithGST = 0;
    unitRow.trackGST = 0;
    if (unitRow.trackAccessoryId != null) {
      let trackObj = _.find(this.trackCodeList, { accessoryId: unitRow.trackAccessoryId });
      unitRow.trackAmount = unitRow.trackRate * unitRow.trackQuantity;
      unitRow.trackAmountWithGST = Math.round(unitRow.trackAmount + (unitRow.trackAmount * trackObj.gst) / 100);
      unitRow.trackGST = trackObj.gst;
      this.calculateGrandTotal();
      this.grandTotalWithoutLabourCharges += unitRow.trackAmountWithGST;
    }
  }

  changeMotorQuantity(unitRow, unitRowNum, rowNum) {
    unitRow.motorAmount = 0;
    unitRow.motorAmountWithGST = 0;
    unitRow.motorGST = 0;
    if (unitRow.motorAccessoryId != null) {
      let motorObj = _.find(this.motorCodeList, { accessoryId: unitRow.motorAccessoryId });
      unitRow.motorAmount = unitRow.motorRate * unitRow.motorQuantity;
      unitRow.motorAmountWithGST = Math.round(unitRow.motorAmount + (unitRow.motorAmount * motorObj.gst) / 100);
      unitRow.motorGST = motorObj.gst;
      this.calculateGrandTotal();
      this.grandTotalWithoutLabourCharges += unitRow.motorAmountWithGST;
    }
  }
  changeRemoteQuantity(unitRow, unitRowNum, rowNum) {
    unitRow.remoteAmount = 0;
    unitRow.remoteAmountWithGST = 0;
    unitRow.remoteGST = 0;
    if (unitRow.remoteAccessoryId != null) {
      let remoteObj = _.find(this.remoteCodeList, { accessoryId: unitRow.remoteAccessoryId });
      unitRow.remoteAmount = unitRow.remoteRate * unitRow.remoteQuantity;
      unitRow.remoteAmountWithGST = Math.round(unitRow.remoteAmount + (unitRow.remoteAmount * remoteObj.gst) / 100);
      unitRow.remoteGST = remoteObj.gst;
      this.calculateGrandTotal();
      this.grandTotalWithoutLabourCharges += unitRow.remoteAmountWithGST;
    }
  }

  changeRodQuantity() {
    this.trnCurtainQuotationObj.rodAmount = 0;
    this.trnCurtainQuotationObj.rodAmountWithGST = 0;
    this.trnCurtainQuotationObj.rodGST = 0;
    if (this.trnCurtainQuotationObj.rodAccessoryId != null) {
      let rodObj = _.find(this.rodCodeList, { accessoryId: this.trnCurtainQuotationObj.rodAccessoryId });
      this.trnCurtainQuotationObj.rodAmount = Math.round(this.trnCurtainQuotationObj.rodRate * this.trnCurtainQuotationObj.rodQuantity);
      this.trnCurtainQuotationObj.rodAmountWithGST = Math.round(this.trnCurtainQuotationObj.rodAmount + (this.trnCurtainQuotationObj.rodAmount * rodObj.gst) / 100);
      this.trnCurtainQuotationObj.rodGST = rodObj.gst;
      this.calculateGrandTotal();
      this.grandTotalWithoutLabourCharges += this.trnCurtainQuotationObj.rodAmountWithGST;
    }
  }

  changeRodItemAccessoryQuantity() {
    this.trnCurtainQuotationObj.rodItemAccessoryAmount = 0;
    this.trnCurtainQuotationObj.rodItemAccessoryAmountWithGST = 0;
    this.trnCurtainQuotationObj.rodItemAccessoryGST = 0;
    if (this.trnCurtainQuotationObj.rodItemAccessoryId != null) {
      let rodObj = _.find(this.rodAccessoriesCodeList, { accessoryId: this.trnCurtainQuotationObj.rodItemAccessoryId });
      this.trnCurtainQuotationObj.rodItemAccessoryAmount = Math.round(this.trnCurtainQuotationObj.rodItemAccessoryRate * this.trnCurtainQuotationObj.rodItemAccessoryQuantity);
      this.trnCurtainQuotationObj.rodItemAccessoryAmountWithGST = Math.round(this.trnCurtainQuotationObj.rodItemAccessoryAmount + (this.trnCurtainQuotationObj.rodItemAccessoryAmount * rodObj.gst) / 100);
      this.trnCurtainQuotationObj.rodItemAccessoryGST = rodObj.gst;
      this.calculateGrandTotal();
      this.grandTotalWithoutLabourCharges += this.trnCurtainQuotationObj.rodItemAccessoryAmountWithGST;
    }
  }

  changeAccessoryQuantity(accessoryRow) {
    if (accessoryRow.orderQuantity) {
      accessoryRow.amount = Math.round(accessoryRow.accessoriesDetails.sellingRate * accessoryRow.orderQuantity);
      accessoryRow.amountWithGST = Math.round(accessoryRow.amount + (accessoryRow.amount * accessoryRow.accessoriesDetails.gst) / 100);
      this.calculateGrandTotal();
        //vm.grandTotalWithoutLabourCharges -= accessoryRow.amountWithGST;
      
    }
  }



  onUpdateAndCreateQuotation() {
    if (this.trnCurtainQuotationObj.isQuotationCreated) {
      if (this.trnCurtainQuotationObj.id != null) {
        Helpers.setLoading(true);
        this.trnCurtainQuotationService.getTrnCurtainQuotationById(this.trnCurtainQuotationObj.id).subscribe(
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
        this.trnCurtainQuotationObj.trnCurtainQuotationItems = this.trnCurtainQuotationItems;
        this.trnCurtainQuotationService.updateTrnCurtainQuotation(this.trnCurtainQuotationObj)
          .subscribe(
            results => {
              this.params = null;
              this.messageService.addMessage({ severity: results.type.toLowerCase(), summary: results.type, detail: results.message });
              Helpers.setLoading(false);
              this.router.navigate(['/features/sales/trnCurtainQuotation/add'], { queryParams: { CurtainQuotationId: this.trnCurtainQuotationObj.id } });
            },
            error => {
              this.globalErrorHandler.handleError(error);
              Helpers.setLoading(false);
            });
      }
    }
  }

  onDateSelect() {
    if (this.trnCurtainQuotationObj.expectedDeliveryDate < this.trnCurtainQuotationObj.curtainQuotationDate) {
      this.trnCurtainQuotationObj.expectedDeliveryDate = new Date();
    }
  }

  getTrnCurtainQuotationById(id) {
    Helpers.setLoading(true);
    this.trnCurtainQuotationService.getTrnCurtainQuotationById(id).subscribe(
      results => {
        let vm = this;
        this.trnCurtainQuotationObj = results;
        if (this.trnCurtainQuotationObj.status == "Created") {
          this.viewItem = true;
        } else {
          this.viewItem = false;
        }
        this.trnCurtainQuotationObj.curtainQuotationDate = new Date(this.trnCurtainQuotationObj.curtainQuotationDate);
        this.trnCurtainQuotationObj.expectedDeliveryDate = new Date(this.trnCurtainQuotationObj.expectedDeliveryDate);
        if (this.trnCurtainQuotationObj.expectedDeliveryDate.getFullYear() < 2017) {
          this.trnCurtainQuotationObj.expectedDeliveryDate = null;
        }
        this.customerShippingAddress = this.trnCurtainQuotationObj.mstCustomer.mstCustomerAddresses[0];
        this.trnCurtainQuotationItems = results.trnCurtainQuotationItems;

        let areaObjList = _.uniqBy(results.trnCurtainQuotationItems, 'area');
        vm.trnCurtainQuotationObj.areaList = [];
        _.forEach(areaObjList, function (value) {
          if (value.area) {
            vm.trnCurtainQuotationObj.areaList.push({
              area: value.area,
              contRoleId: Math.floor(Math.random() * 2000),
            });
          }
        });
        vm.stitchingTotal = 0;
        vm.fabricTotal = 0;
        vm.accessoriesTotal = 0;
        vm.grandTotal = 0;
        vm.grandTotalWithoutLabourCharges = 0;
        _.forEach(vm.trnCurtainQuotationObj.areaList, function (areaObj) {

          areaObj.unitList = [];
          let repetedUnit = _.filter(results.trnCurtainQuotationItems, { 'area': areaObj.area });

          let unitObjList = _.uniqBy(repetedUnit, 'unit');

          _.forEach(unitObjList, function (value) {
            if (value.unit) {
              vm.stitchingTotal = vm.stitchingTotal + value.laborCharges;
              areaObj.unitList.push({
                unit: value.unit,
                area: value.area,
                patternId: value.patternId,
                unitHeight: value.unitHeight,
                unitWidth: value.unitWidth,
                laborCharges: value.laborCharges,
                numberOfPanel: value.numberOfPanel,
                mstPattern: value.mstPattern,
                contRoleId: Math.floor(Math.random() * 2000),
              });

            }
          });

          // _.forEach(results.trnCurtainQuotationItems, function (value) {
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
        let normalAccessoryAmount = 0;
        let trackAccessoryAmount = 0;
        let motorAccessoryAmount = 0;
        let rodAccessoryAmount = 0;
        let remoteAccessoryAmount = 0;
        _.forEach(vm.trnCurtainQuotationObj.areaList, function (areaObj) {
          _.forEach(areaObj.unitList, function (value) {
            let fabricDataList = _.filter(results.trnCurtainQuotationItems, { 'unit': value.unit, 'area': value.area, 'categoryId': 1 });
            _.forEach(fabricDataList, function (temp) {
              temp.contRoleId = Math.floor(Math.random() * 2000)
            });
            value.fabricList = fabricDataList;
            let accssoryDataList = _.filter(results.trnCurtainQuotationItems, { 'unit': value.unit, 'area': value.area, 'categoryId': 7, 'isTrack': false, 'isRod': false });
            _.forEach(accssoryDataList, function (temp) {
              temp.contRoleId = Math.floor(Math.random() * 2000),
                temp.rate = temp.accessoriesDetails.sellingRate;
              temp.rateWithGST = temp.rate + ((temp.rate * temp.accessoriesDetails.gst) / 100);
            });
            value.accessoryList = accssoryDataList;
            _.forEach(value.fabricList, function (fabricObj) {
              vm.fabricTotal = vm.fabricTotal + fabricObj.amountWithGST;
            });

            _.forEach(value.accessoryList, function (accessoryObj) {
              normalAccessoryAmount = normalAccessoryAmount + accessoryObj.amountWithGST;
            });

            let trackObj = _.find(results.trnCurtainQuotationItems, { "isTrack": true, unit: value.unit });
            if (trackObj) {
              trackAccessoryAmount = trackAccessoryAmount + trackObj.amountWithGST;
              value.trackAccessoriesDetails = trackObj.accessoriesDetails;
              value.trackId = trackObj.id;
              value.trackGST = trackObj.gst;
              value.trackAccessoryId = trackObj.accessoryId;
              value.isTrack = true;
              value.trackAmount = trackObj.amount;
              value.trackAmountWithGST = trackObj.amountWithGST;
              value.trackRate = trackObj.rate;
              value.trackQuantity = trackObj.orderQuantity;
            }

            let motorObj = _.find(results.trnCurtainQuotationItems, { "isMotor": true, unit: value.unit });
            if (motorObj) {
              motorAccessoryAmount = motorAccessoryAmount + motorObj.amountWithGST;
              value.motorAccessoriesDetails = motorObj.accessoriesDetails;
              value.motorId = motorObj.id;
              value.motorGST = motorObj.gst;
              value.motorAccessoryId = motorObj.accessoryId;
              value.isMotor = true;
              value.motorAmount = motorObj.amount;
              value.motorAmountWithGST = motorObj.amountWithGST;
              value.motorRate = motorObj.rate;
              value.motorQuantity = motorObj.orderQuantity;
            }

            let remoteObj = _.find(results.trnCurtainQuotationItems, { "isRemote": true, unit: value.unit });
            if (motorObj) {
              if (remoteObj != null) {
                remoteAccessoryAmount = remoteAccessoryAmount + remoteObj.amountWithGST;
                value.remoteAccessoriesDetails = remoteObj.accessoriesDetails;
                value.remoteId = remoteObj.id;
                value.remoteGST = remoteObj.gst;
                value.remoteAccessoryId = remoteObj.accessoryId;
                value.isRemote = true;
                value.remoteAmount = remoteObj.amount;
                value.remoteAmountWithGST = remoteObj.amountWithGST;
                value.remoteRate = remoteObj.rate;
                value.remoteQuantity = remoteObj.orderQuantity;
              }
            }

          });
        });

        let isRodObj = _.find(results.trnCurtainQuotationItems, { "isRod": true });
        if (isRodObj) {
          rodAccessoryAmount = rodAccessoryAmount + isRodObj.amountWithGST;
          vm.trnCurtainQuotationObj.rodAccessoriesDetails = isRodObj.accessoriesDetails;
          vm.trnCurtainQuotationObj.rodId = isRodObj.id;
          vm.trnCurtainQuotationObj.rodGST = isRodObj.gst;
          vm.trnCurtainQuotationObj.rodAccessoryId = isRodObj.accessoryId;
          vm.trnCurtainQuotationObj.isRod = true;
          vm.trnCurtainQuotationObj.rodAmount = isRodObj.amount;
          vm.trnCurtainQuotationObj.rodAmountWithGST = isRodObj.amountWithGST;
          vm.trnCurtainQuotationObj.rodQuantity = isRodObj.orderQuantity;
          vm.trnCurtainQuotationObj.rodRate = isRodObj.rate;
        }


        let isRodAccessoryObj = _.find(results.trnCurtainQuotationItems, { "isRodAccessory": true });
        if (isRodAccessoryObj) {
          rodAccessoryAmount = rodAccessoryAmount + isRodAccessoryObj.amountWithGST;
          vm.trnCurtainQuotationObj.rodItemAccessoryDetails = isRodAccessoryObj.accessoriesDetails;
          vm.trnCurtainQuotationObj.rodAccessoryRecordId = isRodAccessoryObj.id;
          vm.trnCurtainQuotationObj.rodItemAccessoryGST = isRodAccessoryObj.gst;
          vm.trnCurtainQuotationObj.rodItemAccessoryId = isRodAccessoryObj.accessoryId;
          vm.trnCurtainQuotationObj.isRodAccessory = true;
          vm.trnCurtainQuotationObj.rodItemAccessoryAmount = isRodAccessoryObj.amount;
          vm.trnCurtainQuotationObj.rodItemAccessoryAmountWithGST = isRodAccessoryObj.amountWithGST;
          vm.trnCurtainQuotationObj.rodItemAccessoryQuantity = isRodAccessoryObj.orderQuantity;
          vm.trnCurtainQuotationObj.rodItemAccessoryRate = isRodAccessoryObj.rate;
        }
        vm.tempAccessory = normalAccessoryAmount + trackAccessoryAmount + rodAccessoryAmount + motorAccessoryAmount + remoteAccessoryAmount;
        vm.accessoriesTotal = vm.accessoriesTotal + vm.tempAccessory;
        vm.grandTotal = vm.grandTotal + vm.fabricTotal + vm.accessoriesTotal + vm.stitchingTotal;
        vm.grandTotalWithoutLabourCharges = Math.round(vm.grandTotal - vm.stitchingTotal);
        this.findMinGlobalDiscount();
        Helpers.setLoading(false);
      },
      error => {
        this.globalErrorHandler.handleError(error);
        Helpers.setLoading(false);
      });
  }

  selectedLining(areaIndex, unitIndex, fabricIndex) {
    _.forEach(this.trnCurtainQuotationObj.areaList[areaIndex].unitList[unitIndex].fabricList, function (fabObj) {
      fabObj.isLining = false;
    });
    this.trnCurtainQuotationObj.areaList[areaIndex].unitList[unitIndex].fabricList[fabricIndex].isLining = true;
  }

  onPatternChange(unitRow) {
    let vm = this;
    let accessoryAmount = 0;
    vm.fabricTotal = 0;
    vm.grandTotal = 0;
    vm.grandTotalWithoutLabourCharges = 0;
    unitRow.numberOfPanel = 0;
    if(unitRow.patternId != null){
      unitRow.mstPattern = _.find(this.patternList, ['id', unitRow.patternId]);
    _.forEach(vm.trnCurtainQuotationObj.areaList, function (areaObj, rowNum) {
      _.forEach(areaObj.unitList, function (unitRow, unitRowNum) {
        unitRow.numberOfPanel = Math.ceil(unitRow.unitWidth / unitRow.mstPattern.widthPerInch);
        unitRow.laborCharges = Math.round(unitRow.numberOfPanel * unitRow.mstPattern.setRateForCustomer);
        vm.onUnitHeightChange(unitRow, unitRowNum, rowNum);
        _.forEach(unitRow.fabricList, function (fabricRow, fabricRowNum) {
          if (fabricRow.isPatch) {
            if (fabricRow.isVerticalPatch)
              vm.calculateVerticalQuantity(fabricRow, fabricRowNum, unitRowNum, rowNum, unitRow);
            if (fabricRow.isHorizontalPatch)
              vm.calculateHorizontalQuantity(fabricRow, fabricRowNum, unitRowNum, rowNum, unitRow);
          }
          vm.fabricTotal += fabricRow.amountWithGST;
        });
        _.forEach(unitRow.accessoryList, function (accessoryRow) {
          accessoryAmount += accessoryRow.amountWithGST;
        });
      });
    });
    vm.accessoriesTotal = vm.accessoriesTotal + accessoryAmount + vm.tempAccessory;

    vm.grandTotal = vm.grandTotal + vm.fabricTotal + vm.accessoriesTotal + vm.stitchingTotal;
    vm.grandTotalWithoutLabourCharges = Math.round(vm.grandTotal - vm.stitchingTotal);
    } 
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

  // onChangeShade(fabricRow) {
  //   let shadeObj = _.find(fabricRow.shadeList, ['shadeId', fabricRow.shadeId]);
  //   fabricRow.rate = shadeObj.rrp;
  //   fabricRow.discount = shadeObj.maxFlatRateDisc ? shadeObj.maxFlatRateDisc : 0;
  // }


  // onChangeAccesory(accessoryRow) {
  //   let shadeObj = _.find(this.accessoryCodeList, ['accessoryId', accessoryRow.accessoryId]);
  //   accessoryRow.rate = shadeObj.sellingRate;
  // }
  onChangeRodAccesory() {
    let shadeObj = _.find(this.rodCodeList, ['accessoryId', this.trnCurtainQuotationObj.rodAccessoryId]);
    this.trnCurtainQuotationObj.rodRate = shadeObj.sellingRate;
    this.trnCurtainQuotationObj.rodItemCode = shadeObj.itemCode;
    this.trnCurtainQuotationObj.rodRateWithGST = Math.round(this.trnCurtainQuotationObj.rodRate + ((this.trnCurtainQuotationObj.rodRate * shadeObj.gst) / 100));

  }

  onChangeRodItemAccessory() {
    let shadeObj = _.find(this.rodAccessoriesCodeList, ['accessoryId', this.trnCurtainQuotationObj.rodItemAccessoryId]);
    this.trnCurtainQuotationObj.rodItemAccessoryItemCode = shadeObj.itemCode;
    this.trnCurtainQuotationObj.rodItemAccessoryRate = shadeObj.sellingRate;
    this.trnCurtainQuotationObj.rodItemAccessoryRateWithGST = Math.round(this.trnCurtainQuotationObj.rodItemAccessoryRate + ((this.trnCurtainQuotationObj.rodItemAccessoryRate * shadeObj.gst) / 100));
  }

  onChangeTrackAccesory(accessoryRow) {
    accessoryRow.trackItemCode = null;
    accessoryRow.trackRate = 0;
    accessoryRow.trackRateWithGST = 0;
    accessoryRow.trackQuantity = 0;
    accessoryRow.trackAmount = 0;
    accessoryRow.trackAmountWithGST = 0;
    if (accessoryRow.trackAccessoryId != null) {
      let accessoryObj = _.find(this.trackCodeList, ['accessoryId', accessoryRow.trackAccessoryId]);
      accessoryRow.trackItemCode = accessoryObj.itemCode;
      accessoryRow.trackRate = accessoryObj.sellingRate;
      accessoryRow.trackRateWithGST = Math.round(accessoryRow.trackRate + (accessoryRow.trackRate * accessoryObj.gst) / 100);
      accessoryRow.trackQuantity = Math.round(accessoryRow.unitWidth / 12);
      accessoryRow.trackAmount = Math.round(parseFloat(accessoryRow.trackQuantity) * parseFloat(accessoryRow.trackRateWithGST));
    }
  }
  onChangeMotorAccesory(accessoryRow) {
    accessoryRow.motorItemCode = null;
    accessoryRow.motorRate = 0;
    accessoryRow.motorRateWithGST = 0;
    accessoryRow.motorQuantity = 0;
    accessoryRow.motorAmount = 0;
    accessoryRow.motorAmountWithGST = 0;
    if (accessoryRow.motorAccessoryId != null) {
      let accessoryObj = _.find(this.motorCodeList, ['accessoryId', accessoryRow.motorAccessoryId]);
      accessoryRow.motorRate = accessoryObj.sellingRate;
      accessoryRow.motorItemCode = accessoryObj.itemCode;
      accessoryRow.motorRateWithGST = Math.round(accessoryRow.motorRate + (accessoryRow.motorRate * accessoryObj.gst) / 100);
      accessoryRow.motorAmount = Math.round(parseFloat(accessoryRow.motorQuantity) * parseFloat(accessoryRow.motorRateWithGST));
    }
  }
  onChangeRemoteAccesory(accessoryRow) {
    accessoryRow.remoteItemCode = null;
    accessoryRow.remoteRate = 0;
    accessoryRow.remoterRateWithGST = 0;
    accessoryRow.remoteQuantity = 0;
    accessoryRow.remoteAmount = 0;
    accessoryRow.remoteAmountWithGST = 0;
    if (accessoryRow.remoteAccessoryId != null) {
      let accessoryObj = _.find(this.remoteCodeList, ['accessoryId', accessoryRow.remoteAccessoryId]);
      accessoryRow.remoteRate = accessoryObj.sellingRate;
      accessoryRow.remoteItemCode = accessoryObj.itemCode;
      accessoryRow.remoteRateWithGST = Math.round(accessoryRow.motorRate + (accessoryRow.motorRate * accessoryObj.gst) / 100);
      accessoryRow.remoteAmount = Math.round(parseFloat(accessoryRow.remoteQuantity) * parseFloat(accessoryRow.remoteRateWithGST));
    }
  }

  onCancelItemDetails() {

    this.trnCurtainQuotationObj.selectionType = null;
    this.trnCurtainQuotationObj.area = null;
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

  getTrackAccessoryLookup() {
    Helpers.setLoading(true);
    this.commonService.GetTrackAccessoryItemCodeForCQ().subscribe(
      results => {
        this.trackCodeList = results;
        this.trackCodeList.unshift({ itemCode: '--Select--', accessoryId: null });
        Helpers.setLoading(false);
      },
      error => {
        this.globalErrorHandler.handleError(error);
        Helpers.setLoading(false);
      });
  }

  getRodAccessoryLookup() {
    Helpers.setLoading(true);
    this.commonService.getRodAccessoryItemCodeForCQ().subscribe(
      results => {
        this.rodCodeList = results;
        this.rodCodeList.unshift({ itemCode: '--Select--', accessoryId: null });
        Helpers.setLoading(false);
      },
      error => {
        this.globalErrorHandler.handleError(error);
        Helpers.setLoading(false);
      });
  }

  getRodAccessoriesItemCodeLookup() {
    Helpers.setLoading(true);
    this.commonService.getRodAccessoriesItemCodeForCQ().subscribe(
      results => {
        this.rodAccessoriesCodeList = results;
        this.rodAccessoriesCodeList.unshift({ itemCode: '--Select--', accessoryId: null });
        Helpers.setLoading(false);
      },
      error => {
        this.globalErrorHandler.handleError(error);
        Helpers.setLoading(false);
      });
  }


  getMotorLookup() {
    Helpers.setLoading(true);
    this.commonService.getMotorItemCodeForCQ().subscribe(
      results => {
        this.motorCodeList = results;
        this.motorCodeList.unshift({ itemCode: '--Select--', accessoryId: null });
        Helpers.setLoading(false);
      },
      error => {
        this.globalErrorHandler.handleError(error);
        Helpers.setLoading(false);
      });
  }


  getRemoteLookup() {
    Helpers.setLoading(true);
    this.commonService.getRemoteCodeForCQ().subscribe(
      results => {
        this.remoteCodeList = results;
        this.remoteCodeList.unshift({ itemCode: '--Select--', accessoryId: null });
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


  // onChangeCollection(fabricRow) {
  //   this.shadeList = [];
  //   this.shadeList.unshift({ serialno: '--Select--', shadeId: null });
  //   if (fabricRow.collectionId != null) {
  //     this.getshadeList(fabricRow);
  //   }
  // }

  // getshadeList(fabricRow) {
  //   Helpers.setLoading(true);
  //   this.trnCurtainSelectionService.getShadeForCurtainSelectionByCollectionId(fabricRow.collectionId).subscribe(
  //     results => {
  //       fabricRow.shadeList = results;
  //       fabricRow.shadeList.unshift({ serialno: '--Select--', shadeId: null });
  //       Helpers.setLoading(false);
  //     },
  //     error => {
  //       this.globalErrorHandler.handleError(error);
  //       Helpers.setLoading(false);
  //     });
  // }

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
    this.commonService.getAllPatternData().subscribe(
      results => {
        this.patternList = results;
        this.patternList.unshift({ name: '--Select--', id: null });
        Helpers.setLoading(false);
      },
      error => {
        this.globalErrorHandler.handleError(error);
        Helpers.setLoading(false);
      });
  }

  onSubmit({ value, valid }: { value: any, valid: boolean }) {
    this.isFormSubmitted = true;
    let vm = this;
    vm.trnCurtainQuotationObj.trnCurtainQuotationItems = [];
    // this.trnCurtainQuotationObj.TrnCurtainQuotationItems = this.trnCurtainQuotationItems;
    // let custObj = _.find(this.customerList, ['value', this.trnCurtainQuotationObj.customerId]);
    //this.trnCurtainQuotationObj.customerName = custObj ? custObj.label : '';
    vm.trnCurtainQuotationObj.totalAmount = this.grandTotalWithoutLabourCharges;
    this.trnCurtainQuotationObj.areaList.forEach(function (areaObj) {
      areaObj.unitList.forEach(function (unitObj) {
        unitObj.fabricList.forEach(function (fabricobj) {
          let collectionObj = _.find(vm.collectionList, ['value', fabricobj.collectionId]);
          let obj = {
            "area": areaObj.area,
            "unit": unitObj.unit,
            "patternId": unitObj.patternId,
            "categoryId": 1,
            'id': fabricobj.id,
            "collectionId": fabricobj.collectionId,
            "shadeId": fabricobj.shadeId,
            "accessoryId": null,
            "isPatch": fabricobj.isPatch,
            "fabricDirection": fabricobj.fabricDirection,
            "isVerticalPatch": fabricobj.isVerticalPatch,
            "noOfVerticalPatch": fabricobj.noOfVerticalPatch,
            "verticalPatchWidth": fabricobj.verticalPatchWidth,
            "verticalPatchQuantity": fabricobj.verticalPatchQuantity,
            "isHorizontalPatch": fabricobj.isHorizontalPatch,
            "noOfHorizontalPatch": fabricobj.noOfHorizontalPatch,
            "horizontalPatchHeight": fabricobj.horizontalPatchHeight,
            "horizontalPatchQuantity": fabricobj.horizontalPatchQuantity,
            "isLining": fabricobj.isLining,

            "unitHeight": unitObj.unitHeight,
            "unitWidth": unitObj.unitWidth,
            "orderQuantity": fabricobj.orderQuantity,
            "numberOfPanel": unitObj.numberOfPanel,
            "laborCharges": unitObj.laborCharges,
            "discount": fabricobj.discount,
            "rate": fabricobj.rate,
            "rateWithGST": fabricobj.rateWithGST,
            "amount": fabricobj.amount,
            "amountWithGST": fabricobj.amountWithGST,
            "gst": fabricobj.shadeDetails.gst,

            "categoryName": 'Fabric',
            "collectionName": collectionObj ? collectionObj.label : '',
            "serialno": fabricobj.serialno,
          }
          vm.trnCurtainQuotationObj.trnCurtainQuotationItems.push(obj);
        });

        unitObj.accessoryList.forEach(function (accessoryobj) {
          let obj = {
            "area": areaObj.area,
            "unit": unitObj.unit,
            "patternId": unitObj.patternId,
            'id': accessoryobj.id,
            "categoryId": 7,
            "collectionId": null,
            "shadeId": null,
            "accessoryId": accessoryobj.accessoryId,
            "isPatch": false,
            "isLining": false,
            "orderQuantity": accessoryobj.orderQuantity,
            "rateWithGST": accessoryobj.rateWithGST,
            "rate": accessoryobj.accessoriesDetails.sellingRate,
            "gst": accessoryobj.accessoriesDetails.gst,
            "amount": accessoryobj.amount,
            "amountWithGST": accessoryobj.amountWithGST,
            "discount": null,
            "categoryName": "Accessories",
            "collectionName": null,
            "itemCode": accessoryobj.itemCode
          }
          vm.trnCurtainQuotationObj.trnCurtainQuotationItems.push(obj);
        });


        if (unitObj.isTrack) {
          let obj = {
            "area": areaObj.area,
            "unit": unitObj.unit,
            "patternId": unitObj.patternId,
            "categoryId": 7,
            "collectionId": null,
            "shadeId": null,
            "accessoryId": unitObj.trackAccessoryId,
            "isTrack": true,
            "orderQuantity": unitObj.trackQuantity,
            'id': unitObj.trackId,
            "rate": unitObj.trackRate,
            "rateWithGST": unitObj.trackAmountWithGST,
            "gst": unitObj.trackGST,
            "amount": unitObj.trackAmount,
            "unitHeight": unitObj.unitHeight,
            "unitWidth": unitObj.unitWidth,
            "numberOfPanel": unitObj.numberOfPanel,
            "amountWithGST": unitObj.trackAmountWithGST,
            "discount": null,
            "categoryName": "Accessories",
            "collectionName": null,
            // "serialno": "5",
            "itemCode": unitObj.trackItemCode
          }
          if (obj)
            vm.trnCurtainQuotationObj.trnCurtainQuotationItems.push(obj);
        }

        if (unitObj.isMotor) {
          let obj = {
            "area": areaObj.area,
            "unit": unitObj.unit,
            "patternId": unitObj.patternId,
            "categoryId": 7,
            "collectionId": null,
            "shadeId": null,
            "accessoryId": unitObj.motorAccessoryId,
            "isMotor": true,
            "orderQuantity": unitObj.motorQuantity,
            'id': unitObj.motorId,
            "rate": unitObj.motorRate,
            "rateWithGST": unitObj.motorRateWithGST,
            "gst": unitObj.motorGST,
            "amount": unitObj.motorAmount,
            "amountWithGST": unitObj.motorAmountWithGST,
            "discount": null,
            "categoryName": "Accessories",
            "collectionName": null,
            // "serialno": "5",
            "itemCode": unitObj.motorItemCode
          }
          if (obj)
            vm.trnCurtainQuotationObj.trnCurtainQuotationItems.push(obj);
        }

        if (unitObj.isRemote) {
          let obj = {
            "area": areaObj.area,
            "unit": unitObj.unit,
            "patternId": unitObj.patternId,
            "categoryId": 7,
            "collectionId": null,
            "shadeId": null,
            "accessoryId": unitObj.remoteAccessoryId,
            "isRemote": true,
            "orderQuantity": unitObj.remoteQuantity,
            'id': unitObj.remoteId,
            "rate": unitObj.remoteRate,
            "rateWithGST": unitObj.remoteRateWithGST,
            "gst": unitObj.remoteGST,
            "amount": unitObj.remoteAmount,
            "amountWithGST": unitObj.remoteAmountWithGST,
            "discount": null,
            "categoryName": "Accessories",
            "collectionName": null,
            // "serialno": "5",
            "itemCode": unitObj.remoteItemCode
          }
          if (obj)
            vm.trnCurtainQuotationObj.trnCurtainQuotationItems.push(obj);
        }

      });
    });

    if (vm.trnCurtainQuotationObj.isRod) {
      let obj = {
        "categoryId": 7,
        "collectionId": null,
        "shadeId": null,
        "accessoryId": vm.trnCurtainQuotationObj.rodAccessoryId,
        "isRod": true,
        'id': vm.trnCurtainQuotationObj.rodId,
        "orderQuantity": vm.trnCurtainQuotationObj.rodQuantity,
        "rate": vm.trnCurtainQuotationObj.rodRate,
        "gst": vm.trnCurtainQuotationObj.rodGST,
        "amount": vm.trnCurtainQuotationObj.rodAmount,
        "amountWithGST": vm.trnCurtainQuotationObj.rodAmountWithGST,
        "discount": null,
        "categoryName": "Accessories",
        "collectionName": null,
        // "serialno": "5",
        "itemCode": vm.trnCurtainQuotationObj.rodItemCode
      }
      vm.trnCurtainQuotationObj.trnCurtainQuotationItems.push(obj);


      if (vm.trnCurtainQuotationObj.isRodAccessory) {
        let obj = {
          "categoryId": 7,
          "collectionId": null,
          "shadeId": null,
          "accessoryId": vm.trnCurtainQuotationObj.rodItemAccessoryId,
          "isRodAccessory": true,
          'id': vm.trnCurtainQuotationObj.rodAccessoryRecordId,
          "orderQuantity": vm.trnCurtainQuotationObj.rodItemAccessoryQuantity,
          "rate": vm.trnCurtainQuotationObj.rodItemAccessoryRate,
          "gst": vm.trnCurtainQuotationObj.rodItemAccessoryGST,
          "amount": vm.trnCurtainQuotationObj.rodItemAccessoryAmount,
          "amountWithGST": vm.trnCurtainQuotationObj.rodItemAccessoryAmountWithGST,
          "discount": null,
          "categoryName": "Accessories",
          "collectionName": null,
          // "serialno": "5",
          "itemCode": vm.trnCurtainQuotationObj.rodItemAccessoryItemCode
        }
        vm.trnCurtainQuotationObj.trnCurtainQuotationItems.push(obj);
      }

    }
    this.trnCurtainQuotationObj.totalAmount = this.grandTotalWithoutLabourCharges;

    if (valid) {
      this.saveTrnCurtainQuotation(this.trnCurtainQuotationObj);
    }
  }


  saveTrnCurtainQuotation(value) {
    let tempcurtainQuotationDate = new Date(value.curtainQuotationDate);
    let tempExpectedDeliveryDate = new Date(value.expectedDeliveryDate);
    value.curtainQuotationDate = new Date(tempcurtainQuotationDate.setHours(23));
    value.expectedDeliveryDate = new Date(tempExpectedDeliveryDate.setHours(23));
    Helpers.setLoading(true);
    if (this.params) {
      this.trnCurtainQuotationService.updateTrnCurtainQuotation(value)
        .subscribe(
          results => {
            this.params = null;
            this.messageService.addMessage({ severity: results.type.toLowerCase(), summary: results.type, detail: results.message });
            Helpers.setLoading(false);
            this.router.navigate(['/features/sales/trnCurtainQuotation/list']);
          },
          error => {
            this.globalErrorHandler.handleError(error);
            Helpers.setLoading(false);
          });
    } else {
      this.trnCurtainQuotationService.createTrnCurtainQuotation(value)
        .subscribe(
          results => {
            this.params = null;
            this.messageService.addMessage({ severity: results.type.toLowerCase(), summary: results.type, detail: results.message });
            Helpers.setLoading(false);
            this.router.navigate(['/features/sales/trnCurtainQuotation/list']);
          },
          error => {
            this.globalErrorHandler.handleError(error);
            Helpers.setLoading(false);
          });
    }
  }

  onCancel() {
    this.router.navigate(['/features/sales/trnCurtainQuotation/list']);
    this.disabled = false;
    this.viewItem = true;
  }
}
