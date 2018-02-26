import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash/index';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { ConfirmationService, DataTableModule, LazyLoadEvent, SelectItem, TRISTATECHECKBOX_VALUE_ACCESSOR } from 'primeng/primeng';
import { GlobalErrorHandler } from '../../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../../_services/message.service';
import { TrnGoodReceiveNoteService } from '../../../../_services/trnGoodReceiveNote.service';
import { ScriptLoaderService } from '../../../../../../../_services/script-loader.service';
import { Helpers } from "../../../../../../../helpers";
import { TrnGoodReceiveNote } from "../../../../_models/trnGoodReceiveNote";
import { SupplierService } from '../../../../_services/supplier.service';
import { CommonService } from '../../../../_services/common.service';
import { CollectionService } from '../../../../_services/collection.service';
import { TrnProductStockService } from '../../../../_services/trnProductStock.service';
import { MatSizeService } from '../../../../_services/matSize.service';
@Component({
  selector: "app-trnGoodReceiveNote-add-edit",
  templateUrl: "./trnGoodReceiveNote-add-edit.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class TrnGoodReceiveNoteAddEditComponent implements OnInit {
  trnGoodReceiveNoteForm: any;
  params: number;
  trnGoodReceiveNoteList = [];
  pageSize = 50;
  page = 1;
  totalCount = 0;
  search = '';
  tableEmptyMesssage = 'Loading...';
  supplierCodeList = [];
  locationList = [];
  trnGoodReceiveNoteObj: TrnGoodReceiveNote;
  collectionList = [];
  categoriesCodeList = [];
  shadeIdList = [];
  categoryId = null;
  matThicknessId=null;
  collectionId = null;
  trnGoodReceiveNoteItems = [];
  shadeId = null;
  orderQuantity = null;
  orderType = null;
  locationObj = null;
  length = null;
  width = null;
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
  qualityIdError=false;
  courierList = [];
  courierModeList = [];
  matSizeList = [];
  fomSizeList = [];
  purchaseOrderList = [];
  purchaseItemList = [];
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
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private supplierService: SupplierService,
    private commonService: CommonService,
    private trnGoodReceiveNoteService: TrnGoodReceiveNoteService,
    private globalErrorHandler: GlobalErrorHandler,
    private confirmationService: ConfirmationService,
    private collectionService: CollectionService,
    private messageService: MessageService,
    private trnProductStockService: TrnProductStockService,
    private matSizeService: MatSizeService
  ) {
  }

  ngOnInit() {
    this.trnGoodReceiveNoteObj = new TrnGoodReceiveNote();
    this.getSupplierCodeList();
    this.getLocationList();
    this.getCategoryCodeList();
    this.getAccessoryLookup();
    let today = new Date();
    this.locationObj = {};
    this.disabled = false;
    this.courierModeList.push({ label: '--Select--', value: null });
    this.courierModeList.push({ label: 'Surface', value: 'Surface' });
    this.courierModeList.push({ label: 'Air', value: 'Air' });
    this.route.params.forEach((params: Params) => {
      this.params = params['id'];
    });
    if (this.params) {
      this.disabled = true;
      this.getTrnGoodReceiveNoteById(this.params);
    }
  }

  getTrnGoodReceiveNoteById(id) {
    Helpers.setLoading(true);
    this.trnGoodReceiveNoteService.getTrnGoodReceiveNoteById(id).subscribe(
      results => {
        this.trnGoodReceiveNoteObj = results;
        this.trnGoodReceiveNoteItems = results.trnGoodReceiveNoteItems;
        _.forEach(this.trnGoodReceiveNoteItems, function(value) {
         value.categoryName=value.mstCategory.code;
         value.collectionName=value.mstCollection.collectionCode;
         
        });
        delete this.trnGoodReceiveNoteObj['trnGoodReceiveNoteItems'];
        this.locationObj=results.mstCompanyLocation;
        Helpers.setLoading(false);
      },
      error => {
        this.globalErrorHandler.handleError(error);
        Helpers.setLoading(false);
      });
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

    if(!this.accessoryId && this.categoryId == 7)
      this.accessoryIdError = true;
    else
      this.accessoryIdError = false;

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
    this.trnGoodReceiveNoteItems.push(itemObj);
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
    if (this.categoryId == 1 || this.categoryId == 5 || this.categoryId == 6){
      if(this.shadeId){
        this.shadeIdError = false;
        parameterId = this.shadeId;
      }else{
        this.shadeIdError = true;
        parameterId = this.shadeId;
      }
    }
    else if (this.categoryId == 2){
      if(this.fomSizeId){
        this.fomSizeIdError = false;
        parameterId = this.fomSizeId;
      }else{
        this.fomSizeIdError = true;
        parameterId = this.fomSizeId;
      }
    }
    else if (this.categoryId == 4 && this.matSizeId != -1){
      if(this.matSizeId){
        this.matSizeIdError = false;
        parameterId = this.matSizeId;
      }else{
        this.matSizeIdError = true;
        parameterId = this.matSizeId;
      }
    }
    else if (this.categoryId == 4 && this.matSizeId != -1 && !this.qualityId){
      return;
    } 
    else if (this.categoryId == 7){
      if(this.accessoryId){
        this.accessoryIdError = false;
        parameterId = this.accessoryId;
      }else{
        this.accessoryIdError = true;
        parameterId = this.accessoryId;
      }
    }
    else {
      parameterId = null;
    }
    //this.shadeId ? this.shadeId : this.fomSizeId ? this.fomSizeId : this.matSizeId != -1 ? this.matSizeId : null;
    
    // this.trnProductStockService.getAllTrnProductStocks(this.categoryId, this.collectionId, parameterId, this.qualityId).subscribe(
    //   data => {
    //     this.productDetails = data;
    //   }, error => {
    //     this.globalErrorHandler.handleError(error);
    //   });

    this.trnGoodReceiveNoteService.getPOListForSelectedItem(this.categoryId, this.collectionId, parameterId, this.matSizeCode).subscribe(
      data => {
        this.purchaseItemList = data;
        console.log('this.purchaseItemList',this.purchaseItemList);
        this.purchaseOrderList.unshift({ label: '--Select--', value: null });
        // _.forEach(this.purchaseItemList, function(value) {
        //   if(!_.isUndefined(this.purchaseOrderList)){
        //     this.purchaseOrderList.push({ label: value.purchaseOrderNumber, value: value.purchaseOrderId });
        //   }
        // });
        console.log('this.purchaseOrderList', this.purchaseOrderList);
      }, error => {
        this.globalErrorHandler.handleError(error);
      });
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
      this.trnGoodReceiveNoteService.getTrnGoodReceiveNoteById(row).subscribe(
        data => {
          this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Record Added Successfully' });
          // this.getAllMerchants();

        }, error => {
          this.globalErrorHandler.handleError(error);
        });
    }
    else {
      this.trnGoodReceiveNoteService.updateTrnGoodReceiveNote(row).subscribe(
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
          this.trnGoodReceiveNoteItems.splice(index, 1);
          // this.trnGoodReceiveNoteService.deleteItem(id).subscribe(
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
      this.trnGoodReceiveNoteItems.splice(index, 1);
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

  calculateSizeCode() {
    if (this.width && this.length) {
      this.matSizeCode = this.length + 'x' + this.width;
    }
    else
      this.matSizeCode = '';
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
      if(this.collectionId){
        this.getshadeIdList();
      }else{
      this.shadeIdList = [];
      this.shadeIdList.unshift({ label: '--Select--', value: null });
      }
    }
    else if (this.categoryId == 2) {
      if(this.collectionId){
        this.getFoamSizeList();
      }else{
      this.fomSizeList = [];
      this.fomSizeList.unshift({ label: '--Select--', value: null });
      this.fomSizeId = null;
      }
    }
    else if (this.categoryId == 4) {
      if(this.collectionId){
        this.getMatSizeList();
        this.getMatQualityList();
      }
    }else{
      this.shadeIdList = [];
      this.shadeIdList.unshift({ label: '--Select--', value: null });
      this.matSizeList = [];
      this.matSizeList.unshift({ label: '--Select--', value: null });
      this.fomSizeList = [];
      this.fomSizeList.unshift({ label: '--Select--', value: null });
      this.shadeId = null;
      this.matSizeId = null;
      this.fomSizeId = null;
    }
  }

  getMatSizeList() {
    if(this.collectionId != null){
    this.trnGoodReceiveNoteService.getMatsizeTrnGoodReceiveNotes(this.collectionId).subscribe(
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
  }

  getFoamSizeList() {
    if(this.collectionId != null){
    this.trnGoodReceiveNoteService.getFoamSizeTrnGoodReceiveNotes(this.collectionId).subscribe(
      results => {
        this.fomSizeList = results;
        this.fomSizeList.unshift({ label: '--Select--', value: null });
      },
      error => {
        this.globalErrorHandler.handleError(error);
      });
    }
  }


  getshadeIdList() {
    if(this.collectionId != null){
      this.trnGoodReceiveNoteService.getshadeIdTrnGoodReceiveNotes(this.collectionId).subscribe(
      results => {
        this.shadeIdList = results;
        this.shadeIdList.unshift({ label: '--Select--', value: null });
      },
      error => {
        this.globalErrorHandler.handleError(error);
      });
    }
  }

  onChangeLocation() {
    if (this.trnGoodReceiveNoteObj.locationId) {
      this.commonService.getLocationById(this.trnGoodReceiveNoteObj.locationId).subscribe(
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
  getSupplierCodeList() {
    this.supplierService.getSupplierLookUp().subscribe(
      results => {
        this.supplierCodeList = results;
        this.supplierCodeList.unshift({ label: '--Select--', value: null });
      },
      error => {
        this.globalErrorHandler.handleError(error);
      });
  }
  onCancel() {
    this.router.navigate(['/features/purchase/trnGoodReceiveNote/list']);
    this.disabled = false;
  }

  onSubmit({ value, valid }: { value: any, valid: boolean }) {
    this.isFormSubmitted = true;
    this.trnGoodReceiveNoteObj.TrnGoodReceiveNoteItems = this.trnGoodReceiveNoteItems;
    if (valid) {
      let supplierObj = _.find(this.supplierCodeList, ['value', this.trnGoodReceiveNoteObj.supplierId]);
        this.trnGoodReceiveNoteObj.supplierName = supplierObj.label,
         this.saveTrnGoodReceiveNote(this.trnGoodReceiveNoteObj);
    }
  }


  saveTrnGoodReceiveNote(value) {
    Helpers.setLoading(true);
    if (this.params) {
      this.trnGoodReceiveNoteService.updateTrnGoodReceiveNote(value)
        .subscribe(
        results => {
          this.params = null;
          this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: results.message });
          Helpers.setLoading(false);
          this.router.navigate(['/features/purchase/trnGoodReceiveNote/list']);
        },
        error => {
          this.globalErrorHandler.handleError(error);
          Helpers.setLoading(false);
        });
    } else {
      this.trnGoodReceiveNoteService.createTrnGoodReceiveNote(value)
        .subscribe(
        results => {
          this.params = null;
          this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: results.message });
          Helpers.setLoading(false);
          this.router.navigate(['/features/purchase/trnGoodReceiveNote/list']);
        },
        error => {
          this.globalErrorHandler.handleError(error);
          Helpers.setLoading(false);
        });
    }
  }

}
