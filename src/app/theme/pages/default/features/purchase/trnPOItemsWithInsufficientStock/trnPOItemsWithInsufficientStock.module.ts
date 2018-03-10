import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { DefaultComponent } from "../../../default.component";
import { AuthGuard } from "../../../../../../auth/_guards/auth.guard";
import { LayoutModule } from "../../../../../layouts/layout.module";
import { CollectionService } from '../../../_services/collection.service';
// import { RoleService, PermissionService } from '../../_services/index';
import { TrnPurchaseOrderService } from '../../../_services/trnPurchaseOrder.service';
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
import { TrnPOItemsWithInsufficientStockService } from "../../../_services/TrnPOItemsWithInsufficientStock.service";
import { TrnPOItemsWithInsufficientStockComponent } from "./trnPOItemsWithInsufficientStock.component";
import { TrnPOItemsWithInsufficientStockListComponent } from "./trnPOItemsWithInsufficientStock-list/trnPOItemsWithInsufficientStock-list.component";
import { TrnPOItemsWithInsufficientStockAddEditComponent } from "./trnPOItemsWithInsufficientStock-add-edit/trnPOItemsWithInsufficientStock-add-edit.component";
import {TrnProductStockService} from "../../../_services/trnProductStock.service";
import {MatSizeService} from "../../../_services/matSize.service";

const routes: Routes = [
  {
    path: "",
    component: DefaultComponent,
    children: [
      {
        path: "",
        component: TrnPOItemsWithInsufficientStockComponent,
        children: [
          {
            path: 'list',
            component: TrnPOItemsWithInsufficientStockListComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['purchaseorder']
            }
          },
          {
            path: 'add',
            component: TrnPOItemsWithInsufficientStockAddEditComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['purchaseorder']
            }
          },
          {
            path: 'edit/:id',
            component: TrnPOItemsWithInsufficientStockAddEditComponent,
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
    TrnPOItemsWithInsufficientStockComponent,
    TrnPOItemsWithInsufficientStockListComponent,
    TrnPOItemsWithInsufficientStockAddEditComponent
  ],
  providers: [
    // RoleService,
    TrnProductStockService,
    TrnPOItemsWithInsufficientStockService,
    ConfirmationService,
    SupplierService,
    CommonService,
    TrnPurchaseOrderService,
    CollectionService,
    MatSizeService
  ],
})
export class TrnPOItemsWithInsufficientStockModule {
}
