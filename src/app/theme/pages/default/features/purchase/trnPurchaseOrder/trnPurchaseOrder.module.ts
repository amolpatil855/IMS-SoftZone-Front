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

import { TrnPurchaseOrderService } from "../../../_services/trnPurchaseOrder.service";
import { TrnPurchaseOrderComponent } from "./trnPurchaseOrder.component";
import { TrnPurchaseOrderListComponent } from "./trnPurchaseOrder-list/trnPurchaseOrder-list.component";
import { TrnPurchaseOrderAddEditComponent } from "./trnPurchaseOrder-add-edit/trnPurchaseOrder-add-edit.component";

const routes: Routes = [
  {
    path: "",
    component: DefaultComponent,
    children: [
      {
        path: "",
        component: TrnPurchaseOrderComponent,
        children: [
          {
            path: 'list',
            component: TrnPurchaseOrderListComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['purchaseorder']
            }
          },
          {
            path: 'add',
            component: TrnPurchaseOrderAddEditComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['purchaseorder']
            }
          },
          {
            path: 'edit/:id',
            component: TrnPurchaseOrderAddEditComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['purchaseorder']
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
    TrnPurchaseOrderComponent,
    TrnPurchaseOrderListComponent,
    TrnPurchaseOrderAddEditComponent
  ],
  providers: [
    // RoleService,
    TrnPurchaseOrderService,
    ConfirmationService
  ],
})
export class TrnPurchaseOrderModule {
}
