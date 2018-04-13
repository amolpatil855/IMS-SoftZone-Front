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
  viewItem: boolean = true;
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
    this.getTrackAccessoryLookup();
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
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
        });
        value.accessoryList = accssoryDataList;
      });
    });
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
          isPatch: null,
          isLining: null,
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
      isPatch: null,
      isLining: null,
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
    if (!unitRow.unitWidth)
      return;
    let selectedPatternId = this.trnCurtainQuotationObj.areaList[areaIndex].unitList[unitIndex].patternId;
    let selectedPatternObj = _.find(this.patternList, { id: selectedPatternId });
    if (selectedPatternObj) {
      this.trnCurtainQuotationObj.areaList[areaIndex].unitList[unitIndex].numberOfPanel = Math.ceil(unitRow.unitWidth / selectedPatternObj.widthPerInch);
      this.trnCurtainQuotationObj.areaList[areaIndex].unitList[unitIndex].laborCharges = Math.round(this.trnCurtainQuotationObj.areaList[areaIndex].unitList[unitIndex].numberOfPanel * selectedPatternObj.setRateForPattern);
    }
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
        if (fabObj.isLining || (!fabObj.isLining && !fabObj.isPatch)) {
          if (fabObj.isLining)
            fabObj.orderQuantity = parseFloat(((parseFloat(unitRow.unitHeight) + parseFloat(selectedPatternObj.liningHeight)) / parseFloat(selectedPatternObj.meterPerInch)).toString()).toFixed(2);
          else
            fabObj.orderQuantity = parseFloat(((parseFloat(unitRow.unitHeight) + parseFloat(selectedPatternObj.fabricHeight)) / parseFloat(selectedPatternObj.meterPerInch)).toString()).toFixed(2);

          //let shadeObj = _.find(fabObj.shadeList, { shadeId: fabObj.shadeId });
          if (fabObj.shadeDetails) {
            fabObj.rate = parseFloat(fabObj.shadeDetails.flatRate ? fabObj.shadeDetails.flatRate : fabObj.shadeDetails.rrp).toFixed(2);
            fabObj.maxDiscount = fabObj.shadeDetails.flatRate ? fabObj.shadeDetails.maxFlatRateDisc : fabObj.orderQuantity >= 50 ? fabObj.shadeDetails.maxRoleRateDisc : fabObj.shadeDetails.maxCutRateDisc;
            fabObj.discount = 0;
            vm.changeDiscount(fabObj, index, unitIndex, areaIndex);
          }
        }
      });
    }
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

  }

  calculateVerticalQuantity(fabricRow, fabricRowNum, unitRowNum, rowNum, unitRow) {
    if (!fabricRow.verticalPatchWidth || !fabricRow.noOfVerticalPatch)
      return false;
    let selectedPatternId = this.trnCurtainQuotationObj.areaList[rowNum].unitList[unitRowNum].patternId;
    let selectedPatternObj = _.find(this.patternList, { id: selectedPatternId });
    if (selectedPatternObj) {
      let tempQuantity = ((parseFloat(unitRow.unitHeight) + 12) / parseFloat(selectedPatternObj.meterPerInch)).toFixed(2);
      let patchQuantity = parseFloat(tempQuantity);
      let patchsize = (parseFloat(fabricRow.verticalPatchWidth) + parseFloat(selectedPatternObj.verticalPatch)) * parseFloat(fabricRow.noOfVerticalPatch);
      while (patchsize < unitRow.unitWidth) {
        patchsize = patchsize + patchsize;
        patchQuantity = patchQuantity + patchQuantity;
      }
      fabricRow.verticalPatchQuantity = patchQuantity;
      fabricRow.orderQuantity = fabricRow.horizontalPatchQuantity + fabricRow.verticalPatchQuantity;
      fabricRow.orderQuantity = this.adjustQuantity(fabricRow.orderQuantity);
      //let shadeObj = _.find(fabricRow.shadeList, { shadeId: fabricRow.shadeId });
      fabricRow.verticalPatchRate = parseFloat(fabricRow.shadeDetails.flatRate ? fabricRow.shadeDetails.flatRate : fabricRow.shadeDetails.rrp).toFixed(2);
      fabricRow.verticalPatchMaxDiscount = fabricRow.shadeDetails.flatRate ? fabricRow.shadeDetails.maxFlatRateDisc : fabricRow.verticalPatchQuantity >= 50 ? fabricRow.shadeDetails.maxRoleRateDisc : fabricRow.shadeDetails.maxCutRateDisc;
      fabricRow.verticalPatchDiscount = 0;
      this.changeDiscount(fabricRow, fabricRowNum, unitRowNum, rowNum);
    }

  }


  calculateHorizontalQuantity(fabricRow, fabricRowNum, unitRowNum, rowNum, unitRow) {
    if (!fabricRow.horizontalPatchHeight || !fabricRow.noOfHorizontalPatch)
      return false;
    let selectedPatternId = this.trnCurtainQuotationObj.areaList[rowNum].unitList[unitRowNum].patternId;
    let selectedPatternObj = _.find(this.patternList, { id: selectedPatternId });
    if (selectedPatternObj) {
      let tempQuantity = ((parseFloat(fabricRow.horizontalPatchHeight) + parseFloat(selectedPatternObj.horizontalPatch)) / parseFloat(selectedPatternObj.meterPerInch)).toFixed(2);
      let patchQuantity = parseFloat(tempQuantity);
      // let patchsize = (parseFloat(fabricRow.horizontalPatchHeight) + parseFloat(selectedPatternObj.horizontalPatch)) * parseFloat(fabricRow.noOfVerticalPatch);
      // while (patchsize < unitRow.unitWidth) {
      //   patchsize = patchsize + patchsize;
      //   patchQuantity = patchQuantity + patchQuantity;
      // }
      fabricRow.horizontalPatchQuantity = patchQuantity;
      //let shadeObj = _.find(fabricRow.shadeList, { shadeId: fabricRow.shadeId });
      fabricRow.horizontalPatchRate = parseFloat(fabricRow.shadeDetails.flatRate ? fabricRow.shadeDetails.flatRate : fabricRow.shadeDetails.rrp).toFixed(2);
      fabricRow.horizontalPatchMaxDiscount = fabricRow.shadeDetails.flatRate ? fabricRow.shadeDetails.maxFlatRateDisc : fabricRow.horizontalPatchQuantity >= 50 ? fabricRow.shadeDetails.maxRoleRateDisc : fabricRow.shadeDetails.maxCutRateDisc;
      fabricRow.horizontalPatchDiscount = 0;
      fabricRow.orderQuantity = fabricRow.horizontalPatchQuantity + fabricRow.verticalPatchQuantity;
      fabricRow.orderQuantity = this.adjustQuantity(fabricRow.orderQuantity);
      this.changeDiscount(fabricRow, fabricRowNum, unitRowNum, rowNum);
    }
  }

  adjustQuantity(orderQuantity) {
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

  changeTrackQuantity(unitRow, unitRowNum, rowNum) {
    let trackObj = _.find(this.trackCodeList, { accessoryId: unitRow.trackAccessoryId });
    unitRow.trackAmount = unitRow.trackRate * unitRow.trackQuantity;
    unitRow.trackAmountWithGST = Math.round(unitRow.trackAmount + (unitRow.trackAmount * trackObj.gst) / 100);
    unitRow.trackGST = trackObj.gst;
  }
  changeRodQuantity() {
    let rodObj = _.find(this.rodCodeList, { accessoryId: this.trnCurtainQuotationObj.rodAccessoryId });
    this.trnCurtainQuotationObj.rodAmount = Math.round(this.trnCurtainQuotationObj.rodRate * this.trnCurtainQuotationObj.rodQuantity);
    this.trnCurtainQuotationObj.rodAmountWithGST = Math.round(this.trnCurtainQuotationObj.rodAmount + (this.trnCurtainQuotationObj.rodAmount * rodObj.gst) / 100);
    this.trnCurtainQuotationObj.rodGST = rodObj.gst;
  }
  changeAccessoryQuantity(accessoryRow) {
    accessoryRow.amount = Math.round(accessoryRow.accessoriesDetails.sellingRate * accessoryRow.orderQuantity);
    accessoryRow.amountWithGST = Math.round(accessoryRow.amount + (accessoryRow.amount * accessoryRow.accessoriesDetails.gst) / 100);
  }



  onUpdateAndCreateQuotation() {
    if (this.trnCurtainQuotationObj.isQuotationCreated) {
      if (this.trnCurtainQuotationObj.id != null) {
        Helpers.setLoading(true);
        this.trnCurtainQuotationService.getTrnCurtainQuotationById(this.trnCurtainQuotationObj.id).subscribe(
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
        this.trnCurtainQuotationObj.trnCurtainQuotationItems = this.trnCurtainQuotationItems;
        this.trnCurtainQuotationService.updateTrnCurtainQuotation(this.trnCurtainQuotationObj)
          .subscribe(
          results => {
            this.params = null;
            this.messageService.addMessage({ severity: results.type.toLowerCase(), summary: results.type, detail: results.message });
            Helpers.setLoading(false);
            this.router.navigate(['/features/sales/trnMaterialQuotation/add'], { queryParams: { CurtainQuotationId: this.trnCurtainQuotationObj.id } });
          },
          error => {
            this.globalErrorHandler.handleError(error);
            Helpers.setLoading(false);
          });
      }
    }
  }

  getTrnCurtainQuotationById(id) {
    Helpers.setLoading(true);
    this.trnCurtainQuotationService.getTrnCurtainQuotationById(id).subscribe(
      results => {
        let vm = this;
        this.trnCurtainQuotationObj = results;
        if (this.trnCurtainQuotationObj.isQuotationCreated == false) {
          this.viewItem = true;
        } else {
          this.viewItem = false;
        }
        this.trnCurtainQuotationObj.curtainQuotationDate = new Date(this.trnCurtainQuotationObj.curtainQuotationDate);
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

        _.forEach(vm.trnCurtainQuotationObj.areaList, function (areaObj) {

          areaObj.unitList = [];
          let repetedUnit = _.filter(results.trnCurtainQuotationItems, { 'area': areaObj.area });

          let unitObjList = _.uniqBy(repetedUnit, 'unit');

          _.forEach(unitObjList, function (value) {

            if (value.unit) {
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

        _.forEach(vm.trnCurtainQuotationObj.areaList, function (areaObj) {
          _.forEach(areaObj.unitList, function (value) {
            let fabricDataList = _.filter(results.trnCurtainQuotationItems, { 'unit': value.unit, 'area': value.area, 'categoryId': 1 });
            value.fabricList = fabricDataList;
            let accssoryDataList = _.filter(results.trnCurtainQuotationItems, { 'unit': value.unit, 'area': value.area, 'categoryId': 7, 'isTrack': false, 'isRod': false });
            value.accessoryList = accssoryDataList;
            let trackObj = _.find(results.trnCurtainQuotationItems, { "isTrack": true, unit: value.unit });
            if (trackObj) {
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
          });
        });

        let isRodObj = _.find(results.trnCurtainQuotationItems, { "isRod": true });
        if (isRodObj) {
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
    unitRow.mstPattern = _.find(this.patternList, ['id', unitRow.patternId]);
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
  }
  onChangeTrackAccesory(accessoryRow) {
    let shadeObj = _.find(this.trackCodeList, ['accessoryId', accessoryRow.trackAccessoryId]);
    accessoryRow.trackRate = shadeObj.sellingRate;
    accessoryRow.trackQuantity = accessoryRow.trackQuantity || 1;
    accessoryRow.trackAmount = Math.round(parseFloat(accessoryRow.trackQuantity) * parseFloat(accessoryRow.trackRate));

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
            // "serialno": "5",
            // "itemCode": null
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
            "isPatch": null,
            "isLining": null,
            "orderQuantity": accessoryobj.orderQuantity,
            "rate": accessoryobj.accessoriesDetails.sellingRate,
            "gst": accessoryobj.accessoriesDetails.gst,
            "amount": accessoryobj.amount,
            "amountWithGST": accessoryobj.amountWithGST,
            "discount": null,
            "categoryName": "Accessories",
            "collectionName": null,
            // "serialno": "5",
            // "itemCode": null
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
            "gst": unitObj.trackGST,
            "amount": unitObj.trackAmount,
            "amountWithGST": unitObj.trackAmountWithGST,
            "discount": null,
            "categoryName": "Accessories",
            "collectionName": null,
            // "serialno": "5",
            // "itemCode": null
          }
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
        // "itemCode": null
      }
      vm.trnCurtainQuotationObj.trnCurtainQuotationItems.push(obj);
    }

    if (valid) {
      this.saveTrnCurtainQuotation(this.trnCurtainQuotationObj);
    }
  }


  saveTrnCurtainQuotation(value) {
    let tempCurtainQuotationDate = new Date(value.curtainQuotationDate);
    value.curtainQuotationDate = new Date(tempCurtainQuotationDate.setHours(23));
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
