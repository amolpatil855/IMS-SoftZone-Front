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
import { ShadeService } from "../../../_services/shade.service";
import { FomSizeService } from "../../../_services/fomSize.service";
import { CustomerService } from "../../../_services/customer.service";
import {
  DataTableModule,
  SharedModule,
  ButtonModule,
  AutoCompleteModule,
  DropdownModule,
  OverlayPanelModule,
  DialogModule,
  CalendarModule,
  RadioButtonModule,
  ConfirmDialogModule,
  ConfirmationService,
} from 'primeng/primeng';
import { SupplierService } from "../../../_services/supplier.service";
import { TrnCustomerOrderService } from "../../../_services/trnCustomerOrder.service";
import { TrnCustomerOrderListComponent } from "./trnCustomerOrder-list/trnCustomerOrder-list.component";
import { TrnCustomerOrderAddEditComponent } from "./trnCustomerOrder-add-edit/trnCustomerOrder-add-edit.component";
import { TrnProductStockService } from "../../../_services/trnProductStock.service";
import { MatSizeService } from "../../../_services/matSize.service";
import { TrnCustomerOrderComponent } from "./trnCustomerOrder.component";
import { TrnSalesOrderService } from '../../../_services/trnSalesOrder.service';
const routes: Routes = [
  {
    path: "",
    component: DefaultComponent,
    children: [
      {
        path: "",
        component: TrnCustomerOrderComponent,
        children: [
          {
            path: 'list',
            component: TrnCustomerOrderListComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['customerLogin']
            }
          },
          {
            path: 'add',
            component: TrnCustomerOrderAddEditComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['customerLogin']
            }
          },
          {
            path: 'edit/:id',
            component: TrnCustomerOrderAddEditComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['customerLogin']
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
    CalendarModule,
    OverlayPanelModule,
    DialogModule,
    RadioButtonModule,
    ConfirmDialogModule
  ],
  declarations: [
    TrnCustomerOrderComponent,
    TrnCustomerOrderListComponent,
    TrnCustomerOrderAddEditComponent
  ],
  providers: [
    // RoleService,
    TrnProductStockService,
    TrnCustomerOrderService,
    ConfirmationService,
    SupplierService,
    CommonService,
    CollectionService,
    MatSizeService,
    TrnSalesOrderService,
    ShadeService,
    FomSizeService,
    CustomerService
  ],
})
export class TrnCustomerOrderModule {
}
