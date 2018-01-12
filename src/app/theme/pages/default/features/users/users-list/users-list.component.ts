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
  moreNextPages() {
    if (this.boundryEnd + 1 <= this.pages) {
      this.boundryStart = this.boundryEnd + 1;
      this.currentPageNumber = this.boundryStart;
      if (this.boundryEnd + this.boundry >= this.pages) {
        this.boundryEnd = this.pages;
      } else {
        this.boundryEnd = this.boundryEnd + this.boundry;
      }
      //this.getQueryDataCount();
    }
    //this.generateCount();


  }

  morePreviousPages() {
    if (this.boundryStart - this.boundry > 0) {
      this.boundryStart = this.boundryStart - this.boundry;
      this.boundryEnd = this.boundryStart + this.boundry - 1;
      this.currentPageNumber = this.boundryEnd;
      //this.getQueryDataCount();
    }
  }

  pageSizeChanged(size) {
    this.perPage = size;
    this.currentPos = 0;
    this.currentPageNumber = 1;
    //this.getQueryDataCount();
  }

  visitFirstPage() {
    if (this.boundryStart > this.boundry) {
      this.currentPos = 0;
      this.currentPageNumber = 1;
      this.boundryStart = 1;
      this.boundryEnd = this.boundry;
      //this.generateCount();
      this.setDisplayPageNumberRange();
      //this.getAllRoles();
    }
  }

  visitLastPage() {
    for (var index = 0; this.currentPos + this.perPage < this.total; index++) {
      this.currentPos += this.perPage;
      this.currentPageNumber++;
    }
    this.boundryStart = 1;
    this.boundryEnd = this.boundry;
    for (var index = 0; this.boundryEnd + 1 <= this.pages; index++) {
      this.boundryStart = this.boundryEnd + 1;

      if (this.boundryEnd + this.boundry >= this.pages) {
        this.boundryEnd = this.pages;
        this.currentPageNumber = this.boundryEnd;
      } else {
        this.boundryEnd = this.boundryEnd + this.boundry;
        this.currentPageNumber = this.boundryEnd;
      }
    }
    //this.boundryEnd = this.pages;
    //this.boundryStart = this.pages - this.boundry + 1;
    //this.generateCount();
    this.setDisplayPageNumberRange();
    //this.getAllRoles();
  }

  backPage() {
    if (this.currentPos - this.perPage >= 0) {
      this.currentPos -= this.perPage;
      this.currentPageNumber--;

      // this.boundryStart--;
      // this.boundryEnd--;
      // this.generateCount();
      this.setDisplayPageNumberRange();
      //this.getAllRoles();
    }
    else {
      this.currentPos = 0;
      this.currentPageNumber = 1;
    }
  }
  nextPage() {
    if (this.currentPos + this.perPage < this.total) {
      this.currentPos += this.perPage;
      this.currentPageNumber++;
      this.boundryStart++;
      // if (this.boundryStart > this.boundryEnd) {
      //     this.boundryStart--;
      //     this.moreNextPages();
      // }
      this.setDisplayPageNumberRange();
    //  this.getAllRoles();
    }
  }

  pageClick(pageNumber) {
    this.currentPos = this.perPage * (pageNumber - 1);
    this.currentPageNumber = pageNumber;
    this.setDisplayPageNumberRange();
   // this.getAllRoles();
  }

  noPrevPage() {
    if (this.currentPos > 0) {
      return true;
    }
    return false;
  }

  setDisplayPageNumberRange() {
    this.currentPos = this.perPage * (this.currentPageNumber - 1);

    if ((this.currentPageNumber * this.perPage) > this.total)
      this.lastPage = this.total;
    else
      this.lastPage = this.currentPageNumber * this.perPage;

    if (this.lastPage >= this.total) {
      this.lastPage = this.total;
    }

    this.firstPageNumber = 1 + this.currentPos;
  }

  noFwrdPage() {
    if (this.currentPos + this.perPage < this.total) {
      return true;
    }
    return false;
  }

  /* Pagination Function's Ends */

  /* Filtering, Sorting, Search functions Starts*/
  searchString(searchString) {
    if (searchString == '') {
      this.searchQuery = '';
      this.searchCountQuery = '';
    } else {
      this.searchQuery = '&filter[where][displayName][like]=%' + searchString + '%';
      this.searchCountQuery = '&[where][displayName][like]=' + searchString + '%';
    }
    this.currentPos = 0;
    this.currentPageNumber = 1;
    this.boundryStart = 1;
    this.boundry = 3;
    this.boundryEnd = this.boundry;
    //this.getQueryDataCount();
    //this.getAllSchools();
  }

  sort(column, sortOrder) {
    if (sortOrder) {
      this.sortUrl = '&filter[order]=' + column + ' DESC';
    } else {
      this.sortUrl = '&filter[order]=' + column + ' ASC';
    }
   // this.getAllRoles();
  }


}
