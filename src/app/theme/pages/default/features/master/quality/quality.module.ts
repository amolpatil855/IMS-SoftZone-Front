import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { DefaultComponent } from "../../../default.component";
import { AuthGuard } from "../../../../../../auth/_guards/auth.guard";
import { LayoutModule } from "../../../../../layouts/layout.module";
// import { RoleService, PermissionService } from '../../_services/index';
import { SupplierService } from '../../../_services/supplier.service';
import { CommonService } from '../../../_services/common.service';
import { QualityService } from '../../../_services/quality.service';
import { HsnService } from '../../../_services/hsn.service';
import {
  DataTableModule,
  SharedModule,
  ButtonModule,
  AutoCompleteModule,
  DropdownModule,
  ConfirmDialogModule,
  ConfirmationService,
} from 'primeng/primeng';

import { CollectionService } from "../../../_services/collection.service";
import { QualityComponent } from "./quality.component";
import { QualityListComponent } from "./quality-list/quality-list.component";

const routes: Routes = [
  {
    path: "",
    component: DefaultComponent,
    children: [
      {
        path: "",
        component: QualityComponent,
        children: [
          {
            path: 'list',
            component: QualityListComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['quality']
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
    QualityComponent,
    QualityListComponent,
  ],
  providers: [
    HsnService,
    QualityService,
    CommonService,
    SupplierService,
    CollectionService,
    ConfirmationService
  ],
})
export class QualityModule {
}
