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
import { MasterPriceListComponent } from "./masterPriceList.component";
import { MasterPriceListListComponent } from "./masterPriceList-list/masterPriceList-list.component";
import { MasterPriceListService } from "../../../_services/masterPriceList.service";

const routes: Routes = [
  {
    path: "",
    component: DefaultComponent,
    children: [
      {
        path: "",
        component: MasterPriceListListComponent,
        children: [
          {
            path: 'list',
            component: MasterPriceListListComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['masterpricelist']
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
    MasterPriceListComponent,
    MasterPriceListListComponent
  ],
  providers: [
    MasterPriceListService,
    ConfirmationService,
    CommonService,
    CollectionService,
  ],
})
export class MasterPriceListModule {
}
