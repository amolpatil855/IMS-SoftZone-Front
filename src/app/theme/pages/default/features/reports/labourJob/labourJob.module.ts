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
  CalendarModule,
  DropdownModule,
  ConfirmDialogModule,
  ConfirmationService,
} from 'primeng/primeng';

import { LabourJobService } from "../../../_services/labourJob.service";
import { LabourJobComponent } from "./labourJob.component";
import { LabourJobListComponent } from "./labourJob-list/labourJob-list.component";

const routes: Routes = [
  {
    path: "",
    component: DefaultComponent,
    children: [
      {
        path: "",
        component: LabourJobComponent,
        children: [
          {
            path: 'list',
            component: LabourJobListComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['labourjob']
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
    CalendarModule,
    AutoCompleteModule,
    DropdownModule,
    ConfirmDialogModule
  ],
  declarations: [
    LabourJobComponent,
    LabourJobListComponent,
  ],
  providers: [
    // RoleService,
    LabourJobService,
    ConfirmationService
  ],
})
export class LabourJobModule {
}
