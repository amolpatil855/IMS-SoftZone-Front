import { Component, OnInit, ViewEncapsulation, AfterViewInit, NgModule } from '@angular/core';
import { Helpers } from '../../../../helpers';
import { ScriptLoaderService } from '../../../../_services/script-loader.service';
import { GlobalErrorHandler } from '../../../../_services/error-handler.service';
import { MessageService } from '../../../../_services/message.service';

import * as _ from 'lodash/index';
@Component({
  selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
  templateUrl: "./index.component.html",
  encapsulation: ViewEncapsulation.None,

})
export class IndexComponent implements OnInit, AfterViewInit {
  selectedSchoolId: number;
  superAdmin: any;
  selectSchool: boolean = true;
  dashBoardDetails = {
    "dueAmount": 0,
    "paidAmount": 0,
    "toatalStudnetCount": 0
  };
  schoolList = [];
  constructor(private _script: ScriptLoaderService, private messageService: MessageService, private globalErrorHandler: GlobalErrorHandler) {

  }
  ngOnInit() {
    this.selectedSchoolId = 0;
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.superAdmin = _.find(currentUser.roles, { 'name': 'SuperAdmin' });
    //Helpers.setLoading(true);
  }
  ngAfterViewInit() {
    this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
      'assets/app/js/dashboard.js');

  }

}
