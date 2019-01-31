import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash/index';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { ConfirmationService, DataTableModule, LazyLoadEvent, SelectItem } from 'primeng/primeng';
import { GlobalErrorHandler } from '../../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../../_services/message.service';
import { TrnGoodReceiveNoteService } from '../../../../_services/trnGoodReceiveNote.service';
import { ScriptLoaderService } from '../../../../../../../_services/script-loader.service';
import { Helpers } from "../../../../../../../helpers";
import { TrnGoodReceiveNote } from "../../../../_models/trnGoodReceiveNote";
import { TrnPurchaseOrderService } from '../../../../_services/trnPurchaseOrder.service';


@Component({
  selector: "app-trnGoodReceiveNote-list",
  templateUrl: "./trnGoodReceiveNote-list.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class TrnGoodReceiveNoteListComponent implements OnInit {
  trnGoodReceiveNoteForm: any;
  trnGoodReceiveNoteObj: any;
  params: number;
  trnGoodReceiveNoteList = [];
  trnPurchaseOrderList = [];
  pageSize = 50;
  page = 1;
  totalCount = 0;
  search = '';
  tableEmptyMesssage = 'Loading...';
  SelectPO: any = 0;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private trnGoodReceiveNoteService: TrnGoodReceiveNoteService,
    private globalErrorHandler: GlobalErrorHandler,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private trnPurchaseOrderService: TrnPurchaseOrderService,) {
  }

  ngOnInit() {
    this.getTrnPurchaseOrdersList();
  }
  getTrnPurchaseOrdersList() {
    let pageSize = 1000;
    this.trnPurchaseOrderService.getAllTrnPurchaseOrders(this.pageSize, this.page, this.search).subscribe(
      results => {
        let _tempList = results.data;
        this.trnPurchaseOrderList = _.filter(_tempList,function(o){return o.status !== 'Approved' || o.status !== 'Completed'})
        this.trnPurchaseOrderList.unshift({'id':0, 'orderNumber':'--select--'});
        this.totalCount = results.totalCount;
        if (this.totalCount == 0) {
          this.tableEmptyMesssage = "No Records Found";
        }
      },
      error => {
        this.tableEmptyMesssage = "No Records Found";
        this.globalErrorHandler.handleError(error);
      });
  }
  getTrnGoodReceiveNotesList() {
    this.trnGoodReceiveNoteService.getAllTrnGoodReceiveNotes(this.pageSize, this.page, this.search).subscribe(
      results => {
        this.trnGoodReceiveNoteList = results.data;
        this.totalCount = results.totalCount;
        if (this.totalCount == 0) {
          this.tableEmptyMesssage = "No Records Found";
        }
      },
      error => {
        this.tableEmptyMesssage = "No Records Found";
        this.globalErrorHandler.handleError(error);
      });
  }

  loadLazy(event: LazyLoadEvent) {
    this.pageSize = event.rows;
    this.page = event.first / event.rows;
    this.search = event.globalFilter;
    this.getTrnGoodReceiveNotesList();
  }

  onEditClick(trnGoodReceiveNote: TrnGoodReceiveNote) {
    this.router.navigate(['/features/purchase/trnGoodReceiveNote/edit', trnGoodReceiveNote.id]);
  }
  onAddGoodReceiveNote(){
    this.router.navigate(['/features/purchase/trnGoodReceiveNote/add', 'PO-'+this.SelectPO]);
  }

  onDelete(trnGoodReceiveNote: TrnGoodReceiveNote) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        this.trnGoodReceiveNoteService.deleteTrnGoodReceiveNote(trnGoodReceiveNote.id).subscribe(
          results => {
            this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: results.message });
            this.getTrnGoodReceiveNotesList();
          },
          error => {
            this.globalErrorHandler.handleError(error);
          })
      },
      reject: () => {
      }
    });
  }

  onAddClick() {
    this.router.navigate(['/features/purchase/trnGoodReceiveNote/add']);
  }
}
