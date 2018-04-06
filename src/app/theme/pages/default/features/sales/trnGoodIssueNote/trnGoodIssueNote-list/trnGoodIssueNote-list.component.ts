import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash/index';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { ConfirmationService, DataTableModule, LazyLoadEvent, SelectItem } from 'primeng/primeng';
import { GlobalErrorHandler } from '../../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../../_services/message.service';
import { TrnGoodIssueNoteService } from '../../../../_services/trnGoodIssueNote.service';
import { ScriptLoaderService } from '../../../../../../../_services/script-loader.service';
import { Helpers } from "../../../../../../../helpers";
import { TrnGoodIssueNote } from "../../../../_models/trnGoodIssueNote";

@Component({
  selector: "app-trnGoodIssueNote-list",
  templateUrl: "./trnGoodIssueNote-list.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class TrnGoodIssueNoteListComponent implements OnInit {
  params: number;
  trnGoodIssueNoteList = [];
  pageSize = 50;
  page = 1;
  totalCount = 0;
  search = '';
  tableEmptyMesssage = 'Loading...';
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private trnGoodIssueNoteService: TrnGoodIssueNoteService,
    private globalErrorHandler: GlobalErrorHandler,
    private confirmationService: ConfirmationService,
    private messageService: MessageService) {
  }

  ngOnInit() {
  }

  getTrnGoodReceiveNotesList() {
    this.trnGoodIssueNoteService.getAllTrnGoodIssueNotes(this.pageSize, this.page, this.search).subscribe(
      results => {
        this.trnGoodIssueNoteList = results.data;
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

  onEditClick(trnGoodIssueNote: TrnGoodIssueNote) {
    this.router.navigate(['/features/sales/trnGoodIssueNote/edit', trnGoodIssueNote.id]);
  }

  onDelete(trnGoodIssueNote: TrnGoodIssueNote) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        this.trnGoodIssueNoteService.deleteTrnGoodIssueNote(trnGoodIssueNote.id).subscribe(
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
    this.router.navigate(['/features/sales/trnGoodIssueNote/add']);
  }
}
