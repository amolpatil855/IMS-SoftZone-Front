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
import { SupplierService } from "../../_services/supplier.service";
import { StockEnquiryService } from "../../_services/stockEnquiry.service";
import { StockEnquiryComponent } from "./stockEnquiry.component";
import { StockEnquiryListComponent } from "./stockEnquiry-list/stockEnquiry-list.component";
import { StockEnquiryAddEditComponent } from "./stockEnquiry-add-edit/stockEnquiry-add-edit.component";
import {TrnProductStockService} from "../../_services/trnProductStock.service";

const routes: Routes = [
  {
    path: "",
    component: DefaultComponent,
    children: [
      {
        path: "",
        component: StockEnquiryComponent,
        children: [
          {
            path: 'list',
            component: StockEnquiryListComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['customerLogin']
            }
          },
          {
            path: 'add',
            component: StockEnquiryAddEditComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['customerLogin']
            }
          },
          {
            path: 'edit/:id',
            component: StockEnquiryAddEditComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['customerLogin']
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
    ConfirmDialogModule,
    CalendarModule
  ],
  declarations: [
    StockEnquiryComponent,
    StockEnquiryListComponent,
    StockEnquiryAddEditComponent
  ],
  providers: [
    // RoleService,
    TrnProductStockService,
    StockEnquiryService,
    ConfirmationService,
    SupplierService,
    CommonService,
    CollectionService,
  ],
})
export class StockEnquiryModule {
}
