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

import { TrnSalesOrderService } from "../../../_services/trnSalesOrder.service";
import { TrnSalesOrderComponent } from "./trnSalesOrder.component";
import { TrnSalesOrderListComponent } from "./trnSalesOrder-list/trnSalesOrder-list.component";

const routes: Routes = [
  {
    path: "",
    component: DefaultComponent,
    children: [
      {
        path: "",
        component: TrnSalesOrderComponent,
        children: [
          {
            path: 'list',
            component: TrnSalesOrderListComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['salesorder']
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
    TrnSalesOrderComponent,
    TrnSalesOrderListComponent,
  ],
  providers: [
    // RoleService,
    TrnSalesOrderService,
    ConfirmationService
  ],
})
export class TrnSalesOrderModule {
}
