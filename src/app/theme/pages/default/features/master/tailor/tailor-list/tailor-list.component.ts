import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash/index';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { ConfirmationService, DataTableModule, LazyLoadEvent } from 'primeng/primeng';
import { GlobalErrorHandler } from '../../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../../_services/message.service';
import { TailorService } from '../../../../_services/tailor.service';
import { ScriptLoaderService } from '../../../../../../../_services/script-loader.service';
import { Helpers } from "../../../../../../../helpers";
import { Tailor } from "../../../../_models/tailor";
import { CommonService } from '../../../../_services/common.service';

@Component({
  selector: "app-tailor-list",
  templateUrl: "./tailor-list.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class TailorListComponent implements OnInit {
  isFormSubmitted: boolean = false;
  tailorForm: any;
  tailorObj: any;
  params: number;
  tailorList = [];
  patternList = [];
  patternChargeList = [];
  states = [];
  pageSize = 50;
  page = 1;
  totalCount = 0;
  search = '';
  toggleDiv = false;
  tableEmptyMesssage = 'Loading...';
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private tailorService: TailorService,
    private globalErrorHandler: GlobalErrorHandler,
    private confirmationService: ConfirmationService,
    private commonService: CommonService,
    private messageService: MessageService) {
  }
  ngOnInit() {
    this.states = this.commonService.states;
    this.newRecord();
    this.getPatternLookup();
    this.route.params.forEach((params: Params) => {
      this.params = params['id'];
    });
  }

  newRecord() {
    this.params = null;
    this.tailorObj = {
      id: 0,
      name: '',
      phone: '',
      alternatePhone1: '',
      email: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: null,
      pin: '',
      MstTailorPatternChargeDetails: []
    };
  }

  toggleButton() {
    this.toggleDiv = !this.toggleDiv;
    if (this.toggleDiv && !this.params) {
      this.isFormSubmitted = false;
      this.newRecord();
    }

  }
  onCancel() {
    this.toggleDiv = false;
    this.newRecord();
  }
  getTailorsList() {
    Helpers.setLoading(true);
    this.tailorService.getAllTailors(this.pageSize, this.page, this.search).subscribe(
      results => {
        this.tailorList = results.data;
        this.totalCount = results.totalCount;
        if (this.totalCount == 0) {
          this.tableEmptyMesssage = "No Records Found";
        }
        Helpers.setLoading(false);
      },
      error => {
        this.tableEmptyMesssage = "No Records Found";
        this.globalErrorHandler.handleError(error);
        Helpers.setLoading(false);
      });
  }
  loadLazy(event: LazyLoadEvent) {
    this.pageSize = event.rows;
    this.page = event.first/event.rows;
    this.search = event.globalFilter;
    this.getTailorsList();
  }

  getPatternLookup() {
    Helpers.setLoading(true);
    this.tailorService.getPatternLookup().subscribe(
      results => {
        this.patternList = results;
        let vm = this;
         _.forEach(this.patternList, function (selectedItem) {
           vm.patternChargeList.push({
            id: 0,
            name: selectedItem.label,
            patternId: selectedItem.value,
            charge: '',
           });
        });
        
        Helpers.setLoading(false);
      },
      error => {
        this.globalErrorHandler.handleError(error);
        Helpers.setLoading(false);
      });
  }

  onChangeCharge(row) {
    if (!row.charge)
      return;

    row.charge = parseFloat(row.charge);
    
  }

  getTailorById(id) {
    Helpers.setLoading(true);
    this.tailorService.getTailorById(id).subscribe(
      results => {
        this.tailorObj = results;
        Helpers.setLoading(false);
      },
      error => {
        this.globalErrorHandler.handleError(error);
        Helpers.setLoading(false);
      });
  }

  onSubmit({ value, valid }: { value: any, valid: boolean }) {
    this.isFormSubmitted = true;
    this.tailorObj.MstTailorPatternChargeDetails = this.patternChargeList;
    if (valid)
      this.saveTailor(this.tailorObj);
  }

  saveTailor(value) {
    Helpers.setLoading(true);
    if (this.params) {
      this.tailorService.updateTailor(value)
        .subscribe(
        results => {
          this.getTailorsList();
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
      this.tailorService.createTailor(value)
        .subscribe(
        results => {
          this.getTailorsList();
          this.isFormSubmitted = false;
          this.newRecord();
          this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: results.message });
          Helpers.setLoading(false);

        },
        error => {
          this.globalErrorHandler.handleError(error);
          Helpers.setLoading(false);
        });
    }
  }

  onEditClick(tailor: Tailor) {
    this.tailorService.perPage = this.pageSize;
    this.tailorService.currentPos = this.page;
    this.getTailorById(tailor.id);
    this.params = tailor.id;
    this.toggleDiv = true;
    this.isFormSubmitted = false;
    window.scrollTo(0, 0);
  }

  onDelete(tailor: Tailor) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        this.tailorService.deleteTailor(tailor.id).subscribe(
          results => {
            this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: results.message });
            this.getTailorsList();
          },
          error => {
            this.globalErrorHandler.handleError(error);
          })
      },
      reject: () => {
      }
    });
  }
}
