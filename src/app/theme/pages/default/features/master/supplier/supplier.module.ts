import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { DefaultComponent } from "../../../default.component";
import { AuthGuard } from "../../../../../../auth/_guards/auth.guard";
import { LayoutModule } from "../../../../../layouts/layout.module";
// import { RoleService, PermissionService } from '../../_services/index';
import { CommonService } from '../../../_services/common.service';
import {
  DataTableModule,
  SharedModule,
  ButtonModule,
  AutoCompleteModule,
  DropdownModule,
  ConfirmDialogModule,
  ConfirmationService,
} from 'primeng/primeng';

import { SupplierService } from "../../../_services/supplier.service";
import { SupplierComponent } from "./supplier.component";
import { SupplierListComponent } from "./supplier-list/supplier-list.component";

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
  ],
  providers: [
    CommonService,
    SupplierService,
    ConfirmationService
  ],
})
export class SupplierModule {
}
