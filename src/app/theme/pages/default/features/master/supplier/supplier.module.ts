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
import { SupplierComponent } from "./supplier.component";
import { SupplierListComponent } from "./supplier-list/supplier-list.component";
import { SupplierAddEditComponent } from "./supplier-add-edit/supplier-add-edit.component";


const routes: Routes = [
  {
    path: "",
    component: DefaultComponent,
    children: [
      {
        path: "",
        component: SupplierComponent,
        children: [
          {
            path: 'list',
            component: SupplierListComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['supplier']
            }
          },
          {
            path: 'add',
            component: SupplierAddEditComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['supplier']
            }
          },
          {
            path: 'edit/:roleId',
            component: SupplierAddEditComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['supplier']
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
    SupplierComponent,
    SupplierListComponent,
    SupplierAddEditComponent,
  ],
  providers: [
    // RoleService,
    // PermissionService,
    ConfirmationService
  ],
})
export class SupplierModule {
}
