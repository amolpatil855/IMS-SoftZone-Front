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

@Component({
  selector: "app-trnAdvancePayment-add-edit",
  templateUrl: "./trnAdvancePayment-add-edit.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class TrnAdvancePaymentAddEditComponent implements OnInit {

  trnAdvancePaymentForm: any;
  trnAdvancePaymentObj: any;
  userRole: string;
  params: number;
  adminFlag: boolean = false;
  status: boolean = true;
  viewItem: boolean = true;
  trnAdvancePaymentList = [];
  isFormSubmitted = false;
  disabled: boolean = false;
  paymentModeList = [];
  customerList = [];
  materialQuotationNumberList = [];
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
    private trnProductStockService: TrnProductStockService,
    private messageService: MessageService) {
  }

  ngOnInit() {
    this.trnAdvancePaymentObj = new TrnAdvancePayment();
    this.getLoggedInUserDetail();
    this.getMaterialQuotationLookup();
    let today = new Date();
    this.disabled = false;
    this.trnAdvancePaymentObj.advancePaymentDate = today;
    this.trnAdvancePaymentObj.chequeDate = today;
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
    }
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
        this.materialQuotationNumberList = results;
        this.materialQuotationNumberList.unshift({ label: '--Select--', value: null });
        Helpers.setLoading(false);
      },
      error => {
        this.globalErrorHandler.handleError(error);
        Helpers.setLoading(false);
      });
  }

  onMaterialQuotationNoChange() {
    if (this.trnAdvancePaymentObj.materialQuotationId != null) {
      Helpers.setLoading(true);
      this.trnAdvancePaymentService.getCustomerLookupByMaterialQuotationId(this.trnAdvancePaymentObj.materialQuotationId).subscribe(
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
  }

  getTrnAdvancePaymentById(id) {
    Helpers.setLoading(true);
    this.trnAdvancePaymentService.getTrnAdvancePaymentById(id).subscribe(
      results => {
        this.trnAdvancePaymentObj = results;
        this.status = true;
        this.viewItem = true;
        this.trnAdvancePaymentObj.advancePaymentDate = new Date(this.trnAdvancePaymentObj.advancePaymentDate);
        this.trnAdvancePaymentObj.chequeDate = new Date(this.trnAdvancePaymentObj.chequeDate);
        Helpers.setLoading(false);
      },
      error => {
        this.globalErrorHandler.handleError(error);
        Helpers.setLoading(false);
      });
  }

  onSubmit({ value, valid }: { value: any, valid: boolean }) {
    this.isFormSubmitted = true;
    let custObj = _.find(this.customerList, ['value', this.trnAdvancePaymentObj.customerId]);
    this.trnAdvancePaymentObj.customerName = custObj ? custObj.label : '';

    if (valid) {
      this.saveTrnAdvancePayment(this.trnAdvancePaymentObj);
    }
  }


  saveTrnAdvancePayment(value) {
    let tempAdvancePaymentDate = new Date(value.advancePaymentDate);
    let tempChequeDate = new Date(value.chequeDate);
    value.advancePaymentDate = new Date(tempAdvancePaymentDate.setHours(23));
    value.chequeDate = new Date(tempChequeDate.setHours(23));
    Helpers.setLoading(true);
    if (this.params) {
      this.trnAdvancePaymentService.updateTrnAdvancePayment(value)
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
    } else {
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
  }


  onCancel() {
    this.router.navigate(['/features/sales/trnAdvancePayment/list']);
    this.disabled = false;
    this.viewItem = true;
  }

}
