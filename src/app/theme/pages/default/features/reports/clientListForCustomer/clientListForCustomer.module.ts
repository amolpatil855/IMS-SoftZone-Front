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
import { ClientListForCustomerComponent } from "./clientListForCustomer.component";
import { ClientListForCustomerListComponent } from "./clientListForCustomer-list/clientListForCustomer-list.component";
import { ClientListForCustomerService } from "../../../_services/clientListForCustomer.service";
import { MatSizeService } from "../../../_services/matSize.service";
import { ShadeService } from "../../../_services/shade.service";
import { FomSizeService } from "../../../_services/fomSize.service";

const routes: Routes = [
  {
    path: "",
    component: DefaultComponent,
    children: [
      {
        path: "",
        component: ClientListForCustomerListComponent,
        children: [
          {
            path: 'list',
            component: ClientListForCustomerListComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['customerLogin']
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
    ClientListForCustomerComponent,
    ClientListForCustomerListComponent
  ],
  providers: [
    ClientListForCustomerService,
    MatSizeService,
    ShadeService,
    FomSizeService,
    ConfirmationService,
    CommonService,
    CollectionService,
  ],
})
export class ClientListForCustomerModule {
}
