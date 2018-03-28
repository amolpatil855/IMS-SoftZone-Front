import { Component, OnInit, ViewEncapsulation, AfterViewInit, NgModule } from '@angular/core';
import { Helpers } from '../../../../helpers';
import { ScriptLoaderService } from '../../../../_services/script-loader.service';
import { GlobalErrorHandler } from '../../../../_services/error-handler.service';
import { MessageService } from '../../../../_services/message.service';
import { UserService } from "../../../pages/default/_services/user.service";

import * as _ from 'lodash/index';
import { DashboardService } from "../_services/dashboard.service";
@Component({
  selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
  templateUrl: "./index.component.html",
  encapsulation: ViewEncapsulation.None,

})
export class IndexComponent implements OnInit, AfterViewInit {
  dashboardObj: any;
  selectedSchoolId: number;
  userRole: string;
  superAdmin: any;
  selectSchool: boolean = true;
  showDashboardForAdmin: boolean = true;
  showDashboardForCustomer: boolean = false;
  dashBoardDetails = {
    "dueAmount": 0,
    "paidAmount": 0,
    "toatalStudnetCount": 0
  };
  schoolList = [];
  constructor(private _script: ScriptLoaderService, private messageService: MessageService, private globalErrorHandler: GlobalErrorHandler, private userService: UserService, private dashboardService: DashboardService) {

  }
  ngOnInit() {
    this.selectedSchoolId = 0;
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.superAdmin = _.find(currentUser.roles, { 'name': 'SuperAdmin' });
    this.getLoggedInUserDetail();
    this.getDashboard();
  }

  getLoggedInUserDetail(){
    Helpers.setLoading(true);
    this.userService.getLoggedInUserDetail().subscribe(res => {
      this.userRole = res.mstRole.roleName;
      if(this.userRole == "Customer") {
        this.showDashboardForAdmin = false;
        this.showDashboardForCustomer = true;
      }else{
        this.showDashboardForAdmin = true;
        this.showDashboardForCustomer = false;
      }
      Helpers.setLoading(false);
    });
  }


  getDashboard(){
    this.dashboardService.getDashboard().subscribe( result =>{
      this.dashboardObj = result;
    });
  }

  ngAfterViewInit() {
    this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
      'assets/app/js/dashboard.js');

  }

}
