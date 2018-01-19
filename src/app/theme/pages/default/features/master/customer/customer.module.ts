import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { DefaultComponent } from "../../../default.component";
import { AuthGuard } from "../../../../../../auth/_guards/auth.guard";
import { LayoutModule } from "../../../../../layouts/layout.module";
// import { RoleService, PermissionService } from '../../_services/index';

import {
  DataTableModule,
  SharedModule,
  ButtonModule,
  AutoCompleteModule,
  DropdownModule,
  ConfirmDialogModule,
  ConfirmationService,
} from 'primeng/primeng';
import { CustomerService } from "../../../_services/customer.service";
import { CustomerComponent } from "./customer.component";
import { CustomerListComponent } from "./customer-list/customer-list.component";
import { CustomerAddEditComponent } from "./customer-add-edit/customer-add-edit.component";



const routes: Routes = [
  {
    path: "",
    component: DefaultComponent,
    children: [
      {
        path: "",
        component: CustomerComponent,
        children: [
          {
            path: 'list',
            component: CustomerListComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['customer']
            }
          },
          {
            path: 'add',
            component: CustomerAddEditComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['customer']
            }
          },
          {
            path: 'edit/:roleId',
            component: CustomerAddEditComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['customer']
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
    ReactiveFormsModule,
    // primeng modules
    DataTableModule,
    SharedModule,
    ButtonModule,
    AutoCompleteModule,
    DropdownModule,
    ConfirmDialogModule
  ],
  declarations: [
    CustomerComponent,
    CustomerListComponent,
    CustomerAddEditComponent,
  ],
  providers: [
    // RoleService,
    CustomerService,
    ConfirmationService
  ],
})
export class CustomerModule {
}
