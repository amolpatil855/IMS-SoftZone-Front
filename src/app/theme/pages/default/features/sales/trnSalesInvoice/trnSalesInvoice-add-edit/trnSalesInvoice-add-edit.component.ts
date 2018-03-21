import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash/index';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { ConfirmationService, DataTableModule, LazyLoadEvent, SelectItem, TRISTATECHECKBOX_VALUE_ACCESSOR } from 'primeng/primeng';
import { GlobalErrorHandler } from '../../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../../_services/message.service';
import { TrnSalesInvoiceService } from '../../../../_services/trnSalesInvoice.service';
import { ScriptLoaderService } from '../../../../../../../_services/script-loader.service';
import { Helpers } from "../../../../../../../helpers";
import { TrnSalesInvoice } from "../../../../_models/trnSalesInvoice";
import { SupplierService } from '../../../../_services/supplier.service';
import { CommonService } from '../../../../_services/common.service';
import { CollectionService } from '../../../../_services/collection.service';
import { TrnProductStockService } from '../../../../_services/trnProductStock.service';
import { MatSizeService } from '../../../../_services/matSize.service';
import { CustomerAddress } from '../../../../_models/customerAddress';
@Component({
  selector: "app-trnSalesInvoice-add-edit",
  templateUrl: "./trnSalesInvoice-add-edit.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class TrnSalesInvoiceAddEditComponent implements OnInit {
  TrnSalesInvoiceForm: any;
  params: number;
  TrnSalesInvoiceList = [];
  invoiceGSTValues = [];
  showUpdateBtn: boolean = true;
  pageSize = 50;
  page = 1;
  totalCount = 0;
  totalTaxAmount = 0;
  search = '';
  tableEmptyMesssage = 'Loading...';
  trnSalesInvoiceObj = new TrnSalesInvoice();
  gstAll = null;
  iGstAll = null;
  orderNumber = null;
  numberToWordConversion = '';
  numberToWordConversionForTax = '';
  amountWithGST = null;
  rateWithGST = null;
  qualityList = [];
  invoiceItemQuantityTotal = 0;
  isFormSubmitted: boolean;
  trnSalesInvoiceItems = [];
  customerAddresses = [];
  customerShippingAddress = new CustomerAddress();
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
  viewItem: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private supplierService: SupplierService,
    private commonService: CommonService,
    private TrnSalesInvoiceService: TrnSalesInvoiceService,
    private globalErrorHandler: GlobalErrorHandler,
    private confirmationService: ConfirmationService,
    private collectionService: CollectionService,
    private messageService: MessageService,
    private trnProductStockService: TrnProductStockService,
    private matSizeService: MatSizeService
  ) {
  }

  ngOnInit() {
    this.trnSalesInvoiceObj = new TrnSalesInvoice();
    let today = new Date();
    this.disabled = false;
    this.viewItem = false;
    this.showUpdateBtn = true;
    this.trnSalesInvoiceObj.invoiceDate = today;
    this.route.params.forEach((params: Params) => {
      this.params = params['id'];
    });
    if (this.params) {
      // this.showUpdateBtn = false;
      this.getTrnSalesInvoiceById(this.params);
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

  getTrnSalesInvoiceById(id) {
    Helpers.setLoading(true);
    this.TrnSalesInvoiceService.getTrnSalesInvoiceById(id).subscribe(
      results => {
        this.trnSalesInvoiceObj = results;
        if(this.params && this.trnSalesInvoiceObj.isApproved)
          this.disabled = true;

        if(this.trnSalesInvoiceObj.isApproved && this.trnSalesInvoiceObj.isPaid)
          this.viewItem = true;
        else
          this.viewItem = false;
        
        let customerInMH;
        if (results.trnSaleOrder != null) {
          this.orderNumber = results.trnSaleOrder.orderNumber;
          this.customerAddresses = results.trnSaleOrder.mstCustomer.mstCustomerAddresses;
          customerInMH = _.find(this.customerAddresses, function (o) { return o.state == "Maharashtra" && o.id == results.trnSaleOrder.shippingAddressId; });
          this.customerShippingAddress = _.find(this.customerAddresses, function (o) { return o.id == results.trnSaleOrder.shippingAddressId; });
        } else {
          this.orderNumber = results.trnMaterialQuotation.materialQuotationNumber;
          this.customerAddresses = results.trnMaterialQuotation.mstCustomer.mstCustomerAddresses;
          customerInMH = _.find(this.customerAddresses, function (o) { return o.state == "Maharashtra" && o.isPrimary == true; });
          this.customerShippingAddress = _.find(this.customerAddresses, function (o) { return o.isPrimary == true; });
        }

        this.trnSalesInvoiceObj.trnSalesInvoiceItems.forEach(item => {
          if (this.trnSalesInvoiceObj.totalAmount == null) {
            this.trnSalesInvoiceObj.totalAmount = 0;
          }

          if (customerInMH) {
            this.gstAll = this.gstAll + Math.round(((item.amount * (item.gst)) / 100));

          }
          else {
            this.iGstAll = this.iGstAll + Math.round((item.amount * (item.gst)) / 100);
          }
          // this.trnSalesInvoiceObj.totalAmount = this.trnSalesInvoiceObj.totalAmount + item.amount;
          // this.customerAddresses.forEach(o => {
          //   if (o.state == "Maharashtra") {
          //     this.gstAll = this.gstAll + Math.round(((item.amount * (item.gst)) / 100) / 2);
          //     // this.trnSalesInvoiceObj.totalAmount = this.trnSalesInvoiceObj.totalAmount + (this.gstAll * 2) + item.amount;
          //   } else {
          //     this.iGstAll = this.iGstAll + Math.round((item.amount * (item.gst)) / 100);
          //     // this.trnSalesInvoiceObj.totalAmount = this.trnSalesInvoiceObj.totalAmount + this.iGstAll + item.amount;
          //   }
          // })


        });
        // if(customerInMH)
        // {
        // this.trnSalesInvoiceObj.totalAmount = this.trnSalesInvoiceObj.totalAmount + this.gstAll;
        // }
        // else{
        //   this.trnSalesInvoiceObj.totalAmount = this.trnSalesInvoiceObj.totalAmount + this.iGstAll;
        // }
        this.numberToWordConversion = this.numberToWords(this.trnSalesInvoiceObj.totalAmount, ",");
        this.numberToWordConversionForTax = this.numberToWords(this.gstAll > 0 ? this.gstAll : this.iGstAll, ",");
        this.calculateGSTWiseAmount();
        Helpers.setLoading(false);
      },
      error => {
        this.globalErrorHandler.handleError(error);
        Helpers.setLoading(false);
      });
  }

  calculateGSTWiseAmount() {
    let invoiceItems = this.trnSalesInvoiceObj.trnSalesInvoiceItems;
    let lstGST = _.uniq(_.map(this.trnSalesInvoiceObj.trnSalesInvoiceItems, 'gst'))
    //trnSalesInvoiceItems
    let lstGSTValue = [];
    let totalTax = 0;
    let vm = this;
    vm.invoiceItemQuantityTotal = 0;
    _.forEach(lstGST, function (gstVal) {
      //console.log(value);
      let gstTotal = 0;
      let taxsableValue = 0;
      _.forEach(invoiceItems, function (item) {
        if (item.gst == gstVal) {
          vm.invoiceItemQuantityTotal = vm.invoiceItemQuantityTotal + item.quantity;
          gstTotal = gstTotal + (item.amount * item.gst / 100);
          taxsableValue = taxsableValue + item.amount;
          totalTax = totalTax + gstTotal;
        }
      });
      gstTotal = Math.round(gstTotal);
      totalTax = Math.round(totalTax);
      lstGSTValue.push({ taxValue: taxsableValue, gst: gstVal, amount: gstTotal, totalTax: totalTax });
    });
    this.totalTaxAmount = totalTax;
    this.invoiceGSTValues = lstGSTValue;
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

  enableEdit(row) {
    row.enable = true;
  }
  cancelEdit(row) {
    row.enable = false;
  }

  onCancel() {
    this.router.navigate(['/features/sales/trnSalesInvoice/list']);
    this.disabled = false;
    this.viewItem = false;
    this.orderNumber = null;
    this.showUpdateBtn = true;
  }

  onSubmit({ value, valid }: { value: any, valid: boolean }) {
    this.isFormSubmitted = true;
    
    if (valid) {
      if (!this.trnSalesInvoiceObj.courierDockYardNumber) {
          this.messageService.addMessage({ severity: 'error', summary: 'Error', detail: "Please enter Dispatch Document No." });
          return false;
      }
      this.saveTrnSalesInvoice(this.trnSalesInvoiceObj);
    }
  }


  saveTrnSalesInvoice(value) {
    Helpers.setLoading(true);
    if (this.params) {
      this.TrnSalesInvoiceService.updateTrnSalesInvoice(value)
        .subscribe(
        results => {
          this.params = null;
          this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: results.message });
          Helpers.setLoading(false);
          this.router.navigate(['/features/sales/trnSalesInvoice/list']);
        },
        error => {
          this.globalErrorHandler.handleError(error);
          Helpers.setLoading(false);
        });
    } else {
      this.TrnSalesInvoiceService.createTrnSalesInvoice(value)
        .subscribe(
        results => {
          this.params = null;
          this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: results.message });
          Helpers.setLoading(false);
          this.router.navigate(['/features/sales/trnSalesInvoice/list']);
        },
        error => {
          this.globalErrorHandler.handleError(error);
          Helpers.setLoading(false);
        });
    }
  }

}
