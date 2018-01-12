/** Angular Dependencies */
import { OnInit, Component } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import * as _ from 'lodash/index';

import { MessageService } from '../../../../../../_services/message.service';
import { RoleService, UserRoleService } from '../../../_services/index';
import { Role } from "../../../_models/role";

/** Component Declaration */
@Component({
  selector: 'app-user-role',
  templateUrl: './user-role.component.html',
})

export class UserRoleComponent implements OnInit {
  params: number;
  userRole: any;
  userName: string = '';
  roleList: any;
  roleDropdown: any;
  selectedRole: any = null;

  constructor(
    private route: ActivatedRoute,
    private roleService: RoleService,
    private messageService: MessageService,
    private userRoleService: UserRoleService,
    private router: Router) { }

  ngOnInit() {
    this.userRole = [];
    this.route.params.forEach((params: Params) => {
      this.params = Number(params['id']);
      this.getAllRoles();
    });
  }

  getAllRoles() {
    this.roleService.getAllRoles()
      .subscribe(
      results => {
        this.roleDropdown = <any>results;
        this.getUserRole();
      });
  }

  getUserRole() {
    this.userRoleService.getUserRole(this.params)
      .subscribe(
      (results: any) => {
        this.userName = results.username;
        this.userRole = results.roles;
        if (this.userRole.length > 0) {
          this.selectedRole = _.find(this.roleDropdown, { id: this.userRole[0].id });
        }
      });
  }

  onAssignRole() {
    if (this.selectedRole !== '' && this.selectedRole !== null) {
      let params = {
        principalType: "USER",
        principalId: this.params,
        roleId: this.selectedRole.id
      }
      this.userRoleService.addUserRole(params)
        .subscribe(
        results => {
          this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Role assigned to user Successfully' });
          this.selectedRole = null;
          this.getUserRole();
        });
    }
  }

  onRevokeRole() {
    // role.userId = this.params;
    // this.userRoleService.revokeUserRole(role)
    //     .subscribe(
    //     results => {
    //         this.getUserRole();
    //     });
  }
}

