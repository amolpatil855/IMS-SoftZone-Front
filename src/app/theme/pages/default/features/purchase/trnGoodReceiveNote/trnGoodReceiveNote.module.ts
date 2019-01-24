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
import { TrnGoodReceiveNoteService } from "../../../_services/trnGoodReceiveNote.service";
import { TrnGoodReceiveNoteComponent } from "./trnGoodReceiveNote.component";
import { TrnGoodReceiveNoteListComponent } from "./trnGoodReceiveNote-list/trnGoodReceiveNote-list.component";
import { TrnGoodReceiveNoteAddEditComponent } from "./trnGoodReceiveNote-add-edit/trnGoodReceiveNote-add-edit.component";
import { TrnProductStockService } from "../../../_services/trnProductStock.service";
import { MatSizeService } from "../../../_services/matSize.service";
import { TrnPurchaseOrderService } from "../../../_services/trnPurchaseOrder.service";

const routes: Routes = [
  {
    path: "",
    component: DefaultComponent,
    children: [
      {
        path: "",
        component: TrnGoodReceiveNoteComponent,
        children: [
          {
            path: 'list',
            component: TrnGoodReceiveNoteListComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['grn']
            }
          },
          {
            path: 'add/:id',
            component: TrnGoodReceiveNoteAddEditComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['grn']
            }
          },
          {
            path: 'edit/:id',
            component: TrnGoodReceiveNoteAddEditComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['grn']
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
    TrnGoodReceiveNoteComponent,
    TrnGoodReceiveNoteListComponent,
    TrnGoodReceiveNoteAddEditComponent
  ],
  providers: [
    // RoleService,
    TrnProductStockService,
    TrnGoodReceiveNoteService,
    ConfirmationService,
    SupplierService,
    CommonService,
    CollectionService,
    MatSizeService,
    TrnPurchaseOrderService
  ],
})
export class TrnGoodReceiveNoteModule {
}
