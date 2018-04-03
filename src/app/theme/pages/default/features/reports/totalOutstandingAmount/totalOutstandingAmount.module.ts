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
import { TotalOutstandingAmountComponent } from "./totalOutstandingAmount.component";
import { TotalOutstandingAmountListComponent } from "./totalOutstandingAmount-list/totalOutstandingAmount-list.component";
import {TrnProductStockService} from "../../../_services/trnProductStock.service";
import {MatSizeService} from "../../../_services/matSize.service";

const routes: Routes = [
  {
    path: "",
    component: DefaultComponent,
    children: [
      {
        path: "",
        component: TotalOutstandingAmountComponent,
        children: [
          {
            path: 'list',
            component: TotalOutstandingAmountListComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['unpaidinvoicelist']
            }
          }
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
    TotalOutstandingAmountComponent,
    TotalOutstandingAmountListComponent
  ],
  providers: [
    TrnProductStockService,
    TrnSalesInvoiceService,
    ConfirmationService,
    SupplierService,
    CommonService,
    CollectionService,
    MatSizeService
  ],
})
export class TotalOutstandingAmountModule {
}
