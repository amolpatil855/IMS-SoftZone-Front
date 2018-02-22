/** Angular Dependencies */
import { OnInit, Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import * as _ from 'lodash/index';

import { ConfirmationService, LazyLoadEvent } from 'primeng/primeng';
import { GlobalErrorHandler } from '../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../_services/message.service';

import { UserService, RoleService } from '../../../_services/index';
import { User } from "../../../_models/user";
import { Helpers } from "../../../../../../helpers";

@Component({
  selector: "app-users-list",
  templateUrl: "./users-list.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class UsersListComponent implements OnInit {
  errorMessage: any;
  params: number;
  userObj: any;
  userList: any;
  userForm: FormGroup;
  userRole: string;
  instituteList: any;
  schoolList: any;
  _tempSchoolList: any;
  selectedInstitute: any;
  roleList: any;
  userTypeList: any;
  companyLocationList: any;
  role = null;
  selectedSchoolsValidationError: boolean = false;
  hideInstituteAndSchool: boolean = false;
  relatedSchoolList: any;
  currentUser: any;
  pageSize = 50;
  page = 1;
  totalCount = 0;
  search = '';
  toggleDiv = false;
  isFormSubmitted = false;
  butDisabled: boolean = false;
  disableButton: boolean = false;
  tableEmptyMesssage = 'Loading...';
  constructor(
    private formBuilder: FormBuilder,
    private globalErrorHandler: GlobalErrorHandler,
    private userService: UserService,
    private roleService: RoleService,
    private confirmationService: ConfirmationService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService) {
  }
  ngOnInit() {
    this.roleList = [];
    this.userTypeList = [];
    this.companyLocationList = [];
    this.getCompanyLocationLookUp();
    this.userService.getAllUserType().subscribe(
      results => {
        this.userTypeList = results;
        this.userTypeList.unshift({ value: null, label: '--Select--' });
      },
      error => {
        this.globalErrorHandler.handleError(error);
      });
    this.newRecord();
  }

  getCompanyLocationLookUp() {
    Helpers.setLoading(true);
    this.userService.getCompanyLocationLookUp().subscribe(
      results => {
        this.companyLocationList = results;
        this.companyLocationList.unshift({ value: null, label: '--Select--' });
        Helpers.setLoading(false);
      },
      error => {
        this.globalErrorHandler.handleError(error);
        Helpers.setLoading(false);
      });
  }

  onUserTypeChange(userTypeId) {
    if (userTypeId == "null") {
      this.roleList = [];
      this.roleList.unshift({ value: null, label: '--Select--' });
      this.userForm.patchValue({
        userType: this.roleList[0].value,
        role: this.roleList[0].value
      });
      this.butDisabled = false;
      this.userForm.get('role').enable();
    } else {
      if (userTypeId == 1) {
        this.roleService.getRoleLookup(userTypeId).subscribe(
          results => {
            this.roleList = results;
            this.roleList.unshift({ value: null, label: '--Select--' });
            this.userForm.patchValue({
              role: this.roleList[1].value
            });
          },
          error => {
            this.globalErrorHandler.handleError(error);
          });

        this.userForm.get('role').disable();
        this.butDisabled = true;
      }
      else {
        if (userTypeId > 1) {
          this.userForm.patchValue({
            role: null
          });
          this.getRoleList(userTypeId);
          this.butDisabled = false;
          this.userForm.get('role').enable();
        }
      }
    }
  }

  onLocationChange(locationId) {
    if (locationId == "null") {
      this.userForm.patchValue({
        location: null
      });
    }
  }

  onRoleChange(roleId) {
    if (roleId == "null") {
      this.userForm.patchValue({
        role: null
      });
    }
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
    this.page = event.first/event.rows;
    this.search = event.globalFilter;
    this.getAllUserList();
  }

  toggleActiveButton(user: User) {
    user.isActive = !user.isActive;
    this.userService.updateActivateDeActivateUserStatus(user)
      .subscribe(
      results => {
        this.getAllUserList();
        this.messageService.addMessage({ severity: 'success', summary: results.type, detail: results.message });
        Helpers.setLoading(false);
        this.toggleDiv = false;
        this.newRecord();
      },
      error => {
        this.globalErrorHandler.handleError(error);
        Helpers.setLoading(false);
      });
  }

  getAllUserList() {
    this.userService.getAllUsers(this.pageSize, this.page, this.search).subscribe(
      results => {
        this.userList = results.data;
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

  getRoleList(id) {
    this.roleService.getRoleLookup(id).subscribe(
      results => {
        this.roleList = results;
        this.roleList.unshift({ value: null, label: '--Select--' });
      },
      error => {
        this.globalErrorHandler.handleError(error);
      });
  }

  getUserById(id) {
    this.userService.getUserById(id).subscribe(
      results => {
        this.userObj = results;       
        this.getRoleList(results.userTypeId);
        this.userForm.setValue({
          id: results.id,
          username: results.userName,
          email: results.email,
          phone: results.phone,
          location: results.locationId,
          role: results.roleId,
          userType: results.userTypeId,
        });
      },
      error => {
        this.globalErrorHandler.handleError(error);
      });
  }

  onEditClick(user: User) {
    this.userService.perPage = this.pageSize;
    this.userService.currentPos = this.page;
    this.params = user.id;
    this.isFormSubmitted = false;
    this.toggleDiv = true;
    this.getUserById(user.id);
    this.butDisabled = false;
    window.scrollTo(0, 0);
  }

  newRecord() {
    this.params = null;
    this.userForm = this.formBuilder.group({
      id: 0,
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
      location: null,
      role: ['', [Validators.required]],
      userType: [{ value: '', disabled: this.butDisabled }, [Validators.required]],
    });
    this.butDisabled = false;
  }

  toggleButton() {
    this.toggleDiv = !this.toggleDiv;
    this.isFormSubmitted = false;
    if (this.toggleDiv && !this.params) {
      this.newRecord();
    }
  }

  onDelete(user: User) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        this.userService.deleteUser(user.id).subscribe(
          results => {
            this.messageService.addMessage({ severity: 'success', summary: results.type, detail: results.message });
            this.getAllUserList();
            this.toggleDiv = false;
            this.newRecord();
          },
          error => {
            this.globalErrorHandler.handleError(error);
          })
      },
      reject: () => {
      }
    });
  }

  onSubmit({ value, valid }: { value: any, valid: boolean }) {
    this.isFormSubmitted = true;
    let params = {
      id: value.id,
      userName: value.username,
      email: value.email,
      phone: value.phone,
      locationId: value.location,
      roleId: value.role,
      userTypeId: value.userType,
    }
    if (valid)
      this.saveUser(params);
  }

  saveUser(value) {
    Helpers.setLoading(true);
    if (this.params) {
      // this.userObj.userName = value.userName;
      // this.userObj.email = value.email;
      // this.userObj.phone = value.phone;
      // this.userObj.locationId = value.locationId;
      // this.userObj.roleId = value.roleId;
      // this.userObj.userTypeId = value.userTypeId;
      this.userService.updateUser(value)
        .subscribe(
        results => {
          this.getAllUserList();
          this.messageService.addMessage({ severity: 'success', summary: results.type, detail: results.message });
          Helpers.setLoading(false);
          this.toggleDiv = false;
          this.newRecord();
        },
        error => {
          this.globalErrorHandler.handleError(error);
          Helpers.setLoading(false);
        });
    } else {
      this.userService.createUser(value)
        .subscribe(
        results => {
          this.getAllUserList();
          this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: results.message });
          Helpers.setLoading(false);
          this.toggleDiv = false;
          this.newRecord();
        },
        error => {
          this.globalErrorHandler.handleError(error);
          Helpers.setLoading(false);
        });
    }
  }

  onCancel() {
    this.getAllUserList();
    this.toggleButton();
    this.newRecord();
  }
}
