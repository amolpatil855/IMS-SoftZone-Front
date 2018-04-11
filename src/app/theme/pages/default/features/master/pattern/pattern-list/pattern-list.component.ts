import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash/index';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { ConfirmationService, DataTableModule, LazyLoadEvent, SelectItem } from 'primeng/primeng';
import { GlobalErrorHandler } from '../../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../../_services/message.service';
import { PatternService } from '../../../../_services/pattern.service';
import { Role } from "../../../../_models/role";
import { ScriptLoaderService } from '../../../../../../../_services/script-loader.service';
import { Helpers } from "../../../../../../../helpers";
import { Pattern } from "../../../../_models/pattern";
@Component({
  selector: "app-pattern-list",
  templateUrl: "./pattern-list.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class PatternListComponent implements OnInit {

  patternForm: any;
  patternObj: any;
  params: number;
  patternList = [];
  pageSize = 50;
  page = 1;
  totalCount = 0;
  search = '';
  toggleDiv = false;
  disabled: boolean = false;
  isFormSubmitted: boolean = false;
  tableEmptyMesssage = 'Loading...';
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private patternService: PatternService,
    private globalErrorHandler: GlobalErrorHandler,
    private confirmationService: ConfirmationService,
    private messageService: MessageService) {
  }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      this.params = params['id'];
    });
    this.newRecord();
  }

  newRecord() {
    this.params = null;
    this.patternObj = {
      name: null,
      fabricHeight: null,
      liningHeight: null,
      meterPerInch: null,
      widthPerInch: null,
      setRateForPattern: null,
      verticalPatch: null,
      horizontalPatch: null,
    };
    this.disabled = false;
  }

  toggleButton() {
    this.toggleDiv = !this.toggleDiv;
    if (this.toggleDiv && !this.params) {
      this.disabled = false;
      this.isFormSubmitted = false;
      this.newRecord();
    }

  }

  onCancel() {
    this.toggleDiv = false;
    this.disabled = false;
    this.newRecord();
  }

  getPatternsList() {
    this.patternService.getAllPatterns(this.pageSize, this.page, this.search).subscribe(
      results => {
        this.patternList = results.data;
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
    this.getPatternsList();
  }

  getpatternById(id) {
    Helpers.setLoading(true);
    this.patternService.getPatternById(id).subscribe(
      results => {
        this.patternObj = results;
        Helpers.setLoading(false);
      },
      error => {
        this.globalErrorHandler.handleError(error);
        Helpers.setLoading(false);
      });
  }


  onSubmit({ value, valid }: { value: any, valid: boolean }) {
    this.isFormSubmitted = true;
    if (valid)
      this.savePattern(this.patternObj);
  }

  savePattern(value) {
    Helpers.setLoading(true);
    if (this.params) {
      this.patternService.updatePattern(value)
        .subscribe(
        results => {
          this.getPatternsList();
          this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: results.message });
          this.isFormSubmitted = false;
          this.newRecord();
          Helpers.setLoading(false);

        },
        error => {
          this.globalErrorHandler.handleError(error);
          Helpers.setLoading(false);
        });
    } else {
      this.patternService.createPattern(value)
        .subscribe(
        results => {
          this.getPatternsList();
          this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: results.message });
          this.isFormSubmitted = false;
          this.newRecord();
          Helpers.setLoading(false);

        },
        error => {
          this.globalErrorHandler.handleError(error);
          Helpers.setLoading(false);
        });
    }
  }

  onEditClick(pattern: Pattern) {
    this.patternService.perPage = this.pageSize;
    this.patternService.currentPos = this.page;
    this.getpatternById(pattern.id);
    this.params = pattern.id;
    this.toggleDiv = true;
    this.disabled = true;
    this.isFormSubmitted = false;
    window.scrollTo(0, 0);
  }

  onDelete(pattern: Pattern) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        Helpers.setLoading(true);
        this.patternService.deletePattern(pattern.id).subscribe(
          results => {
            this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: results.message });
            this.getPatternsList();
            this.isFormSubmitted = false;
            this.newRecord();
            Helpers.setLoading(false);
          },
          error => {
            this.globalErrorHandler.handleError(error);
            Helpers.setLoading(false);
          })
      },
      reject: () => {
      }
    });
  }
}
