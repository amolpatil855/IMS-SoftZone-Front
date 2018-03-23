import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { DefaultComponent } from "../../default.component";
import { AuthGuard } from "../../../../../auth/_guards/auth.guard";
import { LayoutModule } from "../../../../layouts/layout.module";
import { CollectionService } from '../../_services/collection.service';
// import { RoleService, PermissionService } from '../../_services/index';
import { CommonService } from '../../_services/common.service';
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
import { ProductListingComponent } from "./productListing.component";
import { ProductListingListComponent } from "./productListing-list/productListing-list.component";
import { ProductListingService } from "../../_services/productListing.service";

const routes: Routes = [
  {
    path: "",
    component: DefaultComponent,
    children: [
      {
        path: "",
        component: ProductListingListComponent,
        children: [
          {
            path: 'list',
            component: ProductListingListComponent,
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
    ProductListingComponent,
    ProductListingListComponent
  ],
  providers: [
    ProductListingService,
    ConfirmationService,
    CommonService,
    CollectionService,
  ],
})
export class ProductListingModule {
}
