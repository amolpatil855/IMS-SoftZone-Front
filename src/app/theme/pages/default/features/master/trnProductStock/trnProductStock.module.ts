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

import { TrnProductStockService } from "../../../_services/trnProductStock.service";
import { TrnProductStockComponent } from "./trnProductStock.component";
import { TrnProductStockListComponent } from "./trnProductStock-list/trnProductStock-list.component";

const routes: Routes = [
  {
    path: "",
    component: DefaultComponent,
    children: [
      {
        path: "",
        component: TrnProductStockComponent,
        children: [
          {
            path: 'list',
            component: TrnProductStockListComponent,
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
    TrnProductStockComponent,
    TrnProductStockListComponent,
  ],
  providers: [
    // RoleService,
    TrnProductStockService,
    ConfirmationService
  ],
})
export class TrnProductStockModule {
}
