import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { DefaultComponent } from "../../../default.component";
import { AuthGuard } from "../../../../../../auth/_guards/auth.guard";
import { LayoutModule } from "../../../../../layouts/layout.module";
import { CollectionService } from '../../../_services/collection.service';
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
  CalendarModule
} from 'primeng/primeng';
import { ItemsBelowReorderLevelComponent } from "./itemsBelowReorderLevel.component";
import { ItemsBelowReorderLevelListComponent } from "./itemsBelowReorderLevel-list/itemsBelowReorderLevel-list.component";
import { ItemsBelowReorderLevelService } from "../../../_services/itemsBelowReorderLevel.service";

const routes: Routes = [
  {
    path: "",
    component: DefaultComponent,
    children: [
      {
        path: "",
        component: ItemsBelowReorderLevelListComponent,
        children: [
          {
            path: 'list',
            component: ItemsBelowReorderLevelListComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['reorderstocklist']
            }
          }
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
    ConfirmDialogModule,
    CalendarModule
  ],
  declarations: [
    ItemsBelowReorderLevelComponent,
    ItemsBelowReorderLevelListComponent
  ],
  providers: [
    ItemsBelowReorderLevelService,
    ConfirmationService,
    CommonService,
    CollectionService,
  ],
})
export class ItemsBelowReorderLevelModule {
}
