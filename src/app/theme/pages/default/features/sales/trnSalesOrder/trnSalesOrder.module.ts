import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { DefaultComponent } from "../../../default.component";
import { AuthGuard } from "../../../../../../auth/_guards/auth.guard";
import { LayoutModule } from "../../../../../layouts/layout.module";
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

import { TrnSalesOrderService } from "../../../_services/trnSalesOrder.service";
import { TrnSalesOrderComponent } from "./trnSalesOrder.component";
import { TrnSalesOrderListComponent } from "./trnSalesOrder-list/trnSalesOrder-list.component";
import { TrnSalesOrderAddEditComponent } from "./trnSalesOrder-add-edit/trnSalesOrder-add-edit.component";

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
          {
            path: 'add',
            component: TrnSalesOrderAddEditComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['salesorder']
            }
          },
          {
            path: 'edit/:id',
            component: TrnSalesOrderAddEditComponent,
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
    TrnSalesOrderAddEditComponent
  ],
  providers: [
    CommonService,
    TrnSalesOrderService,
    ConfirmationService
  ],
})
export class TrnSalesOrderModule {
}
