import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { ConfirmationService } from 'primeng/primeng';
import { GlobalErrorHandler } from '../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../_services/message.service';

import { RoleService } from '../../../_services/role.service';
import { Role } from "../../../_models/role";
import { ScriptLoaderService } from '../../../../../../_services/script-loader.service';
import { Helpers } from "../../../../../../helpers";
@Component({
  selector: "app-role-list",
  templateUrl: "./role-list.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class RoleListComponent implements OnInit {
  roleList: Observable<Role[]>;
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
  searchQuery: string;   //Search Api Query 
  countQuery: string;    //Count number of records query
  searchCountQuery: string;
  longList: boolean;     //To show now records found message
  prePageEnable: boolean; //To disable/enable prev page button
  nextPageEnable: boolean; //To disable/enable prev page button
  boundry: number;
  boundryStart: number;
  boundryEnd: number;
  searchValue: string; //HTML values
  selectedPageSize: number = 25; //HTML values

  constructor(private router: Router,
    private roleService: RoleService,
    private globalErrorHandler: GlobalErrorHandler,
    private confirmationService: ConfirmationService,
    private messageService: MessageService) {
  }

  ngOnInit() {

    //Page Size Array
    this.pageSize = [];
    this.pageSize.push({ label: '25', value: 25 });
    this.pageSize.push({ label: '50', value: 50 });
    this.pageSize.push({ label: '100', value: 100 });
    this.pageSize.push({ label: '200', value: 200 });
    //Default variable initialization

    this.perPage = this.roleService.perPage;
    this.currentPos = this.roleService.currentPos;
    this.currentPageNumber = this.roleService.currentPageNumber;
    this.selectedPageSize = this.perPage;
    this.url = '';
    this.sortUrl = '&filter[order]=id ASC';
    this.ascSortCol1 = true;
    // this.ascSortCol2 = true;
    // this.ascSortCol3 = true;
    // this.ascSortCol4 = true;
    // this.filterQuery = '';
    // this.filterQuery2 = '';
    this.searchQuery = '';
    this.searchCountQuery = '';
    this.countQuery = '?';
    // this.filter1CountQuery = '';
    // this.filter2CountQuery = '';
    this.lastPage = this.perPage;
    this.firstPageNumber = 1;
    this.prePageEnable = false;
    this.nextPageEnable = true;
    this.boundry = 3;
    this.boundryStart = 1;
    this.boundryEnd = this.boundry;
    this.longList = true;
    
  }

  /*Pagination Function's Starts*/

  currentPageCheck(pageNumber) {
    if (this.currentPageNumber == pageNumber)
      return true;
    else
      return false;
  }
  generateCount() {
    this.arr = [];
    // for (var index = 0; index < this.pages; index++) {
    //     this.arr[index] = index + 1;
    // }
    //If number of pages are less than the boundry
    if (this.pages < this.boundry) {
      this.boundry = this.pages;
      this.boundryEnd = this.boundry;
    }

    for (var index = 0, j = this.boundryStart; j <= this.boundryEnd; index++ , j++) {
      this.arr[index] = j;
    }

    //for()
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
      this.getQueryDataCount();
    }
    //this.generateCount();


  }

  morePreviousPages() {
    if (this.boundryStart - this.boundry > 0) {
      this.boundryStart = this.boundryStart - this.boundry;
      this.boundryEnd = this.boundryStart + this.boundry - 1;
      this.currentPageNumber = this.boundryEnd;
      this.getQueryDataCount();
    }
  }

  pageSizeChanged(size) {
    this.perPage = size;
    this.currentPos = 0;
    this.currentPageNumber = 1;
    this.getQueryDataCount();
  }

  visitFirstPage() {
    if (this.boundryStart > this.boundry) {
      this.currentPos = 0;
      this.currentPageNumber = 1;
      this.boundryStart = 1;
      this.boundryEnd = this.boundry;
      this.generateCount();
      this.setDisplayPageNumberRange();
      this.getAllRoles();
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
    this.generateCount();
    this.setDisplayPageNumberRange();
    this.getAllRoles();
  }

  backPage() {
    if (this.currentPos - this.perPage >= 0) {
      this.currentPos -= this.perPage;
      this.currentPageNumber--;

      // this.boundryStart--;
      // this.boundryEnd--;
      // this.generateCount();
      this.setDisplayPageNumberRange();
      this.getAllRoles();
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
      this.getAllRoles();
    }
  }

  pageClick(pageNumber) {
    this.currentPos = this.perPage * (pageNumber - 1);
    this.currentPageNumber = pageNumber;
    this.setDisplayPageNumberRange();
    this.getAllRoles();
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
    this.getQueryDataCount();
    //this.getAllSchools();
  }

  sort(column, sortOrder) {
    if (sortOrder) {
      this.sortUrl = '&filter[order]=' + column + ' DESC';
    } else {
      this.sortUrl = '&filter[order]=' + column + ' ASC';
    }
    this.getAllRoles();
  }

  /* Counting Number of records starts*/
  getQueryDataCount() {
    this.countQuery = '?' + this.searchCountQuery;
    this.getDataCount(this.countQuery);

  }
  getDataCount(url) {
    // this.schoolService.getRolesCountBySchoolId(url).subscribe((response) => {
    //   this.total = response.count;
    //   this.pages = Math.ceil(this.total / this.perPage);
    //   this.generateCount();
    //   this.setDisplayPageNumberRange();
    //   this.getAllRoles();
    // },
    //   error => {
    //     this.globalErrorHandler.handleError(error);
    //   });
  }
  getUrl() {
    let currentPos = this.currentPos > -1 ? this.currentPos : 0;
    this.url = '?filter[limit]=' + this.perPage + '&filter[skip]=' + this.currentPos + this.sortUrl + this.searchQuery;
  }
  /* Counting Number of records ends*/

  getAllRoles() {
    Helpers.setLoading(true);
    this.getUrl();
   // this.roleList = this.schoolService.getRolesBySchoolId(this.url);
    this.roleList.subscribe((response) => {
      this.longList = response.length > 0 ? true : false;
      if (!this.longList) {
        this.firstPageNumber = 0;
      }
      Helpers.setLoading(false);
    },
      error => {
        this.globalErrorHandler.handleError(error);
        Helpers.setLoading(false);
      });
  }

  onEditClick(role: Role) {
    this.roleService.perPage = this.perPage;
    this.roleService.currentPos = this.currentPos;
    this.roleService.currentPageNumber = this.currentPageNumber;
    this.router.navigate(['/features/roles/edit', role.id]);
  }

  onDelete(role: Role) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        this.roleService.deleteRole(role.id).subscribe(
          results => {
            this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Record Deleted Successfully' });
            if ((this.currentPageNumber - 1) * this.perPage == (this.total - 1)) {
              this.currentPageNumber--;
            }
            this.getQueryDataCount();
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
