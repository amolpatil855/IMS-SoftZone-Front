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

import { MatSizeService } from "../../../_services/matSize.service";
import { MatSizeComponent } from "./matSize.component";
import { MatSizeListComponent } from "./matSize-list/matSize-list.component";

const routes: Routes = [
  {
    path: "",
    component: DefaultComponent,
    children: [
      {
        path: "",
        component: MatSizeComponent,
        children: [
          {
            path: 'list',
            component: MatSizeListComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['mattresssize']
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
    MatSizeComponent,
    MatSizeListComponent,
  ],
  providers: [
    // RoleService,
    MatSizeService,
    ConfirmationService
  ],
})
export class MatSizeModule {
}
