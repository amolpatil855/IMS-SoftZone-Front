import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { TreeModule, TreeNode } from 'primeng/primeng';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ConfirmationService, DataTableModule, LazyLoadEvent } from 'primeng/primeng';
import { GlobalErrorHandler } from '../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../_services/message.service';
import { Role } from "../../../_models/role";
import { ScriptLoaderService } from '../../../../../../_services/script-loader.service';
import { Helpers } from "../../../../../../helpers";
import { RoleService, MenuPermissionService } from '../../../_services/index';
import * as _ from 'lodash/index';
@Component({
  selector: "app-role-list",
  templateUrl: "./role-list.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class RoleListComponent implements OnInit {
  roleList = [];
  pageSize=50;
  page=1;
  totalCount=0;
  search='';
  cols: any[];
  toggleDiv=false;
  roleForm: FormGroup;
  errorMessage: any;
  params: number;
  permissionList: any;
  filteredPermissionList: any;
  selectedPermission: any;
  rolePermissionList: any;
  roleName: string;
  menuList: any;
  featureList: any;
  SelectedFeatureList = [];
  selectedFeature: any;
  isMenuSelected: boolean = false;
  isFormSubmitted=false;
  tableEmptyMesssage='Loading...';
  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private roleService: RoleService,
    private globalErrorHandler: GlobalErrorHandler,
    private confirmationService: ConfirmationService,
    private permissionService: MenuPermissionService,
    private messageService: MessageService) {
  }

  ngOnInit() {
    this.filteredPermissionList = [];
    this.permissionList = [];
    this.featureList = [];
    this.rolePermissionList = [];
    this.newRecord();
    this.getAllMenu();
  }

  newRecord(){
    this.isFormSubmitted=false;
    this.SelectedFeatureList=[];
    this.params=null;
    this.roleForm = this.formBuilder.group({
      id: 0,
      roleName: ['', [Validators.required]],
      roleDescription: ['']
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
        if (this.params)
          this.getAllUserMenu(this.params);
      }, error => {
        Helpers.setLoading(false);
        this.globalErrorHandler.handleError(error);
      })
  }

  getRoleById(id){
    Helpers.setLoading(true);
    // this.getAllUserMenu(this.params);
    this.roleService.getRoleById(id)
      .subscribe((results: any) => {
        Helpers.setLoading(false);
        this.rolePermissionList = results.permissions ? results.permissions : [];
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
    this.isFormSubmitted=true;
    if (this.SelectedFeatureList.length == 0) {
      this.messageService.addMessage({ severity: 'error', summary: 'Error', detail: "Please select menu for role" });
      return;
    }
    var _CFGRoleMenus = [];
    _.forEach(this.SelectedFeatureList, function (obj) {
      var _CFGRoleMenusObj = {
        "menuId": obj.id
      }
      _CFGRoleMenus.push(_CFGRoleMenusObj);
    });

    if(!valid)
    {
      return;
    }

    value.CFGRoleMenus = _CFGRoleMenus;
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    Helpers.setLoading(true);
    if (this.params) {
      this.roleService.updateRole(value)
        .subscribe(
        results => {
          this.getRoleList();
          this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: results.message });
          Helpers.setLoading(false);
          this.toggleDiv=false;
          this.newRecord();
        },
        error => {
          Helpers.setLoading(false);
          this.globalErrorHandler.handleError(error);
        });
    } else {
      this.roleService.createRole(value)
        .subscribe(
        results => {
          this.getRoleList();
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

  onEditClick(role: Role) {
    this.roleService.perPage = this.pageSize;
    this.roleService.currentPos = this.page;
    this.getRoleById(role.id);
    this.getAllMenu();
    this.params=role.id;
    // this.roleService.currentPageNumber = this.currentPageNumber;
    // this.router.navigate(['/features/master/supplier/edit', supplier.id]);
    this.toggleDiv=true;
  }
  getRoleList() {
    this.roleService.getAllRoles(this.pageSize,this.page,this.search).subscribe(
      results => {
        this.roleList = results.data;
        this.totalCount=results.totalCount;
        if(this.totalCount==0)
        {
          this.tableEmptyMesssage="No Records Found";
        }
      },
      error => {
        this.tableEmptyMesssage="No Records Found";
        this.globalErrorHandler.handleError(error);
      });
  }

  toggleButton(){
    this.toggleDiv = !this.toggleDiv;
    if(this.toggleDiv && !this.params){
      this.newRecord();
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
    this.getRoleList();
  }


  onDelete(role: Role) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        this.roleService.deleteRole(role.id).subscribe(
          results => {
            this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: results.message  });
            this.getRoleList();
          },
          error => {
            this.globalErrorHandler.handleError(error);
          })
      },
      reject: () => {
      }
    });
  }

  onCancel() {
    this.toggleButton();
    this.newRecord();
  }


}
