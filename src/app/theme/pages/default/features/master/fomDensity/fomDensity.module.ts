import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { DefaultComponent } from "../../../default.component";
import { AuthGuard } from "../../../../../../auth/_guards/auth.guard";
import { LayoutModule } from "../../../../../layouts/layout.module";
import { CommonService } from '../../../_services/common.service';
// import { RoleService, PermissionService } from '../../_services/index';
import { TextMaskModule } from 'angular2-text-mask';
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
    TextMaskModule,
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
    CommonService,
    FomDensityService,
    ConfirmationService
  ],
})
export class FomDensityModule {
}
