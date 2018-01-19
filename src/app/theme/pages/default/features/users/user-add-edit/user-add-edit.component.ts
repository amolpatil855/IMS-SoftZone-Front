/** Angular Dependencies */
import { OnInit, Component } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import * as _ from 'lodash/index';

import { GlobalErrorHandler } from '../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../_services/message.service';

import { UserService, RoleService } from '../../../_services/index';
import { User } from "../../../_models/user";
import { Helpers } from "../../../../../../helpers";

/** Component Declaration */
@Component({
  selector: 'app-user-add-edit',
  templateUrl: './user-add-edit.component.html',
})

export class UserAddEditComponent implements OnInit {
  errorMessage: any;
  params: number;
  userForm: FormGroup;
  userRole: string;
  instituteList: any;
  schoolList: any;
  _tempSchoolList: any;
  selectedInstitute: any;
  roleList: any;
  userTypeList: any;
  selectedSchoolsValidationError: boolean = false;
  hideInstituteAndSchool: boolean = false;
  relatedSchoolList: any;
  currentUser: any;

  constructor(
    private formBuilder: FormBuilder,
    private globalErrorHandler: GlobalErrorHandler,
    private userService: UserService,
    private roleService: RoleService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService) {
  }
  ngOnInit() {
    this.roleList = [];
    this.route.params.forEach((params: Params) => {
      this.params = params['userId'];
    });

    this.roleService.getAllRoles().subscribe(res => { 
      if(res.length > 0){
       this.roleList = res.map(item => item );
      }
    });

    this.userService.getAllUserType().subscribe(res => { 
      if(res.length > 0){
       this.userTypeList = res.map(item => item );
      }
    });
    
    this.userForm = this.formBuilder.group({
        id: 0,
        username: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.pattern('^[0-9]{10,15}$$')]],
        role: ['', [Validators.required]],
        userType: ['', [Validators.required]],
    });
  }

  onSubmit({ value, valid }: { value: any, valid: boolean }) {
      let params = {
        id: value.id,
        username: value.username,
        email: value.email,
        phone: value.phone,
        roleId: value.role,
        userTypeId: value.userType,
      }
      this.saveUser(params);
  }

  saveUser(value) {
    Helpers.setLoading(true);
    if (this.params) {
      this.userService.updateUser(value)
        .subscribe(
        results => {
          this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: results.message });
          Helpers.setLoading(false);
          this.router.navigate(['/features/users/list']);
        },
        error => {
          this.globalErrorHandler.handleError(error);
          Helpers.setLoading(false);
        });
    } else {
      this.userService.createUser(value)
        .subscribe(
        results => {
          this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: results.message });
          Helpers.setLoading(false);
          this.router.navigate(['/features/users/list']);
        },
        error => {
          this.globalErrorHandler.handleError(error);
          Helpers.setLoading(false);
        });
    }
  }

  onCancel() {
    this.router.navigate(['/features/users/list']);
  }
  
}
