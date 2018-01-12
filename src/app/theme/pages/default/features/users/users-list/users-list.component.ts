import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { ConfirmationService } from 'primeng/primeng';
import { GlobalErrorHandler } from '../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../_services/message.service';
import { UserService } from '../../../_services/user.service';
import { User } from "../../../_models/user";
import { ScriptLoaderService } from '../../../../../../_services/script-loader.service';
import { Helpers } from "../../../../../../helpers";
import * as _ from 'lodash/index';

@Component({
  selector: "app-users-list",
  templateUrl: "./users-list.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class UsersListComponent implements OnInit {
  userList: Observable<User[]>;
  total: number;         //Number Of records
  currentPos: number;    //Current Page
  perPage: number;       //Number of records to be displayed per page
  firstPageNumber: number;
  lastPage: number;
  currentPageNumber: number; //Stores Current Page Number
  url: string;           //Api url
  sortUrl: string;       //Sort Api Url
  pages: number;         //Number of pages in pagination
  arr: number[] = [];    //Array for Number of pages in pagination
  pageSize: any;         //10,20,30,50,100
  ascSortCol1: boolean;  //Sorting for Column1
  ascSortCol2: boolean;  //Sorting for Column2
  ascSortCol3: boolean;  //Sorting for Column3
  ascSortCol4: boolean;  //Sorting for Column4

  searchQuery: string;   //Search Api Query 
  countQuery: string;    //Count number of records query
  filter1CountQuery: string;  //Count number of records for filter1CountQuery
  filter2CountQuery: string;  //Count number of records for filter2CountQuery
  searchCountQuery: string;
  longList: boolean;     //To show now records found message
  prePageEnable: boolean; //To disable/enable prev page button
  nextPageEnable: boolean; //To disable/enable prev page button
  boundry: number;
  boundryStart: number;
  boundryEnd: number;
  searchValue: string; //HTML values
  selectedPageSize: number = 25; //HTML values
  userRole: string;
  constructor(private userService: UserService,
    private router: Router,
    private globalErrorHandler: GlobalErrorHandler,
    private confirmationService: ConfirmationService,
    private messageService: MessageService) {
  }

  ngOnInit() {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));

  }

  
}
