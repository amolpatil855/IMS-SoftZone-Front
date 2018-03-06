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
import { TrnSalesInvoiceService } from "../../../_services/trnSalesInvoice.service";
import { TrnSalesInvoiceComponent } from "./trnSalesInvoice.component";
import { TrnSalesInvoiceListComponent } from "./trnSalesInvoice-list/trnSalesInvoice-list.component";
import { TrnSalesInvoiceAddEditComponent } from "./trnSalesInvoice-add-edit/trnSalesInvoice-add-edit.component";
import {TrnProductStockService} from "../../../_services/trnProductStock.service";
import {MatSizeService} from "../../../_services/matSize.service";

const routes: Routes = [
  {
    path: "",
    component: DefaultComponent,
    children: [
      {
        path: "",
        component: TrnSalesInvoiceComponent,
        children: [
          {
            path: 'list',
            component: TrnSalesInvoiceListComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['invoice']
            }
          },
          {
            path: 'add',
            component: TrnSalesInvoiceAddEditComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['invoice']
            }
          },
          {
            path: 'edit/:id',
            component: TrnSalesInvoiceAddEditComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['invoice']
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
    TrnSalesInvoiceComponent,
    TrnSalesInvoiceListComponent,
    TrnSalesInvoiceAddEditComponent
  ],
  providers: [
    // RoleService,
    TrnProductStockService,
    TrnSalesInvoiceService,
    ConfirmationService,
    SupplierService,
    CommonService,
    CollectionService,
    MatSizeService
  ],
})
export class TrnSalesInvoiceModule {
}
