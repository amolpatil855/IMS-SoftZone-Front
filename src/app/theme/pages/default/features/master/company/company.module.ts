import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { DefaultComponent } from "../../../default.component";
import { LayoutModule } from "../../../../../layouts/layout.module";
import { AuthGuard } from "../../../../../../auth/_guards/auth.guard";
//import { UserService, RoleService, UserRoleService } from '../../_services/index';

import {
  DataTableModule,
  SharedModule,
  ButtonModule,
  DropdownModule,
  ConfirmDialogModule,
  ConfirmationService,
} from 'primeng/primeng';
import { CompanyComponent } from "./company.component";
import { CompanyAddEditComponent } from "./company-add-edit/company-add-edit.component";


const routes: Routes = [
  {
    path: "",
    component: DefaultComponent,
    children: [
      {
        path: "",
        component: CompanyComponent,
        children: [
          {
            path: 'add',
            component: CompanyAddEditComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['companyinfo']
            }
          },
          {
            path: 'edit/:userId',
            component: CompanyAddEditComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['companyinfo']
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
    HttpModule,
    ReactiveFormsModule,
    // primeng modules
    DataTableModule,
    SharedModule,
    ButtonModule,
    DropdownModule,
    ConfirmDialogModule
  ],
  declarations: [
    CompanyComponent,
    CompanyAddEditComponent,
  ],
  providers: [
    // UserService,
    // RoleService,
    // UserRoleService,
    ConfirmationService
  ],
})
export class CompanyModule {
}
