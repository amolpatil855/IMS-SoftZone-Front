import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash/index';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { ConfirmationService, DataTableModule, LazyLoadEvent, SelectItem } from 'primeng/primeng';
import { GlobalErrorHandler } from '../../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../../_services/message.service';
import { TrnWorkOrderService } from '../../../../_services/trnWorkOrder.service';
import { ScriptLoaderService } from '../../../../../../../_services/script-loader.service';
import { CommonService } from '../../../../_services/common.service';
import { Helpers } from "../../../../../../../helpers";
import { TrnWorkOrder } from "../../../../_models/trnWorkOrder";
import { UserService } from "../../../../_services/user.service";
@Component({
  selector: "app-trnWorkOrder-add-edit",
  templateUrl: "./trnWorkOrder-add-edit.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class TrnWorkOrderAddEditComponent implements OnInit {
  trnWorkOrderForm: any;
  customerForm: any;
  trnWorkOrderObj: any;
  params: number;
  userRole: string;
  viewItem: boolean = true;
  adminFlag: boolean = false;
  isCustomerSubmitted: boolean = false;
  trnWorkOrderList = [];
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
  trnWorkOrderItems = [];
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
  tailorCodeList = [];
  fabricTotal = 0;
  minAllowedDiscount = 0;
  accessoriesTotal = 0;
  stitchingTotal = 0;
  grandTotal = 0;
  grandTotalWithoutLabourCharges = 0;
  constructor(
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private trnWorkOrderService: TrnWorkOrderService,
    private globalErrorHandler: GlobalErrorHandler,
    private confirmationService: ConfirmationService,
    private commonService: CommonService,
    private messageService: MessageService) {
  }

  ngOnInit() {
    this.getLoggedInUserDetail();
    this.trnWorkOrderObj = new TrnWorkOrder();
    this.trnWorkOrderObj.customerId = null;
    this.trnWorkOrderObj.referById = null;
    let today = new Date();
    this.locationObj = {};
    this.disabled = false;
    this.trnWorkOrderObj.workOrderDate = today;
    this.trnWorkOrderObj.selectionType = null;
    this.route.params.forEach((params: Params) => {
      this.params = params['id'];
    });
    if (this.params) {
      this.disabled = true;
      this.getTrnWorkOrderById(this.params);
    }
    this.getTailorLookup();
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

  getTailorLookup() {
    Helpers.setLoading(true);
    this.commonService.getGetAllTailors().subscribe(
      results => {
        this.tailorCodeList = results;
        this.tailorCodeList.unshift({ name: '--Select--', id: null });
        Helpers.setLoading(false);
      },
      error => {
        this.globalErrorHandler.handleError(error);
        Helpers.setLoading(false);
      });
  }


  onChangeTailor() {
    let vm = this;
    let tailorObj = _.find(this.tailorCodeList, ['id', this.trnWorkOrderObj.tailorId]);
    if (tailorObj) {
      _.forEach(vm.trnWorkOrderObj.areaList, function (areaObj, areaIndex) {
        _.forEach(areaObj.unitList, function (value, unitIndex) {
          if (value.unit) {
            let patternCharges = _.find(tailorObj.mstTailorPatternChargeDetails, ['patternId', vm.trnWorkOrderObj.areaList[areaIndex].unitList[unitIndex].patternId]);
            vm.trnWorkOrderObj.areaList[areaIndex].unitList[unitIndex].labourCharges = Math.round(vm.trnWorkOrderObj.areaList[areaIndex].unitList[unitIndex].numberOfPanel * patternCharges.charge);
          }
        });
      });
    }
  }

  onApprove() {
    let vm = this;
    if (this.params) {
      if (this.trnWorkOrderObj.tailorId == null) {
        this.messageService.addMessage({ severity: 'error', summary: 'Error', detail: "Please select Tailor." });
        return false;
      }
      let vm = this;
    vm.trnWorkOrderObj.trnWorkOrderItems = [];
    // this.trnWorkOrderObj.TrnWorkOrderItems = this.trnWorkOrderItems;
    // let custObj = _.find(this.customerList, ['value', this.trnWorkOrderObj.customerId]);
    //this.trnWorkOrderObj.customerName = custObj ? custObj.label : '';

    _.forEach( this.trnWorkOrderObj.areaList, function (areaObj) {
      _.forEach(areaObj.unitList, function (unitObj) {
        _.forEach(unitObj.fabricList, function (fabricobj) {
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
            "labourCharges": unitObj.labourCharges,
            "discount": fabricobj.discount,
            "rate": fabricobj.rate,
            "rateWithGST": fabricobj.rateWithGST,
            "amount": fabricobj.amount,
            "amountWithGST": fabricobj.amountWithGST,
            "categoryName": 'Fabric',
            "collectionName": collectionObj ? collectionObj.label : '',
            // "serialno": "5",
            // "itemCode": null
          }
          vm.trnWorkOrderObj.trnWorkOrderItems.push(obj);
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
            "amount": accessoryobj.amount,
            "amountWithGST": accessoryobj.amountWithGST,
            "discount": null,
            "categoryName": "Accessories",
            "collectionName": null,
            // "serialno": "5",
            // "itemCode": null
          }
          vm.trnWorkOrderObj.trnWorkOrderItems.push(obj);
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
            "unitHeight": unitObj.unitHeight,
            "unitWidth": unitObj.unitWidth,
            "numberOfPanel": unitObj.numberOfPanel,
            "amountWithGST": unitObj.trackAmountWithGST,
            "discount": null,
            "categoryName": "Accessories",
            "collectionName": null,
            // "serialno": "5",
            // "itemCode": null
          }
          if (obj)
            vm.trnWorkOrderObj.trnWorkOrderItems.push(obj);
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
            "gst": unitObj.motorGST,
            "amount": unitObj.motorAmount,
            "amountWithGST": unitObj.motorAmountWithGST,
            "discount": null,
            "categoryName": "Accessories",
            "collectionName": null,
            // "serialno": "5",
            // "itemCode": null
          }
          if (obj)
            vm.trnWorkOrderObj.trnWorkOrderItems.push(obj);
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
            "gst": unitObj.remoteGST,
            "amount": unitObj.remoteAmount,
            "amountWithGST": unitObj.remoteAmountWithGST,
            "discount": null,
            "categoryName": "Accessories",
            "collectionName": null,
            // "serialno": "5",
            // "itemCode": null
          }
          if (obj)
            vm.trnWorkOrderObj.trnWorkOrderItems.push(obj);
        }

      });
    });

    if (vm.trnWorkOrderObj.isRod) {
      let obj = {
        "categoryId": 7,
        "collectionId": null,
        "shadeId": null,
        "accessoryId": vm.trnWorkOrderObj.rodAccessoryId,
        "isRod": true,
        'id': vm.trnWorkOrderObj.rodId,
        "orderQuantity": vm.trnWorkOrderObj.rodQuantity,
        "rate": vm.trnWorkOrderObj.rodRate,
        "gst": vm.trnWorkOrderObj.rodGST,
        "amount": vm.trnWorkOrderObj.rodAmount,
        "amountWithGST": vm.trnWorkOrderObj.rodAmountWithGST,
        "discount": null,
        "categoryName": "Accessories",
        "collectionName": null,
        // "serialno": "5",
        // "itemCode": null
      }
      vm.trnWorkOrderObj.trnWorkOrderItems.push(obj);


      if (vm.trnWorkOrderObj.isRodAccessory) {
        let obj = {
          "categoryId": 7,
          "collectionId": null,
          "shadeId": null,
          "accessoryId": vm.trnWorkOrderObj.rodItemAccessoryId,
          "isRodAccessory": true,
          'id': vm.trnWorkOrderObj.rodAccessoryRecordId,
          "orderQuantity": vm.trnWorkOrderObj.rodItemAccessoryQuantity,
          "rate": vm.trnWorkOrderObj.rodItemAccessoryRate,
          "gst": vm.trnWorkOrderObj.rodItemAccessoryGST,
          "amount": vm.trnWorkOrderObj.rodItemAccessoryAmount,
          "amountWithGST": vm.trnWorkOrderObj.rodItemAccessoryAmountWithGST,
          "discount": null,
          "categoryName": "Accessories",
          "collectionName": null,
          // "serialno": "5",
          // "itemCode": null
        }
        vm.trnWorkOrderObj.trnWorkOrderItems.push(obj);
      }

    }
      Helpers.setLoading(true);
      this.trnWorkOrderService.updateTrnWorkOrder(vm.trnWorkOrderObj)
        .subscribe(
        results => {
          this.approveWorkOrder();
          Helpers.setLoading(false);
        },
        error => {
          this.globalErrorHandler.handleError(error);
          Helpers.setLoading(false);
        });
    }

  }

  approveWorkOrder() {
    this.trnWorkOrderService.approveWorkOrder(this.trnWorkOrderObj)
      .subscribe(
      results => {
        this.messageService.addMessage({ severity: results.type.toLowerCase(), summary: results.type, detail: results.message });
        if (results.type == 'Success') {
          this.params = null;
          this.viewItem = false;
          this.trnWorkOrderObj.status = 'Approved';
        }
        Helpers.setLoading(false);
      },
      error => {
        this.globalErrorHandler.handleError(error);
        Helpers.setLoading(false);
      });
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

  onUpdateAndCreateQuotation() {
    if (this.trnWorkOrderObj.isQuotationCreated) {
      if (this.trnWorkOrderObj.id != null) {
        Helpers.setLoading(true);
        this.trnWorkOrderService.getTrnWorkOrderById(this.trnWorkOrderObj.id).subscribe(
          result => {
            this.router.navigate(['/features/sales/trnWorkOrder/edit', result], { queryParams: { WorkOrderId: result } });
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
        this.trnWorkOrderObj.trnWorkOrderItems = this.trnWorkOrderItems;
        this.trnWorkOrderService.updateTrnWorkOrder(this.trnWorkOrderObj)
          .subscribe(
          results => {
            this.params = null;
            this.messageService.addMessage({ severity: results.type.toLowerCase(), summary: results.type, detail: results.message });
            Helpers.setLoading(false);
            this.router.navigate(['/features/sales/trnWorkOrder/add'], { queryParams: { WorkOrderId: this.trnWorkOrderObj.id } });
          },
          error => {
            this.globalErrorHandler.handleError(error);
            Helpers.setLoading(false);
          });
      }
    }
  }

  getTrnWorkOrderById(id) {
    Helpers.setLoading(true);
    this.trnWorkOrderService.getTrnWorkOrderById(id).subscribe(
      results => {
        let vm = this;
        this.trnWorkOrderObj = results;
        if (this.trnWorkOrderObj.status == "Created") {
          this.viewItem = true;
        } else {
          this.viewItem = false;
        }
        this.trnWorkOrderObj.workOrderDate = new Date(this.trnWorkOrderObj.workOrderDate);
        this.customerShippingAddress = this.trnWorkOrderObj.mstCustomer.mstCustomerAddresses[0];
        this.trnWorkOrderItems = results.trnWorkOrderItems;

        let areaObjList = _.uniqBy(results.trnWorkOrderItems, 'area');
        vm.trnWorkOrderObj.areaList = [];
        _.forEach(areaObjList, function (value) {
          if (value.area) {
            vm.trnWorkOrderObj.areaList.push({
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
        _.forEach(vm.trnWorkOrderObj.areaList, function (areaObj) {

          areaObj.unitList = [];
          let repetedUnit = _.filter(results.trnWorkOrderItems, { 'area': areaObj.area });

          let unitObjList = _.uniqBy(repetedUnit, 'unit');

          _.forEach(unitObjList, function (value) {
            if (value.unit) {
              vm.stitchingTotal = vm.stitchingTotal + value.labourCharges;
              areaObj.unitList.push({
                unit: value.unit,
                area: value.area,
                patternId: value.patternId,
                unitHeight: value.unitHeight,
                unitWidth: value.unitWidth,
                labourCharges: value.labourCharges,
                numberOfPanel: value.numberOfPanel,
                mstPattern: value.mstPattern,
                contRoleId: Math.floor(Math.random() * 2000),
              });

            }
          });

          // _.forEach(results.trnWorkOrderItems, function (value) {
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
        let trackAccessoryAmount = 0;
        let motorAccessoryAmount = 0;
        let rodAccessoryAmount = 0;
        let remoteAccessoryAmount = 0;
        _.forEach(vm.trnWorkOrderObj.areaList, function (areaObj) {
          _.forEach(areaObj.unitList, function (value) {
            let fabricDataList = _.filter(results.trnWorkOrderItems, { 'unit': value.unit, 'area': value.area, 'categoryId': 1 });
            _.forEach(fabricDataList, function (temp) {
              temp.contRoleId = Math.floor(Math.random() * 2000)
            });
            value.fabricList = fabricDataList;
            let accssoryDataList = _.filter(results.trnWorkOrderItems, { 'unit': value.unit, 'area': value.area, 'categoryId': 7, 'isTrack': false, 'isRod': false, 'isRemote': false, 'isMotor': false });
            _.forEach(accssoryDataList, function (temp) {
              temp.contRoleId = Math.floor(Math.random() * 2000)
            });
            value.accessoryList = accssoryDataList;
            _.forEach(value.fabricList, function (fabricObj) {
              vm.fabricTotal = vm.fabricTotal + fabricObj.amountWithGST;
            });

            let trackObj = _.find(results.trnWorkOrderItems, { "isTrack": true, unit: value.unit });
            if (trackObj) {
              trackAccessoryAmount = trackAccessoryAmount + trackObj.amountWithGST;
              value.trackAccessoriesDetails = trackObj.mstAccessory;
              value.trackId = trackObj.id;
              value.trackGST = trackObj.gst;
              value.trackAccessoryId = trackObj.accessoryId;
              value.isTrack = true;
              value.trackAmount = trackObj.amount;
              value.trackAmountWithGST = trackObj.amountWithGST;
              value.trackRate = trackObj.rate;
              value.trackQuantity = trackObj.orderQuantity;
            }

            let motorObj = _.find(results.trnWorkOrderItems, { "isMotor": true, unit: value.unit });
            if (motorObj) {
              motorAccessoryAmount = motorAccessoryAmount + motorObj.amountWithGST;
              value.motorAccessoriesDetails = motorObj.mstAccessory;
              value.motorId = motorObj.id;
              value.motorGST = motorObj.gst;
              value.motorAccessoryId = motorObj.accessoryId;
              value.isMotor = true;
              value.motorAmount = motorObj.amount;
              value.motorAmountWithGST = motorObj.amountWithGST;
              value.motorRate = motorObj.rate;
              value.motorQuantity = motorObj.orderQuantity;
            }

            let remoteObj = _.find(results.trnWorkOrderItems, { "isRemote": true, unit: value.unit });
            if (motorObj) {
              if(remoteObj != null){
                remoteAccessoryAmount = remoteAccessoryAmount + remoteObj.amountWithGST;
                value.remoteAccessoriesDetails = remoteObj.mstAccessory;
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

        let isRodObj = _.find(results.trnWorkOrderItems, { "isRod": true });
        if (isRodObj) {
          rodAccessoryAmount = rodAccessoryAmount + isRodObj.amountWithGST;
          vm.trnWorkOrderObj.rodAccessoriesDetails = isRodObj.mstAccessory;
          vm.trnWorkOrderObj.rodId = isRodObj.id;
          vm.trnWorkOrderObj.rodGST = isRodObj.gst;
          vm.trnWorkOrderObj.rodAccessoryId = isRodObj.accessoryId;
          vm.trnWorkOrderObj.isRod = true;
          vm.trnWorkOrderObj.rodAmount = isRodObj.amount;
          vm.trnWorkOrderObj.rodAmountWithGST = isRodObj.amountWithGST;
          vm.trnWorkOrderObj.rodQuantity = isRodObj.orderQuantity;
          vm.trnWorkOrderObj.rodRate = isRodObj.rate;
        }


        let isRodAccessoryObj = _.find(results.trnWorkOrderItems, { "isRodAccessory": true });
        if (isRodAccessoryObj) {
          rodAccessoryAmount = rodAccessoryAmount + isRodAccessoryObj.amountWithGST;
          vm.trnWorkOrderObj.rodItemAccessoryDetails = isRodAccessoryObj.mstAccessory;
          vm.trnWorkOrderObj.rodAccessoryRecordId = isRodAccessoryObj.id;
          vm.trnWorkOrderObj.rodItemAccessoryGST = isRodAccessoryObj.gst;
          vm.trnWorkOrderObj.rodItemAccessoryId = isRodAccessoryObj.accessoryId;
          vm.trnWorkOrderObj.isRodAccessory = true;
          vm.trnWorkOrderObj.rodItemAccessoryAmount = isRodAccessoryObj.amount;
          vm.trnWorkOrderObj.rodItemAccessoryAmountWithGST = isRodAccessoryObj.amountWithGST;
          vm.trnWorkOrderObj.rodItemAccessoryQuantity = isRodAccessoryObj.orderQuantity;
          vm.trnWorkOrderObj.rodItemAccessoryRate = isRodAccessoryObj.rate;
        }

        vm.accessoriesTotal = vm.accessoriesTotal + trackAccessoryAmount + rodAccessoryAmount + motorAccessoryAmount + remoteAccessoryAmount;

        vm.grandTotal = vm.grandTotal + vm.fabricTotal + vm.accessoriesTotal + vm.stitchingTotal;
        vm.grandTotalWithoutLabourCharges = Math.round((vm.grandTotal - vm.stitchingTotal) * 0.8);
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
    vm.trnWorkOrderObj.trnWorkOrderItems = [];
    // this.trnWorkOrderObj.TrnWorkOrderItems = this.trnWorkOrderItems;
    // let custObj = _.find(this.customerList, ['value', this.trnWorkOrderObj.customerId]);
    //this.trnWorkOrderObj.customerName = custObj ? custObj.label : '';

    _.forEach( this.trnWorkOrderObj.areaList, function (areaObj) {
      _.forEach(areaObj.unitList, function (unitObj) {
        _.forEach(unitObj.fabricList, function (fabricobj) {
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
            "labourCharges": unitObj.labourCharges,
            "discount": fabricobj.discount,
            "rate": fabricobj.rate,
            "rateWithGST": fabricobj.rateWithGST,
            "amount": fabricobj.amount,
            "amountWithGST": fabricobj.amountWithGST,
            "categoryName": 'Fabric',
            "collectionName": collectionObj ? collectionObj.label : '',
            // "serialno": "5",
            // "itemCode": null
          }
          vm.trnWorkOrderObj.trnWorkOrderItems.push(obj);
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
            "amount": accessoryobj.amount,
            "amountWithGST": accessoryobj.amountWithGST,
            "discount": null,
            "categoryName": "Accessories",
            "collectionName": null,
            // "serialno": "5",
            // "itemCode": null
          }
          vm.trnWorkOrderObj.trnWorkOrderItems.push(obj);
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
            "unitHeight": unitObj.unitHeight,
            "unitWidth": unitObj.unitWidth,
            "numberOfPanel": unitObj.numberOfPanel,
            "amountWithGST": unitObj.trackAmountWithGST,
            "discount": null,
            "categoryName": "Accessories",
            "collectionName": null,
            // "serialno": "5",
            // "itemCode": null
          }
          if (obj)
            vm.trnWorkOrderObj.trnWorkOrderItems.push(obj);
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
            "gst": unitObj.motorGST,
            "amount": unitObj.motorAmount,
            "amountWithGST": unitObj.motorAmountWithGST,
            "discount": null,
            "categoryName": "Accessories",
            "collectionName": null,
            // "serialno": "5",
            // "itemCode": null
          }
          if (obj)
            vm.trnWorkOrderObj.trnWorkOrderItems.push(obj);
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
            "gst": unitObj.remoteGST,
            "amount": unitObj.remoteAmount,
            "amountWithGST": unitObj.remoteAmountWithGST,
            "discount": null,
            "categoryName": "Accessories",
            "collectionName": null,
            // "serialno": "5",
            // "itemCode": null
          }
          if (obj)
            vm.trnWorkOrderObj.trnWorkOrderItems.push(obj);
        }

      });
    });

    if (vm.trnWorkOrderObj.isRod) {
      let obj = {
        "categoryId": 7,
        "collectionId": null,
        "shadeId": null,
        "accessoryId": vm.trnWorkOrderObj.rodAccessoryId,
        "isRod": true,
        'id': vm.trnWorkOrderObj.rodId,
        "orderQuantity": vm.trnWorkOrderObj.rodQuantity,
        "rate": vm.trnWorkOrderObj.rodRate,
        "gst": vm.trnWorkOrderObj.rodGST,
        "amount": vm.trnWorkOrderObj.rodAmount,
        "amountWithGST": vm.trnWorkOrderObj.rodAmountWithGST,
        "discount": null,
        "categoryName": "Accessories",
        "collectionName": null,
        // "serialno": "5",
        // "itemCode": null
      }
      vm.trnWorkOrderObj.trnWorkOrderItems.push(obj);


      if (vm.trnWorkOrderObj.isRodAccessory) {
        let obj = {
          "categoryId": 7,
          "collectionId": null,
          "shadeId": null,
          "accessoryId": vm.trnWorkOrderObj.rodItemAccessoryId,
          "isRodAccessory": true,
          'id': vm.trnWorkOrderObj.rodAccessoryRecordId,
          "orderQuantity": vm.trnWorkOrderObj.rodItemAccessoryQuantity,
          "rate": vm.trnWorkOrderObj.rodItemAccessoryRate,
          "gst": vm.trnWorkOrderObj.rodItemAccessoryGST,
          "amount": vm.trnWorkOrderObj.rodItemAccessoryAmount,
          "amountWithGST": vm.trnWorkOrderObj.rodItemAccessoryAmountWithGST,
          "discount": null,
          "categoryName": "Accessories",
          "collectionName": null,
          // "serialno": "5",
          // "itemCode": null
        }
        vm.trnWorkOrderObj.trnWorkOrderItems.push(obj);
      }

    }

    if (valid) {
      this.saveTrnWorkOrder(this.trnWorkOrderObj);
    }
  }


  saveTrnWorkOrder(value) {
    let tempworkOrderDate = new Date(value.workOrderDate);
    value.workOrderDate = new Date(tempworkOrderDate.setHours(23));
    Helpers.setLoading(true);
    if (this.params) {
      this.trnWorkOrderService.updateTrnWorkOrder(value)
        .subscribe(
        results => {
          this.params = null;
          this.messageService.addMessage({ severity: results.type.toLowerCase(), summary: results.type, detail: results.message });
          Helpers.setLoading(false);
          this.router.navigate(['/features/sales/trnWorkOrder/list']);
        },
        error => {
          this.globalErrorHandler.handleError(error);
          Helpers.setLoading(false);
        });
    } else {
      this.trnWorkOrderService.createTrnWorkOrder(value)
        .subscribe(
        results => {
          this.params = null;
          this.messageService.addMessage({ severity: results.type.toLowerCase(), summary: results.type, detail: results.message });
          Helpers.setLoading(false);
          this.router.navigate(['/features/sales/trnWorkOrder/list']);
        },
        error => {
          this.globalErrorHandler.handleError(error);
          Helpers.setLoading(false);
        });
    }
  }

  onCancel() {
    this.router.navigate(['/features/sales/trnWorkOrder/list']);
    this.disabled = false;
    this.viewItem = true;
  }
}
