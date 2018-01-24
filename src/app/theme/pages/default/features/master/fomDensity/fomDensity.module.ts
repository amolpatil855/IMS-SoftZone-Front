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

import { FomDensityService } from "../../../_services/fomDensity.service";
import { FomDensityComponent } from "./fomDensity.component";
import { FomDensityListComponent } from "./fomDensity-list/fomDensity-list.component";

const routes: Routes = [
  {
    path: "",
    component: DefaultComponent,
    children: [
      {
        path: "",
        component: FomDensityComponent,
        children: [
          {
            path: 'list',
            component: FomDensityListComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['foamdensity']
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
    FomDensityComponent,
    FomDensityListComponent,
  ],
  providers: [
    // RoleService,
    FomDensityService,
    ConfirmationService
  ],
})
export class FomDensityModule {
}
