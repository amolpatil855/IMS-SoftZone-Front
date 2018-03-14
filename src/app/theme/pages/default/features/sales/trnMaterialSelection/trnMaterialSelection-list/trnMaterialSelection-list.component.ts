import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash/index';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { ConfirmationService, DataTableModule, LazyLoadEvent, SelectItem } from 'primeng/primeng';
import { GlobalErrorHandler } from '../../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../../_services/message.service';
import { TrnMaterialSelectionService } from '../../../../_services/trnMaterialSelection.service';
import { UserService } from "../../../../_services/user.service";
import { ScriptLoaderService } from '../../../../../../../_services/script-loader.service';
import { Helpers } from "../../../../../../../helpers";
import { TrnMaterialSelection } from "../../../../_models/trnMaterialSelection";
@Component({
  selector: "app-trnMaterialSelection-list",
  templateUrl: "./trnMaterialSelection-list.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class TrnMaterialSelectionListComponent implements OnInit {
  trnMaterialSelectionForm: any;
  trnMaterialSelectionObj: any;
  params: number;
  userRole: string;
  adminFlag: boolean = false;
  status: boolean = false;
  trnMaterialSelectionList = [];
  pageSize = 50;
  page = 1;
  totalCount = 0;
  search = '';
  tableEmptyMesssage = 'Loading...';
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private trnMaterialSelectionService: TrnMaterialSelectionService,
    private userService: UserService,
    private globalErrorHandler: GlobalErrorHandler,
    private confirmationService: ConfirmationService,
    private messageService: MessageService) {
  }

  ngOnInit() {
    this.getLoggedInUserDetail();
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

  onApprove(materialSelectionObj) {
    if (materialSelectionObj.isQuotationCreated)
      this.router.navigate(['/features/sales/trnMaterialQuotation/list']);
    else
      this.router.navigate(['/features/sales/trnMaterialQuotation/add'], { queryParams: { materialSelectionId: materialSelectionObj.id } });
  }

  getTrnMaterialSelectionsList() {
    this.trnMaterialSelectionService.getAllTrnMaterialSelections(this.pageSize, this.page, this.search).subscribe(
      results => {
        this.trnMaterialSelectionList = results.data;
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
    this.getTrnMaterialSelectionsList();
  }

  onEditClick(trnMaterialSelection: TrnMaterialSelection) {
    this.router.navigate(['/features/sales/trnMaterialSelection/edit', trnMaterialSelection.id]);
  }

  onDelete(trnMaterialSelection: TrnMaterialSelection) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        this.trnMaterialSelectionService.deleteTrnMaterialSelection(trnMaterialSelection.id).subscribe(
          results => {
            this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: results.message });
            this.getTrnMaterialSelectionsList();
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
    this.router.navigate(['/features/sales/trnMaterialSelection/add']);
  }

}
