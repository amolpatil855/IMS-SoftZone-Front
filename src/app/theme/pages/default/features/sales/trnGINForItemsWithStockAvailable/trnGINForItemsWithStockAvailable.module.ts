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
import { SupplierService } from "../../../_services/supplier.service";
import { TrnGINForItemsWithStockAvailableComponent } from "./trnGINForItemsWithStockAvailable.component";
import { TrnGINForItemsWithStockAvailableListComponent } from "./trnGINForItemsWithStockAvailable-list/trnGINForItemsWithStockAvailable-list.component";
import { TrnGINForItemsWithStockAvailableService } from "../../../_services/trnGINForItemsWithStockAvailable.service";

const routes: Routes = [
  {
    path: "",
    component: DefaultComponent,
    children: [
      {
        path: "",
        component: TrnGINForItemsWithStockAvailableListComponent,
        children: [
          {
            path: 'list',
            component: TrnGINForItemsWithStockAvailableListComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['gin']
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
    TrnGINForItemsWithStockAvailableComponent,
    TrnGINForItemsWithStockAvailableListComponent
  ],
  providers: [
    TrnGINForItemsWithStockAvailableService,
    ConfirmationService,
    SupplierService,
    CommonService,
    CollectionService,
  ],
})
export class TrnGINForItemsWithStockAvailableModule {
}
