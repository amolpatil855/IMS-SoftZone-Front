import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash/index';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { ConfirmationService, DataTableModule, LazyLoadEvent, SelectItem } from 'primeng/primeng';
import { GlobalErrorHandler } from '../../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../../_services/message.service';
import { TrnCurtainSelection } from "../../../../_models/trncurtainSelection";
import { UserService } from "../../../../_services/user.service";
import { ScriptLoaderService } from '../../../../../../../_services/script-loader.service';
import { TrnCurtainSelectionService } from '../../../../_services/trnCurtainSelection.service';
import { Helpers } from "../../../../../../../helpers";

@Component({
  selector: "app-trnCurtainSelection-list",
  templateUrl: "./trnCurtainSelection-list.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class TrnCurtainSelectionListComponent implements OnInit {
  params: number;
  userRole: string;
  adminFlag: boolean = false;
  status: boolean = false;
  trnselectionList = [];
  pageSize = 50;
  page = 1;
  totalCount = 0;
  search = '';
  tableEmptyMesssage = 'Loading...';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private trnCurtainSelectionService: TrnCurtainSelectionService,
    private userService: UserService,
    private globalErrorHandler: GlobalErrorHandler,
    private confirmationService: ConfirmationService,
    private messageService: MessageService) {
  }

  ngOnInit() {
    // this.gettrnCurtainSelectionList();
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


  gettrnCurtainSelectionList() {
    this.trnCurtainSelectionService.getAllTrnCurtainSelections(this.pageSize, this.page, this.search).subscribe(
      results => {
        this.trnselectionList = results.data;
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
    //in a real application, make a remote request to load data using state metadata from event
    //event.first = First row offset
    //event.rows = Number of rows per page
    //event.sortField = Field name to sort with
    //event.sortOrder = Sort order as number, 1 for asc and -1 for dec
    //filters: FilterMetadata object having field as key and filter value, filter matchMode as value
    //imitate db connection over a network
    this.pageSize = event.rows;
    this.page = event.first / event.rows;
    this.search = event.globalFilter;
    this.gettrnCurtainSelectionList();
  }

  onEditClick(trnCurtainSelectionObj) {
    this.router.navigate(['/features/sales/trnCurtainSelection/edit',trnCurtainSelectionObj.id]);
  }


  onAddClick() {
    this.router.navigate(['/features/sales/trnCurtainSelection/add']);
  }

}
