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

import { FomSuggestedMMService } from "../../../_services/fomSuggestedMM.service";
import { FomSuggestedMMComponent } from "./fomSuggestedMM.component";
import { FomSuggestedMMListComponent } from "./fomSuggestedMM-list/fomSuggestedMM-list.component";

const routes: Routes = [
  {
    path: "",
    component: DefaultComponent,
    children: [
      {
        path: "",
        component: FomSuggestedMMComponent,
        children: [
          {
            path: 'list',
            component: FomSuggestedMMListComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['foamsuggestedmm']
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
    FomSuggestedMMComponent,
    FomSuggestedMMListComponent,
  ],
  providers: [
    // RoleService,
    FomSuggestedMMService,
    ConfirmationService
  ],
})
export class FomSuggestedMMModule {
}
