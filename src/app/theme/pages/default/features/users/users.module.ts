import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { DefaultComponent } from '../../default.component';
import { LayoutModule } from '../../../../layouts/layout.module';

import { AuthGuard } from "../../../../../auth/_guards/auth.guard";
import { UserService, RoleService, UserRoleService } from '../../_services/index';
import { UsersComponent } from './users.component';
import { UsersListComponent } from './users-list/users-list.component';
import { UserRoleComponent } from './user-role/user-role.component';
import { UserAddEditComponent } from './user-add-edit/user-add-edit.component';

import {
  DataTableModule,
  SharedModule,
  ButtonModule,
  DropdownModule,
  ConfirmDialogModule,
  ConfirmationService,
} from 'primeng/primeng';

const routes: Routes = [
  {
    path: "",
    component: DefaultComponent,
    children: [
      {
        path: "",
        component: UsersComponent,
        children: [
          {
            path: 'list',
            component: UsersListComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['user']
            }
          },
          {
            path: 'manage-role/:id',
            component: UserRoleComponent,
          },
          {
            path: 'add',
            component: UserAddEditComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['user']
            }
          },
          {
            path: 'edit/:userId',
            component: UserAddEditComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['user']
            }
          },
        ]
      }
    ]
  },
];

@NgModule({
  imports: [
    CommonModule, RouterModule.forChild(routes),
    LayoutModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    // primeng modules
    DataTableModule,
    SharedModule,
    ButtonModule,
    DropdownModule,
    ConfirmDialogModule
  ],
  declarations: [
    UsersComponent,
    UsersListComponent,
    UserRoleComponent,
    UserAddEditComponent,
  ],
  providers: [
    UserService,
    RoleService,
    UserRoleService,
    ConfirmationService
  ],
})
export class UsersModule {
}
