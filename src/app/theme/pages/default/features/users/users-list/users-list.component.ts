/** Angular Dependencies */
import { OnInit, Component,ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import * as _ from 'lodash/index';

import { ConfirmationService,LazyLoadEvent } from 'primeng/primeng';
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
  userList: any;
  userForm: FormGroup;
  userRole: string;
  instituteList: any;
  schoolList: any;
  _tempSchoolList: any;
  selectedInstitute: any;
  roleList: any;
  userTypeList: any;
  roleId=null;
  selectedSchoolsValidationError: boolean = false;
  hideInstituteAndSchool: boolean = false;
  relatedSchoolList: any;
  currentUser: any;
  pageSize=50;
  page=1;
  totalCount=0;
  search='';
  toggleDiv=false;
  isFormSubmitted=false;
  butDisabled: boolean = false;
  disableButton: boolean = false;
  disableEditDeleteButton: boolean = true;
  tableEmptyMesssage='Loading...';
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
    this.roleService.getRoleLookup().subscribe(
      results => {
        this.roleList = results;
        console.log('this.roleList', this.roleList);
        this.roleList.unshift({ value: null , label: '--Select--'  });
      },
      error => {
        this.globalErrorHandler.handleError(error);
      });
      
     this.userService.getAllUserType().subscribe(
      results => {
        this.userTypeList = results;
        console.log('this.userTypeList', this.userTypeList);
        this.userTypeList.unshift({ id: null , userTypeName: '--Select--'});
      },
      error => {
        this.globalErrorHandler.handleError(error);
      });
  }

  onUserTypeChange(userTypeId){
    if(userTypeId == 1){
      this.userForm.patchValue({
        role: 1
      });
      this.userForm.get('role').disable(); 
      this.butDisabled = true;
    }
    else{
      if(userTypeId > 1){
      this.roleList.splice(1 , 1);
      this.butDisabled = false;
      this.userForm.get('role').enable(); 
      }else{
        this.roleList = this.roleList;
      }
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
    this.pageSize=event.rows;
    this.page=event.first;
    this.search=  event.globalFilter;
    this.getAllUserList();
  }

  toggleActiveButton(user: User){
    user.isActive = !user.isActive;
   this.userService.updateUser(user)
        .subscribe(
        results => {
           this.getAllUserList();
          this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: results.message });
          Helpers.setLoading(false);
          this.toggleDiv=false;
          this.newRecord();
        },
        error => {
          this.globalErrorHandler.handleError(error);
          Helpers.setLoading(false);
        });
  }

  getAllUserList() {
    this.userService.getAllUsers(this.pageSize,this.page,this.search).subscribe(
      results => {
        this.userList = results.data;
        console.log('this.userList', this.userList);
        
      this.totalCount=results.totalCount;
        if(this.totalCount==0)
        {
          this.tableEmptyMesssage="No Records Found";
        }

        this.userList.forEach(
          user => {
            console.log('user', user);
             if(user.mstRole.roleName === "Customer"){
                this.disableEditDeleteButton = false;
             }  
          }
        );
      },
      error => {
        this.tableEmptyMesssage="No Records Found";
        this.globalErrorHandler.handleError(error);
      });
  }

  getUserById(id){
    this.userService.getUserById(id).subscribe(
      results => {
      this.userForm = this.formBuilder.group({
      id: results.id,
      username: results.userName,
      email: results.email,
      phone: results.phone,
      role: results.roleId,
      userType: results.userTypeId,
  });
    this.roleId = results.roleId;
      },
      error => {
        this.globalErrorHandler.handleError(error);
      });
  }

  onEditClick(user: User) {
   this.userService.perPage = this.pageSize;
   this.userService.currentPos = this.page;
   this.getUserById(user.id);
   this.params=user.id;
   // this.roleService.currentPageNumber = this.currentPageNumber;
   // this.router.navigate(['/features/master/supplier/edit', supplier.id]);
   this.isFormSubmitted=false;
   this.toggleDiv=true;
   this.butDisabled = false;
  }
  
  newRecord(){
    this.params=null;
    this.userForm = this.formBuilder.group({
      id: 0,
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
      role: ['', [Validators.required]],
      userType: [{value: '', disabled: this.butDisabled}, [Validators.required]],
  });
    this.butDisabled = false;
  }

  toggleButton(){
    this.toggleDiv = !this.toggleDiv;
    this.isFormSubmitted=false;
    if(this.toggleDiv && !this.params){
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
                  this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Record Deleted Successfully' });
              this.getAllUserList();
              this.toggleDiv=false;                 
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
    this.isFormSubmitted=true; 
   
      let params ={
        id: value.id,
        username: value.username,
        email: value.email,
        phone: value.phone,
        roleId: this.roleId,
        userTypeId: value.userType,
    }
   
        
      
      if(valid)
      this.saveUser(params);
  }

  saveUser(value) {
    Helpers.setLoading(true);
    if (this.params) {
      this.userService.updateUser(value)
        .subscribe(
        results => {
           this.getAllUserList();
          this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: results.message });
          Helpers.setLoading(false);
          this.toggleDiv=false;
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
          this.toggleDiv=false;
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
