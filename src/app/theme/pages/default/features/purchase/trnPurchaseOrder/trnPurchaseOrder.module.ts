import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { DefaultComponent } from "../../../default.component";
import { AuthGuard } from "../../../../../../auth/_guards/auth.guard";
import { LayoutModule } from "../../../../../layouts/layout.module";
import { CollectionService } from '../../../_services/collection.service';
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
  CalendarModule
} from 'primeng/primeng';
import { SupplierService } from "../../../_services/supplier.service";
import { TrnPurchaseOrderService } from "../../../_services/trnPurchaseOrder.service";
import { TrnPurchaseOrderComponent } from "./trnPurchaseOrder.component";
import { TrnPurchaseOrderListComponent } from "./trnPurchaseOrder-list/trnPurchaseOrder-list.component";
import { TrnPurchaseOrderAddEditComponent } from "./trnPurchaseOrder-add-edit/trnPurchaseOrder-add-edit.component";
import {TrnProductStockService} from "../../../_services/trnProductStock.service";
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
    ConfirmDialogModule,
    CalendarModule
  ],
  declarations: [
    TrnPurchaseOrderComponent,
    TrnPurchaseOrderListComponent,
    TrnPurchaseOrderAddEditComponent
  ],
  providers: [
    // RoleService,
    TrnProductStockService,
    TrnPurchaseOrderService,
    ConfirmationService,
    SupplierService,
    CommonService,
    CollectionService
  ],
})
export class TrnPurchaseOrderModule {
}
