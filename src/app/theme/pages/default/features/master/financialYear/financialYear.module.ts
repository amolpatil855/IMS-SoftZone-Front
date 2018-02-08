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

import { FinancialYearService } from "../../../_services/financialYear.service";
import { FinancialYearComponent } from "./financialYear.component";
import { FinancialYearListComponent } from "./financialYear-list/financialYear-list.component";

const routes: Routes = [
  {
    path: "",
    component: DefaultComponent,
    children: [
      {
        path: "",
        component: FinancialYearComponent,
        children: [
          {
            path: 'list',
            component: FinancialYearListComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['financialyear']
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
    FinancialYearComponent,
    FinancialYearListComponent,
  ],
  providers: [
    // RoleService,
    FinancialYearService,
    ConfirmationService
  ],
})
export class FinancialYearModule {
}
