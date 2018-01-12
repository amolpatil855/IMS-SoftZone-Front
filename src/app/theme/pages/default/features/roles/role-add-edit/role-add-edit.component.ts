/** Angular Dependencies */
import { OnInit, Component } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import * as _ from 'lodash/index';

import { GlobalErrorHandler } from '../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../_services/message.service';

import { RoleService, PermissionService } from '../../../_services/index';
import { Role } from "../../../_models/Role";
import { Helpers } from "../../../../../../helpers";

/** Component Declaration */
@Component({
  selector: 'app-role-add-edit',
  templateUrl: './role-add-edit.component.html',
})

export class RoleAddEditComponent implements OnInit {
  errorMessage: any;
  params: number;
  permissionList: any;
  filteredPermissionList: any;
  selectedPermission: any;
  rolePermissionList: any;
  roleForm: FormGroup;
  roleName: string;
  menuList: any;
  featureList: any;
  selectedFeature: any;
  isMenuSelected: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private roleService: RoleService,
    private permissionService: PermissionService,
    private route: ActivatedRoute,
    private router: Router,
    private globalErrorHandler: GlobalErrorHandler,
    private messageService: MessageService) {
  }
  ngOnInit() {
    this.filteredPermissionList = [];
    this.permissionList = [];
    this.featureList = [];
    this.rolePermissionList = [];
    this.roleForm = this.formBuilder.group({
      id: [],
      displayName: ['', [Validators.required]],
      name: [''],
      description: [''],
    });
    this.route.params.forEach((params: Params) => {
      this.params = params['roleId'];
      if (this.params) {
        Helpers.setLoading(true);
        this.roleService.getRoleById(this.params)
          .subscribe((results: any) => {
            Helpers.setLoading(false);
            this.rolePermissionList = results.permissions ? results.permissions : [];
            this.getAllFeatures();
            // this.getPermissionsByRole();
            this.roleName = results.name;
            this.roleForm.setValue({
              id: results.id,
              displayName: results.displayName,
              name: results.name,
              description: results.description
            });
          }, error => {
            Helpers.setLoading(false);
            this.globalErrorHandler.handleError(error);
          })
      }
    });
  }

  onSubmit({ value, valid }: { value: any, valid: boolean }) {
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    var schoolId = JSON.parse(localStorage.getItem('schoolId'));
    if (this.params) {
      value.schoolId = schoolId;
      this.roleService.updateRole(value)
        .subscribe(
        results => {
          this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Record Updated Successfully' });
          this.router.navigate(['/features/roles/list']);
        },
        error => {
          this.globalErrorHandler.handleError(error);
        });
    } else {
      value.name = value.displayName;
      value.schoolId = schoolId;
      this.roleService.createRole(value)
        .subscribe(
        results => {
          this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Record Added Successfully' });
          this.router.navigate(['/features/roles/list']);
        },
        error => {
          this.globalErrorHandler.handleError(error);
        });
    }
  }

  onAddPermission() {
    let params = {
      permissionName: this.selectedPermission.permissionName,
      permissionId: this.selectedPermission.id,
      roleId: this.params,
    }
    this.permissionService.addPermissionToRole(params)
      .subscribe(
      results => {
        this.getPermissionsByRole();
        this.selectedPermission = null;
        this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Permission Added' });
      }, error => {
        this.globalErrorHandler.handleError(error);
      });
  }

  revokePermission(permission: any) {
    this.permissionService.revokePermission(permission.id).subscribe(
      results => {
        this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'permission Deleted Successfully' });
        this.getPermissionsByRole();
      },
      error => {
        this.globalErrorHandler.handleError(error);
      })
  }
  onCancel() {
    this.router.navigate(['/features/roles/list']);
  }
  private getPermissionsByRole() {
    this.permissionService.getPermissionsByRole(this.params).subscribe(
      results => {
        this.rolePermissionList = results.permissions ? results.permissions : [];
        this.updatePermissionList(this.rolePermissionList);
        // this.featureList = this.getFilteredFeatureList();
        this.getfilteredPermissions(null);
      },
      error => {
        this.globalErrorHandler.handleError(error);
      })
  }

  private updatePermissionList(rolePermissionList) {
    for (let i = 0; i < rolePermissionList.length; i++) {
      let rolePermission = rolePermissionList[i];
      let permission = rolePermission.permissionName.split(".");
      if (permission.length > 1) {
        let feature = _.find(this.menuList, { id: rolePermission.menuId });
        rolePermission.text = "Can " + permission[1] + " " + feature.menuName;
      }
    }
  }

  private getAllFeatures() {
    this.permissionService.getMenus()
      .subscribe(
      results => {
        this.featureList = results;
        this.menuList = results;
        this.updatePermissionList(this.rolePermissionList);
        // this.featureList = this.getFilteredFeatureList();               
      },
      error => {
        this.globalErrorHandler.handleError(error);
      });
  }

  private getFilteredFeatureList() {
    if (this.selectedFeature) {
      let featureList = [];
      for (var index = 0; index < this.menuList.length; index++) {
        if (this.selectedFeature.id == this.menuList[index].id) {
          let count = _.filter(this.rolePermissionList, { menuId: this.menuList[index].id }).length;
          if (count != this.permissionList.length) {
            featureList.push(this.menuList[index]);
          }
        } else {
          featureList.push(this.menuList[index]);
        }
      }
      let selectedFeature = _.find(featureList, { id: this.selectedFeature.id });
      if (!selectedFeature) {
        this.selectedFeature = null;
      }
      return featureList;
    } else {
      return this.menuList;
    }
  }

  getFeaturePermissions(feature) {
    if (feature) {
      this.isMenuSelected = true
      this.permissionService.getPermissionsByMenuId(feature.id)
        .subscribe(
        results => {
          this.isMenuSelected = false;
          this.permissionList = results;
          this.getfilteredPermissions(feature.menuName)
        },
        error => {
          this.globalErrorHandler.handleError(error);
        });
    } else {
      this.permissionList = [];
      this.filteredPermissionList = [];
    }
  }

  private getfilteredPermissions(menuName) {
    this.filteredPermissionList = [];
    for (let i = 0; i < this.permissionList.length; i++) {
      let permission = this.permissionList[i];
      let rolePermissionData = _.find(this.rolePermissionList, { permissionName: permission.permissionName })
      if (rolePermissionData == null) {
        if (permission.permissionName) {
          let permissionName = permission.permissionName.split(".");
          if (permissionName.length > 1) {
            permission.text = "Can " + permissionName[1] + " " + this.selectedFeature.menuName;
          }
        }
        this.filteredPermissionList.push(permission);
      }
    }
  }
}
