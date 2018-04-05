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
  dashboardObjForCustomer: any;
  selectedSchoolId: number;
  userRole: string;
  userName: string;
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
  }

  getLoggedInUserDetail(){
    Helpers.setLoading(true);
    this.userService.getLoggedInUserDetail().subscribe(loggedInUser => {
      if(loggedInUser != null){
        this.userRole = loggedInUser.mstRole.roleName;
        this.userName = loggedInUser.userName;
      }  
      if(this.userRole == "Customer") {
        this.showDashboardForAdmin = false;
        this.showDashboardForCustomer = true;
        this.getDashboardDataForCustomer();
      }else{
        this.showDashboardForAdmin = true;
        this.showDashboardForCustomer = false;
        this.getDashboard();
      }
      Helpers.setLoading(false);
    });
  }


  getDashboard(){
    Helpers.setLoading(true);
    this.dashboardService.getDashboard().subscribe( result =>{
      this.dashboardObj = result;
      Helpers.setLoading(false);
    },
    error => {
      this.globalErrorHandler.handleError(error);
      Helpers.setLoading(false);
    });
  }

  getDashboardDataForCustomer(){
    Helpers.setLoading(true);
    this.dashboardService.getDashboardDataForCustomer().subscribe( result =>{
      this.dashboardObjForCustomer = result;
      Helpers.setLoading(false);
    },
    error => {
      this.globalErrorHandler.handleError(error);
      Helpers.setLoading(false);
    });
  }

  ngAfterViewInit() {
    this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
      'assets/app/js/dashboard.js');

  }

}
