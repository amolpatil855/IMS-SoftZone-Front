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
import { CollectionComponent } from "./collection.component";
import { CollectionListComponent } from "./collection-list/collection-list.component";

const routes: Routes = [
  {
    path: "",
    component: DefaultComponent,
    children: [
      {
        path: "",
        component: CollectionComponent,
        children: [
          {
            path: 'list',
            component: CollectionListComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['collection']
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
    CollectionComponent,
    CollectionListComponent,
  ],
  providers: [
    // RoleService,
    CommonService,
    SupplierService,
    CollectionService,
    ConfirmationService
  ],
})
export class CollectionModule {
}
