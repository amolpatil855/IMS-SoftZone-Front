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

import { MatThicknessService } from "../../../_services/matThickness.service";
import { MatThicknessComponent } from "./matThickness.component";
import { MatThicknessListComponent } from "./matThickness-list/matThickness-list.component";

const routes: Routes = [
  {
    path: "",
    component: DefaultComponent,
    children: [
      {
        path: "",
        component: MatThicknessComponent,
        children: [
          {
            path: 'list',
            component: MatThicknessListComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['mattressthickness']
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
    MatThicknessComponent,
    MatThicknessListComponent,
  ],
  providers: [
    // RoleService,
    MatThicknessService,
    ConfirmationService
  ],
})
export class MatThicknessModule {
}
