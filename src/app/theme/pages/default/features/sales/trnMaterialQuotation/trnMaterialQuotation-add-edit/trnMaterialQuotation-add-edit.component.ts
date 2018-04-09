import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash/index';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { ConfirmationService, DataTableModule, LazyLoadEvent, SelectItem } from 'primeng/primeng';
import { GlobalErrorHandler } from '../../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../../_services/message.service';
import { UserService } from "../../../../_services/user.service";
import { TrnMaterialQuotationService } from '../../../../_services/trnMaterialQuotation.service';
import { TrnMaterialSelectionService } from '../../../../_services/trnMaterialSelection.service';
import { ShadeService } from '../../../../_services/shade.service';
import { FomSizeService } from '../../../../_services/fomSize.service';
import { MatSizeService } from '../../../../_services/matSize.service';
import { ScriptLoaderService } from '../../../../../../../_services/script-loader.service';
import { CommonService } from '../../../../_services/common.service';
import { Helpers } from "../../../../../../../helpers";
import { TrnMaterialQuotation } from "../../../../_models/trnMaterialQuotation";
import { TrnProductStockService } from '../../../../_services/trnProductStock.service';
import { CollectionService } from '../../../../_services/collection.service';
import { CustomerService } from "../../../../_services/customer.service";

import { CompanyService } from '../../../../../../pages/default/_services/company.service';
@Component({
  selector: "app-trnMaterialQuotation-add-edit",
  templateUrl: "./trnMaterialQuotation-add-edit.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class TrnMaterialQuotationAddEditComponent implements OnInit {
  materialSelectionId: number;
  materialQuotationId: number;
  trnMaterialQuotationForm: any;
  trnMaterialQuotationObj: any;
  userRole: string;
  tableEmptyMesssage = 'Loading...';
  params: number;
  adminFlag: boolean = false;
  status: boolean = true;
  viewItem: boolean = true;
  trnMaterialQuotationList = [];
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
  trnMaterialQuotationItems = [];
  shadeId = null;
  orderQuantity = null;
  orderType = null;
  locationObj = null;
  matHeight = null;
  matWidth = null;
  selectedAddress: any;
  matSizeCode = null;
  selectionType = null;
  area = null;
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
  customerShippingAddress: any;
  numberToWordsVal: string;
  hidePrint: boolean;
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
  selectedRadio: boolean;
  display: boolean = false;
  shadeEnable: boolean = false;
  matEnable: boolean = false;
  fomEnable: boolean = false;
  isMatSelectionId: boolean = false;
  customerList = [];
  mstCompanyInfo: any;
  constructor(
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private trnMaterialQuotationService: TrnMaterialQuotationService,
    private trnMaterialSelectionService: TrnMaterialSelectionService,
    private shadeService: ShadeService,
    private fomSizeService: FomSizeService,
    private collectionService: CollectionService,
    private customerService: CustomerService,
    private matSizeService: MatSizeService,
    private companyService: CompanyService,
    private globalErrorHandler: GlobalErrorHandler,
    private confirmationService: ConfirmationService,
    private commonService: CommonService,
    private trnProductStockService: TrnProductStockService,
    private messageService: MessageService) {
  }

  ngOnInit() {
    this.hidePrint = true;
    this.route.queryParams
      .subscribe(params => {
        this.materialSelectionId = params.materialSelectionId;
        this.materialQuotationId = params.materialQuotationId;
        if (this.materialSelectionId) {
          this.isMatSelectionId = true;
          this.trnMaterialSelectionService.getMaterialQuotationBySelectionId(this.materialSelectionId).subscribe(
            results => {
              this.trnMaterialQuotationObj = results;
              this.trnMaterialQuotationObj.materialQuotationDate = new Date();
              this.trnMaterialQuotationItems = this.trnMaterialQuotationObj.trnMaterialQuotationItems;
              if (this.trnMaterialQuotationItems.length == 0)
                this.tableEmptyMesssage = "Records Not Available";
              Helpers.setLoading(false);
            },
            error => {
              this.globalErrorHandler.handleError(error);
              Helpers.setLoading(false);
            });
        } else {
          this.isMatSelectionId = false;
          this.materialSelectionId = null;
        }
      });

    this.trnMaterialQuotationObj = new TrnMaterialQuotation();
    this.getLoggedInUserDetail();
    this.getCategoryCodeList();
    this.getAgentLookUp();
    this.getCustomerLookUpWithoutWholesaleCustomer();
    //let today = new Date();
    this.getAllCompanyInfo();
    this.locationObj = {};
    this.disabled = false;
    this.trnMaterialQuotationObj.customerId = null;
    this.trnMaterialQuotationObj.referById = null;
    //this.trnMaterialQuotationObj.materialQuotationDate = today;

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
      this.getTrnMaterialQuotationById(this.params);
    }
  }

  getAllCompanyInfo() {
    this.companyService.getAllCompanyInfo().subscribe(
      (results: any) => {
        this.mstCompanyInfo = results;
      });
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
    if (this.params) {
      let qoObj = _.find(this.trnMaterialQuotationItems, ['orderQuantity', 0]);
      if (qoObj) {
        this.messageService.addMessage({ severity: 'error', summary: 'Error', detail: "Order quantity must be greater than zero." });
        return false;
      }

      if (this.params) {
        this.trnMaterialQuotationObj.trnMaterialQuotationItems = this.trnMaterialQuotationItems;
        Helpers.setLoading(true);
        this.trnMaterialQuotationService.updateTrnMaterialQuotation(this.trnMaterialQuotationObj)
          .subscribe(
          results => {
            this.approveMaterialQuotation();
            Helpers.setLoading(false);
          },
          error => {
            this.globalErrorHandler.handleError(error);
            Helpers.setLoading(false);
          });
      }
    }
  }

  approveMaterialQuotation() {
    this.trnMaterialQuotationService.approveMaterialQuotation(this.trnMaterialQuotationObj)
      .subscribe(
      results => {
        this.messageService.addMessage({ severity: results.type.toLowerCase(), summary: results.type, detail: results.message });
        if (results.type == 'Success') {
          this.params = null;
          this.status = false;
          this.viewItem = false;
          this.trnMaterialQuotationObj.status = 'Approved';
        }
        Helpers.setLoading(false);
      },
      error => {
        this.globalErrorHandler.handleError(error);
        Helpers.setLoading(false);
      });
  }

  onCancelMQ() {
    if (this.params) {
      Helpers.setLoading(true);
      this.trnMaterialQuotationService.cancelMaterialQuotation(this.trnMaterialQuotationObj)
        .subscribe(
        results => {
          this.params = null;
          this.status = false;
          this.viewItem = false;
          this.messageService.addMessage({ severity: results.type.toLowerCase(), summary: results.type, detail: results.message });
          this.router.navigate(['/features/sales/trnMaterialQuotation/list']);
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

  print(): void {
    let printContents, popupWin;
    printContents = document.getElementById('printInvoice').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.title = "Special File Name.pdf";
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

  getCustomerLookUpWithoutWholesaleCustomer() {
    Helpers.setLoading(true);
    this.trnMaterialQuotationService.getCustomerLookUpWithoutWholesaleCustomer().subscribe(
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
    this.selectionTypeError = false;
    this.areaError = false;
    this.area = null;
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
    this.productDetails.stock = null;
    this.orderQuantity = null;
    this.rateWithGST = null;
    this.rate = null;
    this.matHeight = null;
    this.matHeightError = false;
    this.matWidth = null;
    this.matWidthError = false;
    this.matThicknessId = null;
    this.matThicknessIdError = false;
    this.givenDiscount = null;
    this.givenDiscountError = false;
    this.amount = null,
      this.orderType = '';
    this.amountWithGST = null;

    if (this.selectionType != null) {
      Helpers.setLoading(true);
      this.trnMaterialQuotationService.getCategoryLookupBySelectionType(this.selectionType).subscribe(
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

  getTrnMaterialQuotationById(id) {
    Helpers.setLoading(true);
    this.trnMaterialQuotationService.getTrnMaterialQuotationById(id).subscribe(
      results => {

        this.trnMaterialQuotationObj = results;
        if (this.trnMaterialQuotationObj.status == "Created") {
          this.status = true;
          this.viewItem = true;
        } else {
          this.status = false;
          this.viewItem = false;
        }
        this.trnMaterialQuotationObj.materialQuotationDate = new Date(this.trnMaterialQuotationObj.materialQuotationDate);
        this.customerShippingAddress = this.trnMaterialQuotationObj.mstCustomer.mstCustomerAddresses[0];
        this.trnMaterialQuotationItems = results.trnMaterialQuotationItems;
        this.addressList = results.mstCustomer.mstCustomerAddresses;
        //delete this.trnMaterialQuotationObj['trnMaterialQuotationItems'];
        Helpers.setLoading(false);
        this.hidePrint = false;
        this.numberToWordsVal = this.numberToWords(this.trnMaterialQuotationObj.totalAmount, ",");
      },
      error => {
        this.globalErrorHandler.handleError(error);
        Helpers.setLoading(false);
      });
  }

  numberToWords(n, custom_join_character) {
    if (!n)
      n = 0;
    var string = n.toString(),
      units, tens, scales, start, end, chunks, chunksLen, chunk, ints, i, word, words;

    var and = custom_join_character || 'and';

    /* Is number zero? */
    if (parseInt(string) === 0) {
      return 'Zero';
    }

    /* Array of units as words */
    units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

    /* Array of tens as words */
    tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    /* Array of scales as words */
    scales = ['', 'Thousand', 'Million', 'Billion', 'Trillion', 'Quadrillion', 'Quintillion', 'Sextillion', 'Septillion', 'Octillion', 'Nonillion', 'Decillion', 'undecillion', 'duodecillion', 'tredecillion', 'quatttuor-decillion', 'quindecillion', 'sexdecillion', 'septen-decillion', 'octodecillion', 'novemdecillion', 'vigintillion', 'centillion'];

    /* Split user arguemnt into 3 digit chunks from right to left */
    start = string.length;
    chunks = [];
    while (start > 0) {
      end = start;
      chunks.push(string.slice((start = Math.max(0, start - 3)), end));
    }

    /* Check if function has enough scale words to be able to stringify the user argument */
    chunksLen = chunks.length;
    if (chunksLen > scales.length) {
      return '';
    }

    /* Stringify each integer in each chunk */
    words = [];
    for (i = 0; i < chunksLen; i++) {

      chunk = parseInt(chunks[i]);

      if (chunk) {

        /* Split chunk into array of individual integers */
        ints = chunks[i].split('').reverse().map(parseFloat);

        /* If tens integer is 1, i.e. 10, then add 10 to units integer */
        if (ints[1] === 1) {
          ints[0] += 10;
        }

        /* Add scale word if chunk is not zero and array item exists */
        if ((word = scales[i])) {
          words.push(word);
        }

        /* Add unit word if array item exists */
        if ((word = units[ints[0]])) {
          words.push(word);
        }

        /* Add tens word if array item exists */
        if ((word = tens[ints[1]])) {
          words.push(word);
        }

        /* Add 'and' string after units or tens integer if: */
        if (ints[0] || ints[1]) {

          /* Chunk has a hundreds integer or chunk is the first of multiple chunks */
          if (ints[2] || !i && chunksLen) {
            if (n > 100)
              words.push(and);
          }

        }

        /* Add hundreds word if array item exists */
        if ((word = units[ints[2]])) {
          words.push(word + ' Hundred');
        }

      }

    }

    return words.reverse().join(' ');

  }



  showDialog() {
    this.display = true;
  }

  addItemToList() {
    if (!this.selectionType)
      this.selectionTypeError = true;
    else
      this.selectionTypeError = false;

    if (!this.area)
      this.areaError = true;
    else
      this.areaError = false;

    if (!this.categoryId)
      this.categoryIdError = true;
    else
      this.categoryIdError = false;


    if (!this.givenDiscount && this.categoryId != 7)
      this.givenDiscountError = true;
    else
      this.givenDiscountError = false;

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

    if (!this.orderQuantity)
      this.orderQuantityError = true;
    else
      this.orderQuantityError = false;
    if (this.orderQuantityError || this.matWidthError || this.fomSizeIdError || this.matSizeIdError || this.qualityIdError || this.accessoryIdError
      || this.matHeightError || this.shadeIdError || this.collectionIdError || this.categoryIdError || this.selectionTypeError || this.areaError || this.givenDiscountError) {
      return false;
    }

    if (this.trnMaterialQuotationItems.length > 0) {

      let soObj = _.find(this.trnMaterialQuotationItems, ['categoryId', this.categoryId]);
      if (soObj != null) {
        if (this.accessoryId == soObj.accessoryId && this.shadeId == soObj.shadeId && this.fomSizeId == soObj.fomSizeId && this.matSizeId == soObj.matSizeId) {
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

    if (matSizeObj && matSizeObj.value == -1) {
      matSizeObj.label = this.matSizeCode;
    }

    if (this.trnMaterialQuotationObj.totalAmount == null) {
      this.trnMaterialQuotationObj.totalAmount = 0;
    }
    this.trnMaterialQuotationObj.totalAmount = Math.round(parseFloat(this.trnMaterialQuotationObj.totalAmount) + parseFloat(this.amountWithGST));

    let itemObj = {
      selectionType: this.selectionType,
      area: this.area,
      categoryId: this.categoryId,
      categoryName: catObj ? catObj.label != "--Select--" ? catObj.label : '' : '',
      collectionName: collObj ? collObj.label != "--Select--" ? collObj.label : '' : '',
      collectionId: this.collectionId,
      serialno: this.shadeId ? shadeObj.label != "--Select--" ? shadeObj.label : '' : '',
      size: this.fomSizeId ? fomSizeObj.label : this.matSizeId ? matSizeObj.label != "--Select--" ? matSizeObj.label : '' : '',
      accessoryName: accessoryObj ? accessoryObj.label != "--Select--" ? accessoryObj.label : '' : '',
      accessoryId: this.accessoryId,
      shadeId: this.shadeId,
      fomSizeId: this.fomSizeId,
      matSizeId: this.matSizeId,
      availableStock: this.productDetails.stock,
      orderQuantity: this.orderQuantity,
      rateWithGST: this.rateWithGST,
      rate: this.rate,
      gst: this.productDetails.gst,
      discountPercentage: this.givenDiscount,
      amount: this.amount,
      amountWithGST: this.amountWithGST,
      orderType: this.orderType,
      matHeight: this.matHeight,
      matWidth: this.matWidth,
    };

    this.trnMaterialQuotationItems.push(itemObj);
    this.onCancelItemDetails();
  }

  onCancelItemDetails() {
    this.selectionTypeError = false;
    this.areaError = false;
    this.categoryIdError = false;
    this.collectionIdError = false;
    this.accessoryIdError = false;
    this.shadeIdError = false;
    this.matHeightError = false;
    this.matWidthError = false;
    this.orderQuantityError = false;
    this.givenDiscountError = false;
    this.selectionType = null;
    this.area = null;
    this.categoryId = null;
    this.collectionId = null;
    this.accessoryId = null;
    this.shadeId = null;
    this.fomSizeId = null;
    this.matSizeId = null;
    this.matHeightError = null;
    this.matWidthError = null;
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

  calculateProductStockDetails() {
    let parameterId = null;
    if (this.categoryId == 1 || this.categoryId == 5 || this.categoryId == 6) {
      this.shadeIdError = false;
      this.productDetails.stock = null;
      this.orderQuantity = null;
      this.orderQuantityError = false;
      this.rateWithGST = null;
      this.rate = null;
      this.matHeight = null;
      this.matHeightError = false;
      this.matWidth = null;
      this.matWidthError = false;
      this.matThicknessId = null;
      this.matThicknessIdError = false;
      this.givenDiscount = null;
      this.givenDiscountError = false;
      this.orderType = '';
      this.amountWithGST = null;
      if (this.shadeId != null) {
        parameterId = this.shadeId;
        this.trnProductStockService.getAllTrnProductStocks(this.categoryId, this.collectionId, parameterId, this.qualityId, null, null).subscribe(
          data => {
            this.productDetails = data;
          }, error => {
            this.globalErrorHandler.handleError(error);
          });
      }
    }
    else if (this.categoryId == 2) {
      this.fomSizeIdError = false;
      this.productDetails.stock = null;
      this.orderQuantity = null;
      this.orderQuantityError = false;
      this.rateWithGST = null;
      this.rate = null;
      this.matHeight = null;
      this.matHeightError = false;
      this.matWidth = null;
      this.matWidthError = false;
      this.matThicknessId = null;
      this.matThicknessIdError = false;
      this.givenDiscount = null;
      this.givenDiscountError = false;
      this.orderType = '';
      this.amountWithGST = null;
      if (this.fomSizeId != null) {
        parameterId = this.fomSizeId;
        this.trnProductStockService.getAllTrnProductStocks(this.categoryId, this.collectionId, parameterId, this.qualityId, null, null).subscribe(
          data => {
            this.productDetails = data;
          }, error => {
            this.globalErrorHandler.handleError(error);
          });
      }
    }
    else if (this.categoryId == 4 && this.matSizeId != -1) {
      this.matSizeIdError = false;
      this.productDetails.stock = null;
      this.orderQuantity = null;
      this.orderQuantityError = false;
      this.rateWithGST = null;
      this.rate = null;
      this.matHeight = null;
      this.matHeightError = false;
      this.matWidth = null;
      this.matWidthError = false;
      this.matThicknessId = null;
      this.matThicknessIdError = false;
      this.givenDiscount = null;
      this.givenDiscountError = false;
      this.orderType = '';
      this.amountWithGST = null;
      if (this.matSizeId != null) {
        parameterId = this.matSizeId;
        this.trnProductStockService.getAllTrnProductStocks(this.categoryId, this.collectionId, parameterId, this.qualityId, null, null).subscribe(
          data => {
            this.productDetails = data;
          }, error => {
            this.globalErrorHandler.handleError(error);
          });
      }
    }
    else if (this.categoryId == 4 && this.matSizeId != -1 && !this.qualityId) {
      return;
    }
    else if (this.categoryId == 7) {
      this.accessoryIdError = false;
      this.productDetails.stock = null;
      this.orderQuantity = null;
      this.orderQuantityError = false;
      this.rateWithGST = null;
      this.rate = null;
      this.matHeight = null;
      this.matHeightError = false;
      this.matWidth = null;
      this.matWidthError = false;
      this.givenDiscount = null;
      this.givenDiscountError = false;
      this.orderType = '';
      this.amountWithGST = null;
      if (this.accessoryId != null) {
        parameterId = this.accessoryId;
        this.trnProductStockService.getAllTrnProductStocks(this.categoryId, this.collectionId, parameterId, this.qualityId, null, null).subscribe(
          data => {
            this.productDetails = data;
          }, error => {
            this.globalErrorHandler.handleError(error);
          });
      }
    }
    else {
      parameterId = null;
    }
    //this.shadeId ? this.shadeId : this.fomSizeId ? this.fomSizeId : this.matSizeId != -1 ? this.matSizeId : null;
  }

  onCustomerChange() {

    if (this.trnMaterialQuotationObj.customerId != null) {
      Helpers.setLoading(true);
      this.trnMaterialQuotationService.getCustomerAddressByCustomerId(this.trnMaterialQuotationObj.customerId).subscribe(
        results => {
          this.addressList = results;
          this.selectedAddress = this.trnMaterialQuotationObj.customerId;
          Helpers.setLoading(false);
        },
        error => {
          this.globalErrorHandler.handleError(error);
          Helpers.setLoading(false);
        });
    }
    this.trnMaterialQuotationObj.shippingAddress = '';
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


  onDeleteItemDetails(id, index) {
    if (id) {
      this.confirmationService.confirm({
        message: 'Do you want to delete this record?',
        header: 'Delete Confirmation',
        icon: 'fa fa-trash',
        accept: () => {
          if (this.trnMaterialQuotationObj.totalAmount >= 0) {
            if (this.trnMaterialQuotationItems.length > 0) {
              this.trnMaterialQuotationObj.totalAmount = this.trnMaterialQuotationObj.totalAmount - this.trnMaterialQuotationItems[index].amountWithGST;
            } else {
              this.trnMaterialQuotationObj.totalAmount = 0;
            }
          }
          this.trnMaterialQuotationItems.splice(index, 1);
          // this.trnMaterialQuotationService.deleteItem(id).subscribe(
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
      if (this.trnMaterialQuotationObj.totalAmount >= 0) {
        if (this.trnMaterialQuotationItems.length > 0) {
          this.trnMaterialQuotationObj.totalAmount = this.trnMaterialQuotationObj.totalAmount - this.trnMaterialQuotationItems[index].amountWithGST;
        } else {
          this.trnMaterialQuotationObj.totalAmount = 0;
        }
      }
      this.trnMaterialQuotationItems.splice(index, 1);
    }
  }

  getCategoryCodeList() {
    this.commonService.getCategoryCodesForSO().subscribe(
      results => {
        this.categoriesCodeList = results;
        this.categoriesCodeList.unshift({ label: '--Select--', value: null });
      },
      error => {
        this.globalErrorHandler.handleError(error);
      });
  }

  calculateSizeCode() {
    if (this.matWidth && this.matHeight) {
      this.matSizeCode = this.matHeight + 'x' + this.matWidth;
    }
    else
      this.matSizeCode = '';
  }

  getAgentLookUp() {
    Helpers.setLoading(true);
    this.trnMaterialQuotationService.getAgentLookUp().subscribe(
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

  changeOrderType(row) {
    if (!row.rate)
      return;

    if (!row.orderQuantity)
      row.orderQuantity = 0;

    if (!row.discountPercentage)
      row.discountPercentage = 0;

    row.orderQuantity = parseFloat(row.orderQuantity);
    row.discountPercentage = parseFloat(row.discountPercentage);

    if (row.orderQuantity > 50) {
      row.orderType = 'RL';
    }
    else {
      if (!row.orderQuantity)
        row.orderType = '';
      else
        row.orderType = 'CL';
    }

    let rate = parseFloat(row.rate);
    row.rateWithGST = rate + (rate * row.gst) / 100;
    row.amount = rate * row.orderQuantity;
    row.amount = parseFloat(row.amount).toFixed(2);
    if (row.discountPercentage >= 0)
      row.amount = Math.round(row.amount - ((row.amount * row.discountPercentage) / 100));
    row.amountWithGST = Math.round(row.amount + ((row.amount * row.gst) / 100));
    row.rateWithGST = parseFloat(row.rateWithGST).toFixed(2);
    row.rateWithGST = parseFloat(row.rateWithGST);

    let sum = 0;
    _.forEach(this.trnMaterialQuotationItems, function(selectedItem) {
      sum = sum + selectedItem.amountWithGST;
    });

    this.trnMaterialQuotationObj.totalAmount = sum;
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
    this.areaError = false;
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
    this.productDetails.stock = null;
    this.orderQuantity = null;
    this.rateWithGST = null;
    this.rate = null;
    this.matHeight = null;
    this.matHeightError = false;
    this.matWidth = null;
    this.matWidthError = false;
    this.matThicknessId = null;
    this.matThicknessIdError = false;
    this.givenDiscount = null;
    this.givenDiscountError = false;
    this.amount = null,
      this.orderType = '';
    this.amountWithGST = null;
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
      this.productDetails.stock = null;
      this.orderQuantity = null;
      this.orderQuantityError = false;
      this.rateWithGST = null;
      this.rate = null;
      this.matHeight = null;
      this.matHeightError = false;
      this.matWidth = null;
      this.matWidthError = false;
      this.matThicknessId = null;
      this.matThicknessIdError = false;
      this.givenDiscount = null;
      this.givenDiscountError = false;
      this.amount = null,
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
      this.productDetails.stock = null;
      this.orderQuantity = null;
      this.orderQuantityError = false;
      this.rateWithGST = null;
      this.rate = null;
      this.matHeight = null;
      this.matHeightError = false;
      this.matWidth = null;
      this.matWidthError = false;
      this.matThicknessId = null;
      this.matThicknessIdError = false;
      this.givenDiscount = null;
      this.givenDiscountError = false;
      this.amount = null,
        this.orderType = '';
      this.amountWithGST = null;
      if (this.collectionId != null) {
        this.getFoamSizeList();
      }
    }
    else if (this.categoryId == 4) {
      this.collectionIdError = false;
      this.matSizeList = [];
      this.matSizeList.unshift({ label: '--Select--', value: null });
      this.areaError = false;
      this.matSizeIdError = false;
      this.matSizeId = null;
      this.qualityList = [];
      this.qualityList.unshift({ label: '--Select--', value: null });
      this.qualityIdError = false;
      this.qualityId = null;
      this.productDetails.stock = null;
      this.orderQuantity = null;
      this.orderQuantityError = false;
      this.rateWithGST = null;
      this.rate = null;
      this.matHeight = null;
      this.matHeightError = false;
      this.matWidth = null;
      this.matWidthError = false;
      this.matThicknessId = null;
      this.matThicknessIdError = false;
      this.givenDiscount = null;
      this.givenDiscountError = false;
      this.amount = null,
        this.orderType = '';
      this.amountWithGST = null;
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
      this.areaError = false;
      this.collectionIdError = false;
      this.shadeIdError = false;
      this.matSizeIdError = false;
      this.fomSizeIdError = false;
      this.shadeId = null;
      this.matSizeId = null;
      this.givenDiscountError = false;
      this.fomSizeId = null;
      this.productDetails.stock = null;
      this.orderQuantity = null;
      this.orderQuantityError = false;
      this.rateWithGST = null;
      this.rate = null;
      this.matHeight = null;
      this.matHeightError = false;
      this.matWidth = null;
      this.matWidthError = false;
      this.matThicknessId = null;
      this.matThicknessIdError = false;
      this.givenDiscount = null;
      this.amount = null,
        this.orderType = '';
      this.amountWithGST = null;
    }
  }

  getMatSizeList() {
    this.trnMaterialQuotationService.getMatSizeLookUpByCollection(this.collectionId).subscribe(
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
    this.trnMaterialQuotationService.getFomSizeLookUpByCollection(this.collectionId).subscribe(
      results => {
        this.fomSizeList = results;
        this.fomSizeList.unshift({ label: '--Select--', value: null });
      },
      error => {
        this.globalErrorHandler.handleError(error);
      });
  }


  getshadeIdList() {
    this.trnMaterialQuotationService.getSerialNumberLookUpByCollection(this.collectionId).subscribe(
      results => {
        this.shadeIdList = results;
        this.shadeIdList.unshift({ label: '--Select--', value: null });
      },
      error => {
        this.globalErrorHandler.handleError(error);
      });
  }

  getCollectionList() {
    this.collectionService.getCollectionLookUpForSo(this.categoryId).subscribe(
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
    //this.trnMaterialQuotationObj.TrnMaterialQuotationItems = this.trnMaterialQuotationItems;
    let custObj = _.find(this.customerList, ['value', this.trnMaterialQuotationObj.customerId]);
    let agentObj = _.find(this.agentList, ['value', this.trnMaterialQuotationObj.referById]);
    this.trnMaterialQuotationObj.customerName = custObj ? custObj.label : '';
    this.trnMaterialQuotationObj.agentName = agentObj ? agentObj.label : '';
    if (this.trnMaterialQuotationItems.length == 0) {
      this.messageService.addMessage({ severity: 'error', summary: 'Error', detail: "Please Select Items" });
      return false;
    }
    if (valid) {
      this.saveTrnMaterialQuotation(this.trnMaterialQuotationObj);
    }
  }


  saveTrnMaterialQuotation(value) {
    let tempMaterialQuotationDate = new Date(value.materialQuotationDate);
    value.materialQuotationDate = new Date(tempMaterialQuotationDate.setHours(23));
    Helpers.setLoading(true);
    if (this.params) {
      this.trnMaterialQuotationService.updateTrnMaterialQuotation(value)
        .subscribe(
        results => {
          this.params = null;
          this.messageService.addMessage({ severity: results.type.toLowerCase(), summary: results.type, detail: results.message });
          Helpers.setLoading(false);
          this.router.navigate(['/features/sales/trnMaterialQuotation/list']);
        },
        error => {
          this.globalErrorHandler.handleError(error);
          Helpers.setLoading(false);
        });
    } else {
      this.trnMaterialQuotationService.createTrnMaterialQuotation(value)
        .subscribe(
        results => {
          this.params = null;
          this.messageService.addMessage({ severity: results.type.toLowerCase(), summary: results.type, detail: results.message });
          Helpers.setLoading(false);
          this.router.navigate(['/features/sales/trnMaterialQuotation/list']);
        },
        error => {
          this.globalErrorHandler.handleError(error);
          Helpers.setLoading(false);
        });
    }
  }


  onCancel() {
    if (this.materialSelectionId || this.materialQuotationId)
      this.router.navigate(['/features/sales/trnMaterialSelection/list']);
    else
      this.router.navigate(['/features/sales/trnMaterialQuotation/list']);

    this.disabled = false;
    this.viewItem = true;
  }
}
