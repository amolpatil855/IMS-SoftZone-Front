import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash/index';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { ConfirmationService, DataTableModule, LazyLoadEvent, SelectItem } from 'primeng/primeng';
import { GlobalErrorHandler } from '../../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../../_services/message.service';
import { UserService } from "../../../../_services/user.service";
import { TrnAdvancePaymentService } from '../../../../_services/trnAdvancePayment.service';
import { ScriptLoaderService } from '../../../../../../../_services/script-loader.service';
import { CommonService } from '../../../../_services/common.service';
import { Helpers } from "../../../../../../../helpers";
import { TrnAdvancePayment } from "../../../../_models/trnAdvancePayment";
import { TrnProductStockService } from '../../../../_services/trnProductStock.service';
import { CollectionService } from '../../../../_services/collection.service';
import { CompanyService } from '../../../../../../pages/default/_services/company.service';
@Component({
  selector: "app-trnAdvancePayment-add-edit",
  templateUrl: "./trnAdvancePayment-add-edit.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class TrnAdvancePaymentAddEditComponent implements OnInit {

  trnAdvancePaymentForm: any;
  trnAdvancePaymentObj: any;
  quotationObjList = [];
  userRole: string;
  params: number;
  adminFlag: boolean = false;
  status: boolean = true;
  viewItem: boolean = true;
  trnAdvancePaymentList = [];
  isFormSubmitted = false;
  disabled: boolean = false;
  confirmAmount: number;
  totalAmount: number;
  balanceAmount: number;
  paymentModeList = [];
  quotationTypeList = [];
  customerList = [];
  quotationNumberList = [];
  mstCompanyInfo: any;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private trnAdvancePaymentService: TrnAdvancePaymentService,
    private collectionService: CollectionService,
    private globalErrorHandler: GlobalErrorHandler,
    private confirmationService: ConfirmationService,
    private commonService: CommonService,
    private companyService: CompanyService,
    private trnProductStockService: TrnProductStockService,
    private messageService: MessageService) {
  }

  ngOnInit() {
    this.trnAdvancePaymentObj = new TrnAdvancePayment();
    this.getLoggedInUserDetail();
    let today = new Date();
    this.disabled = false;
    this.trnAdvancePaymentObj.advancePaymentDate = today;
    this.trnAdvancePaymentObj.chequeDate = today;
    this.trnAdvancePaymentObj.materialQuotationId = null;
    this.trnAdvancePaymentObj.curtainQuotationId = null;
    this.trnAdvancePaymentObj.quotationType = null;
    this.trnAdvancePaymentObj.paymentMode = null;
    this.quotationTypeList.push({ label: '--Select--', value: null });
    this.quotationTypeList.push({ label: 'Curtain', value: 'Curtain' });
    this.quotationTypeList.push({ label: 'Material', value: 'Material' });
    this.paymentModeList.push({ label: '--Select--', value: null });
    this.paymentModeList.push({ label: 'Cash', value: 'Cash' });
    this.paymentModeList.push({ label: 'Card', value: 'Card' });
    this.paymentModeList.push({ label: 'Credit', value: 'Credit' });
    this.paymentModeList.push({ label: 'Bank Transfer', value: 'Bank Transfer' });
    this.paymentModeList.push({ label: 'Cheque', value: 'Cheque' });
    this.route.params.forEach((params: Params) => {
      this.params = params['id'];
    });
    if (this.params) {
      this.disabled = true;
      this.getTrnAdvancePaymentById(this.params);
      this.getAllCompanyInfo();
    }
  }

  getAllCompanyInfo() {
    this.companyService.getAllCompanyInfo().subscribe(
      (results: any) => {
        this.mstCompanyInfo = results;
      });
  }

  print(): void {
    let printContents, popupWin;
    printContents = document.getElementById('invoiceMainBox').innerHTML;
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

  getMaterialQuotationLookup() {
    Helpers.setLoading(true);
    this.trnAdvancePaymentService.getMaterialQuotationLookup().subscribe(
      results => {
        this.quotationObjList = results;
        this.quotationNumberList = [];
        let vm = this;
        _.forEach(this.quotationObjList, item => {
          vm.quotationNumberList.push({ label: item.materialQuotationNumber, value: item.id })
        })
        this.quotationNumberList.unshift({ label: '--Select--', value: null });
        Helpers.setLoading(false);
      },
      error => {
        this.globalErrorHandler.handleError(error);
        Helpers.setLoading(false);
      });
  }

  getCurtainQuotationLookup() {
    Helpers.setLoading(true);
    this.trnAdvancePaymentService.getCurtainQuotationLookup().subscribe(
      results => {
        this.quotationObjList = results;
        this.quotationNumberList = [];
        let vm = this;
        _.forEach(this.quotationObjList, item => {
          vm.quotationNumberList.push({ label: item.curtainQuotationNumber, value: item.id })
        })
        this.quotationNumberList.unshift({ label: '--Select--', value: null });
        Helpers.setLoading(false);
      },
      error => {
        this.globalErrorHandler.handleError(error);
        Helpers.setLoading(false);
      });
  }

  onQuotationTypeChange() {
    this.quotationNumberList = [];
    this.quotationNumberList.unshift({ label: '--Select--', value: null });
    this.trnAdvancePaymentObj.materialQuotationId = null;
    this.trnAdvancePaymentObj.curtainQuotationId = null;
    this.trnAdvancePaymentObj.customerName = null;
    this.trnAdvancePaymentObj.customerId = null;
    this.totalAmount = null;
    this.balanceAmount = null;
    if (this.trnAdvancePaymentObj.quotationType != null) {
      if (this.trnAdvancePaymentObj.quotationType == "Curtain")
        this.getCurtainQuotationLookup();
      else if (this.trnAdvancePaymentObj.quotationType == "Material")
        this.getMaterialQuotationLookup();
    }
  }

  onQuotationNoChange() {
    this.customerList = [];
    this.trnAdvancePaymentObj.customerName = null;
    this.totalAmount = null;
    if (this.trnAdvancePaymentObj.materialQuotationId != null) {
      let qoObj = _.find(this.quotationObjList, ['id', this.trnAdvancePaymentObj.materialQuotationId]);
      this.trnAdvancePaymentObj.customerName = qoObj.customerName;
      this.trnAdvancePaymentObj.customerId = qoObj.customerId;
      this.totalAmount = qoObj.totalAmount;
      this.balanceAmount = qoObj.balanceAmount;
    } else if (this.trnAdvancePaymentObj.curtainQuotationId != null) {
      let qoObj = _.find(this.quotationObjList, ['id', this.trnAdvancePaymentObj.curtainQuotationId]);
      this.trnAdvancePaymentObj.customerName = qoObj.customerName;
      this.trnAdvancePaymentObj.customerId = qoObj.customerId;
      this.totalAmount = qoObj.totalAmount;
      this.balanceAmount = qoObj.balanceAmount;
    }
  }

  onAmountChange() {
    if (this.balanceAmount < this.trnAdvancePaymentObj.amount) {
      this.messageService.addMessage({ severity: 'error', summary: 'Error', detail: "Amount must be less than or equal to balance amount." });
      return false;
    }

  }

  getTrnAdvancePaymentById(id) {
    Helpers.setLoading(true);
    this.trnAdvancePaymentService.getTrnAdvancePaymentById(id).subscribe(
      results => {
        this.trnAdvancePaymentObj = results;
        this.status = true;
        this.viewItem = false;
        this.trnAdvancePaymentObj.advancePaymentDate = new Date(this.trnAdvancePaymentObj.advancePaymentDate);
        this.trnAdvancePaymentObj.chequeDate = new Date(this.trnAdvancePaymentObj.chequeDate);
        if (this.trnAdvancePaymentObj.trnMaterialQuotation)
          this.totalAmount = this.trnAdvancePaymentObj.trnMaterialQuotation.totalAmount;
        Helpers.setLoading(false);
      },
      error => {
        this.globalErrorHandler.handleError(error);
        Helpers.setLoading(false);
      });
  }

  onSubmit({ value, valid }: { value: any, valid: boolean }) {
    this.isFormSubmitted = true;
    if (valid) {
      this.trnAdvancePaymentObj.amount = parseInt(this.trnAdvancePaymentObj.amount);
      if (this.balanceAmount < this.trnAdvancePaymentObj.amount) {
        this.messageService.addMessage({ severity: 'error', summary: 'Error', detail: "Amount must be less than or equal to balance amount." });
        return false;
      }
      value.confirmAmount = parseInt(value.confirmAmount);
      if (this.trnAdvancePaymentObj.amount != value.confirmAmount) {
        this.messageService.addMessage({ severity: 'error', summary: 'Error', detail: "Amount doesn't match." });
        return false;
      }
      this.saveTrnAdvancePayment(this.trnAdvancePaymentObj);
    }
  }


  saveTrnAdvancePayment(value) {
    let tempAdvancePaymentDate = new Date(value.advancePaymentDate);
    value.advancePaymentDate = new Date(tempAdvancePaymentDate.setHours(23));
    if (this.trnAdvancePaymentObj.paymentMode == "Cheque") {
      let tempChequeDate = new Date(value.chequeDate);
      value.chequeDate = new Date(tempChequeDate.setHours(23));
    } else {
      value.chequeDate = null;
    }
    Helpers.setLoading(true);
    this.trnAdvancePaymentService.createTrnAdvancePayment(value)
      .subscribe(
      results => {
        this.params = null;
        this.messageService.addMessage({ severity: results.type.toLowerCase(), summary: results.type, detail: results.message });
        Helpers.setLoading(false);
        this.router.navigate(['/features/sales/trnAdvancePayment/list']);
      },
      error => {
        this.globalErrorHandler.handleError(error);
        Helpers.setLoading(false);
      });
  }


  onCancel() {
    this.router.navigate(['/features/sales/trnAdvancePayment/list']);
    this.disabled = false;
    this.viewItem = true;
  }

}
