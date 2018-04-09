import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { DefaultComponent } from "../../../default.component";
import { AuthGuard } from "../../../../../../auth/_guards/auth.guard";
import { LayoutModule } from "../../../../../layouts/layout.module";
import { CommonService } from '../../../_services/common.service';
import { TrnProductStockService } from "../../../_services/trnProductStock.service";
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

import { DashboardService } from "../../../_services/dashboard.service";
import { SalesOrderCountComponent } from "./salesOrderCount.component";
import { SalesOrderCountListComponent } from "./salesOrderCount-list/salesOrderCount-list.component";

const routes: Routes = [
  {
    path: "",
    component: DefaultComponent,
    children: [
      {
        path: "",
        component: SalesOrderCountComponent,
        children: [
          {
            path: 'list',
            component: SalesOrderCountListComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['pendingsalesorderlist']
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
    CalendarModule,
    OverlayPanelModule,
    DialogModule,
    RadioButtonModule,
    ConfirmDialogModule
  ],
  declarations: [
    SalesOrderCountComponent,
    SalesOrderCountListComponent
  ],
  providers: [
    CommonService,
    DashboardService,
    ConfirmationService,
    TrnProductStockService
  ],
})
export class SalesOrderCountModule {
}
