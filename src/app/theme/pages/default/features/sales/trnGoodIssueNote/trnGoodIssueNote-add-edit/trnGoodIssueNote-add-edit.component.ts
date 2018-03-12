import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash/index';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { ConfirmationService, DataTableModule, LazyLoadEvent, SelectItem, TRISTATECHECKBOX_VALUE_ACCESSOR } from 'primeng/primeng';
import { GlobalErrorHandler } from '../../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../../_services/message.service';
import { TrnGoodIssueNoteService } from '../../../../_services/trnGoodIssueNote.service';
import { ScriptLoaderService } from '../../../../../../../_services/script-loader.service';
import { Helpers } from "../../../../../../../helpers";
import { TrnGoodIssueNote } from "../../../../_models/trnGoodIssueNote";
import { SupplierService } from '../../../../_services/supplier.service';
import { CommonService } from '../../../../_services/common.service';
import { CollectionService } from '../../../../_services/collection.service';
import { TrnProductStockService } from '../../../../_services/trnProductStock.service';
import { MatSizeService } from '../../../../_services/matSize.service';
import { TrnGINForItemsWithStockAvailableService } from '../../../../_services/trnGINForItemsWithStockAvailable.service';
@Component({
  selector: "app-trnGoodIssueNote-add-edit",
  templateUrl: "./trnGoodIssueNote-add-edit.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class TrnGoodIssueNoteAddEditComponent implements OnInit {
  TrnGoodIssueNoteForm: any;
  params: number;
  TrnGoodIssueNoteList = [];
  showUpdateBtn: boolean = true;
  pageSize = 50;
  page = 1;
  totalCount = 0;
  search = '';
  tableEmptyMesssage = 'Loading...';
  trnGoodIssueNoteObj = new TrnGoodIssueNote();
  amountWithGST = null;
  rateWithGST = null;
  qualityList = [];
  isFormSubmitted: boolean;
  trnGoodIssueNoteItems = [];
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
  redirectToGinStockAavailableList = null;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private supplierService: SupplierService,
    private commonService: CommonService,
    private TrnGoodIssueNoteService: TrnGoodIssueNoteService,
    private globalErrorHandler: GlobalErrorHandler,
    private confirmationService: ConfirmationService,
    private collectionService: CollectionService,
    private messageService: MessageService,
    private trnProductStockService: TrnProductStockService,
    private matSizeService: MatSizeService,
    private trnGINForItemsWithStockAvailableService: TrnGINForItemsWithStockAvailableService
  ) {
  }

  ngOnInit() {
    this.trnGoodIssueNoteObj = new TrnGoodIssueNote();
    let today = new Date();
    this.disabled = false;
    this.showUpdateBtn = true;
    this.trnGoodIssueNoteObj.ginDate = today;
    this.route.params.forEach((params: Params) => {
      this.params = params['id'];
    });
    if (this.params) {
      this.disabled = true;
      // this.showUpdateBtn = false;
      this.getTrnGoodIssueNoteById(this.params);
    }

    this.route.queryParams
      //.filter(params => params.parent)
      .subscribe(params => {
        this.redirectToGinStockAavailableList = params.parent;
      });
  }

  getTrnGoodIssueNoteById(id) {
    Helpers.setLoading(true);
    this.TrnGoodIssueNoteService.getTrnGoodIssueNoteById(id).subscribe(
      results => {
        this.trnGoodIssueNoteObj = results;
        Helpers.setLoading(false);
      },
      error => {
        this.globalErrorHandler.handleError(error);
        Helpers.setLoading(false);
      });
  }

  enableEdit(row) {
    row.enable = true;
  }
  cancelEdit(row) {
    row.enable = false;
  }

  onCancel() {
    if (this.redirectToGinStockAavailableList == "lstStock")
      this.router.navigate(['/features/sales/trnGINForItemsWithStockAvailable/list']);
    else
      this.router.navigate(['/features/sales/trnGoodIssueNote/list']);
    this.disabled = false;
    this.showUpdateBtn = true;
  }

  onSubmit({ value, valid }: { value: any, valid: boolean }) {
    this.isFormSubmitted = true;
    let orderQuantityFlag = true;
    //this.trnGoodIssueNoteObj.TrnGoodIssueNoteItems = this.trnGoodIssueNoteItems;
    if (this.trnGoodIssueNoteObj.trnGoodIssueNoteItems.length == 0) {
      this.messageService.addMessage({ severity: 'error', summary: 'Error', detail: "Please Select Items" });
      return false;
    }

    // _.forEach(this.trnGoodIssueNoteObj.trnGoodIssueNoteItems, function (item) {
    //   if (!item.issuedQuantity || item.issuedQuantity == 0)
    //     orderQuantityFlag = false;
    // });

    // if (!orderQuantityFlag) {
    //   this.messageService.addMessage({ severity: 'error', summary: 'Error', detail: "Please Select Items" });
    //   return false;
    // }

    if (valid) {
      // let supplierObj = _.find(this.supplierCodeList, ['value', this.trnGoodIssueNoteObj.supplierId]);
      // this.trnGoodIssueNoteObj.supplierName = supplierObj.label,
      this.saveTrnGoodIssueNote(this.trnGoodIssueNoteObj);
    }
  }


  saveTrnGoodIssueNote(value) {
    Helpers.setLoading(true);
    if (this.params) {
      this.TrnGoodIssueNoteService.updateTrnGoodIssueNote(value)
        .subscribe(
        results => {
          this.params = null;
          this.messageService.addMessage({ severity: results.type.toLowerCase(), summary: results.type, detail: results.message });
          Helpers.setLoading(false);
          this.router.navigate(['/features/sales/trnGoodIssueNote/list']);
        },
        error => {
          this.globalErrorHandler.handleError(error);
          Helpers.setLoading(false);
        });
    } else {
      this.TrnGoodIssueNoteService.createTrnGoodIssueNote(value)
        .subscribe(
        results => {
          this.params = null;
          this.messageService.addMessage({ severity: results.type.toLowerCase(), summary: results.type, detail: results.message });
          Helpers.setLoading(false);
          this.router.navigate(['/features/sales/trnGoodIssueNote/list']);
        },
        error => {
          this.globalErrorHandler.handleError(error);
          Helpers.setLoading(false);
        });
    }
  }

}
