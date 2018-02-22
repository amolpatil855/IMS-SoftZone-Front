import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { DefaultComponent } from "../../../default.component";
import { AuthGuard } from "../../../../../../auth/_guards/auth.guard";
import { LayoutModule } from "../../../../../layouts/layout.module";
// import { RoleService, PermissionService } from '../../_services/index';
import { SupplierService } from '../../../_services/supplier.service';
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

import { AccessoryService } from "../../../_services/accessory.service";
import { AccessoryComponent } from "./accessory.component";
import { AccessoryListComponent } from "./accessory-list/accessory-list.component";

const routes: Routes = [
  {
    path: "",
    component: DefaultComponent,
    children: [
      {
        path: "",
        component: AccessoryComponent,
        children: [
          {
            path: 'list',
            component: AccessoryListComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['accessories']
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
    AccessoryComponent,
    AccessoryListComponent,
  ],
  providers: [
    CommonService,
    SupplierService,
    AccessoryService,
    ConfirmationService
  ],
})
export class AccessoryModule {
}
