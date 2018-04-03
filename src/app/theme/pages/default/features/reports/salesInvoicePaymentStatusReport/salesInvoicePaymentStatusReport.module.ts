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
import { SalesInvoicePaymentStatusReportComponent } from "./salesInvoicePaymentStatusReport.component";
import {TrnProductStockService} from "../../../_services/trnProductStock.service";
import { SalesInvoicePaymentStatusReportListComponent } from "./salesInvoicePaymentStatusReport-list/salesInvoicePaymentStatusReport.component";

const routes: Routes = [
  {
    path: "",
    component: DefaultComponent,
    children: [
      {
        path: "",
        component: SalesInvoicePaymentStatusReportComponent,
        children: [
          {
            path: 'list',
            component: SalesInvoicePaymentStatusReportListComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['invoicestatuslist']
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
    SalesInvoicePaymentStatusReportComponent,
    SalesInvoicePaymentStatusReportListComponent
  ],
  providers: [
    TrnProductStockService,
    TrnSalesInvoiceService,
    ConfirmationService,
    SupplierService,
    CommonService,
    CollectionService
  ],
})
export class SalesInvoicePaymentStatusReportModule {
}
