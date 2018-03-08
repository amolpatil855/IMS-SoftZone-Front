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
import { TrnGoodIssueNoteService } from "../../../_services/trnGoodIssueNote.service";
import { TrnGoodIssueNoteComponent } from "./trnGoodIssueNote.component";
import { TrnGoodIssueNoteListComponent } from "./trnGoodIssueNote-list/trnGoodIssueNote-list.component";
import { TrnGoodIssueNoteAddEditComponent } from "./trnGoodIssueNote-add-edit/trnGoodIssueNote-add-edit.component";
import {TrnProductStockService} from "../../../_services/trnProductStock.service";
import {MatSizeService} from "../../../_services/matSize.service";
import { TrnGINForItemsWithStockAvailableService } from '../../../_services/trnGINForItemsWithStockAvailable.service';
const routes: Routes = [
  {
    path: "",
    component: DefaultComponent,
    children: [
      {
        path: "",
        component: TrnGoodIssueNoteComponent,
        children: [
          {
            path: 'list',
            component: TrnGoodIssueNoteListComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['gin']
            }
          },
          {
            path: 'add',
            component: TrnGoodIssueNoteAddEditComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['gin']
            }
          },
          {
            path: 'edit/:id',
            component: TrnGoodIssueNoteAddEditComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['gin']
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
    TrnGoodIssueNoteComponent,
    TrnGoodIssueNoteListComponent,
    TrnGoodIssueNoteAddEditComponent
  ],
  providers: [
    // RoleService,
    TrnProductStockService,
    TrnGoodIssueNoteService,
    ConfirmationService,
    SupplierService,
    CommonService,
    CollectionService,
    MatSizeService,
    TrnGINForItemsWithStockAvailableService
  ],
})
export class TrnGoodIssueNoteModule {
}
