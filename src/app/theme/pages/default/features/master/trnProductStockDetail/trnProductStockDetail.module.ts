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

import { TrnProductStockDetailService } from "../../../_services/trnProductStockDetail.service";
import { TrnProductStockDetailComponent } from "./trnProductStockDetail.component";
import { TrnProductStockDetailListComponent } from "./trnProductStockDetail-list/trnProductStockDetail-list.component";

const routes: Routes = [
  {
    path: "",
    component: DefaultComponent,
    children: [
      {
        path: "",
        component: TrnProductStockDetailComponent,
        children: [
          {
            path: 'list',
            component: TrnProductStockDetailListComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['stockmanagement']
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
    TrnProductStockDetailComponent,
    TrnProductStockDetailListComponent,
  ],
  providers: [
    // RoleService,
    TrnProductStockDetailService,
    ConfirmationService
  ],
})
export class TrnProductStockDetailModule {
}
