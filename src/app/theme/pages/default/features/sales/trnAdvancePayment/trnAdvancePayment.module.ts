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
import { TrnAdvancePaymentService } from "../../../_services/trnAdvancePayment.service";
import { TrnAdvancePaymentComponent } from "./trnAdvancePayment.component";
import { TrnAdvancePaymentListComponent } from "./trnAdvancePayment-list/trnAdvancePayment-list.component";
import { TrnAdvancePaymentAddEditComponent } from "./trnAdvancePayment-add-edit/trnAdvancePayment-add-edit.component";
import { TrnProductStockService } from "../../../_services/trnProductStock.service";
import { MatSizeService } from "../../../_services/matSize.service";
import { TrnGINForItemsWithStockAvailableService } from '../../../_services/trnGINForItemsWithStockAvailable.service';
const routes: Routes = [
  {
    path: "",
    component: DefaultComponent,
    children: [
      {
        path: "",
        component: TrnAdvancePaymentComponent,
        children: [
          {
            path: 'list',
            component: TrnAdvancePaymentListComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['advancepayment']
            }
          },
          {
            path: 'add',
            component: TrnAdvancePaymentAddEditComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['advancepayment']
            }
          },
          {
            path: 'edit/:id',
            component: TrnAdvancePaymentAddEditComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['advancepayment']
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
    TrnAdvancePaymentComponent,
    TrnAdvancePaymentListComponent,
    TrnAdvancePaymentAddEditComponent
  ],
  providers: [
    // RoleService,
    TrnProductStockService,
    TrnAdvancePaymentService,
    ConfirmationService,
    SupplierService,
    CommonService,
    CollectionService,
    MatSizeService,
    TrnGINForItemsWithStockAvailableService
  ],
})
export class TrnAdvancePaymentModule {
}
