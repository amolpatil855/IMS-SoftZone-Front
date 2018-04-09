import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { DefaultComponent } from "../../../default.component";
import { AuthGuard } from "../../../../../../auth/_guards/auth.guard";
import { LayoutModule } from "../../../../../layouts/layout.module";
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
} from 'primeng/primeng';

import { TailorService } from "../../../_services/tailor.service";
import { TailorComponent } from "./tailor.component";
import { TailorListComponent } from "./tailor-list/tailor-list.component";

const routes: Routes = [
  {
    path: "",
    component: DefaultComponent,
    children: [
      {
        path: "",
        component: TailorComponent,
        children: [
          {
            path: 'list',
            component: TailorListComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['agent']
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
    TailorComponent,
    TailorListComponent,
  ],
  providers: [
    // RoleService,
    CommonService,
    TailorService,
    ConfirmationService
  ],
})
export class TailorModule {
}
