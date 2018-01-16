/** Angular Dependencies */
import { OnInit, Component } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import * as _ from 'lodash/index';

import { GlobalErrorHandler } from '../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../_services/message.service';
import { TreeModule, TreeNode } from 'primeng/primeng';
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
  SelectedFeatureList = [];
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
      roleName: ['', [Validators.required]],
      roleDescription: [''],
    });
    this.route.params.forEach((params: Params) => {
      this.params = params['roleId'];
      if (this.params) {
        Helpers.setLoading(true);
        // this.getAllUserMenu(this.params);
        this.getAllMenu();
        this.roleService.getRoleById(this.params)
          .subscribe((results: any) => {
            Helpers.setLoading(false);
            this.rolePermissionList = results.permissions ? results.permissions : [];

            // this.getPermissionsByRole();
            this.roleName = results.roleName;
            this.roleForm.setValue({
              id: results.id,
              roleName: results.roleName,
              roleDescription: results.roleDescription
            });
          }, error => {
            Helpers.setLoading(false);
            this.globalErrorHandler.handleError(error);
          })
      }
    });
   
  }

  getAllMenu() {
    this.permissionService.getAllMenu()
      .subscribe((results: any) => {
        Helpers.setLoading(false);
        var lstRecords = _.forEach(results, function (obj) {
          obj.label = obj.menuName;
          obj.id = obj.id;
        });
        var MainMenu = _.filter(lstRecords, function (o) { return o.menuParentId == null; });
        _.forEach(MainMenu, function (objParrent) {
          objParrent.children = _.filter(lstRecords, function (o) { return o.menuParentId == objParrent.id; });
        });
        this.featureList = MainMenu;
        // this.SelectedFeatureList=MainMenu;  
        // console.log(MainMenu);
        console.log("featureList", MainMenu);
        this.getAllUserMenu(1);
      }, error => {
        Helpers.setLoading(false);
        this.globalErrorHandler.handleError(error);
      })
  }

  getAllUserMenu(id) {
    this.roleService.getRoleMenuById(id)
      .subscribe((results: any) => {
        Helpers.setLoading(false);
        var _featureList = this.featureList;
        var allMenu = _.map(results, 'mstMenu');
        var clildMenu = _.map(_featureList, 'children');
        var _selectedFeatureList = [];
        _.forEach(allMenu, function (obj) {
          var tempResult = _.find(_featureList, function (o) {
            if (o.id == obj.id)
              return o;
          });
          if (tempResult)
            _selectedFeatureList.push(tempResult);
        });

        _.forEach(allMenu, function (obj) {
          for (var i = 0; i < clildMenu.length; i++) {
            var tempResult = _.find(clildMenu[i], function (o) {
              if (o.id == obj.id)
                return o;
            });
            if (tempResult)
              _selectedFeatureList.push(tempResult);
          }
        });
        this.SelectedFeatureList = _selectedFeatureList;
        this.expandAll();
      }, error => {
        Helpers.setLoading(false);
        this.globalErrorHandler.handleError(error);
      })
  }

  expandAll() {
    this.featureList.forEach(node => {
      this.expandRecursive(node, true);
    });
  }

  collapseAll() {
    this.featureList.forEach(node => {
      this.expandRecursive(node, false);
    });
  }

  expandRecursive(node: TreeNode, isExpand: boolean) {
    node.expanded = isExpand;
    if (node.children) {
      node.children.forEach(childNode => {
        this.expandRecursive(childNode, isExpand);
      });
    }
  }

  onSubmit({ value, valid }: { value: any, valid: boolean }) {
    console.log(this.SelectedFeatureList);
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

  onCancel() {
    this.router.navigate(['/features/roles/list']);
  }

}
