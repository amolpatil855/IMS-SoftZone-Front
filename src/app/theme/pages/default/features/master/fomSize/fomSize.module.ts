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

import { FomSizeService } from "../../../_services/fomSize.service";
import { FomSizeComponent } from "./fomSize.component";
import { FomSizeListComponent } from "./fomSize-list/fomSize-list.component";

const routes: Routes = [
  {
    path: "",
    component: DefaultComponent,
    children: [
      {
        path: "",
        component: FomSizeComponent,
        children: [
          {
            path: 'list',
            component: FomSizeListComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['foamsize']
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
    FomSizeComponent,
    FomSizeListComponent,
  ],
  providers: [
    // RoleService,
    FomSizeService,
    ConfirmationService
  ],
})
export class FomSizeModule {
}
