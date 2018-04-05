import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { DefaultComponent } from "../../../default.component";
import { AuthGuard } from "../../../../../../auth/_guards/auth.guard";
import { LayoutModule } from "../../../../../layouts/layout.module";
import { CommonService } from '../../../_services/common.service';
import { CollectionService } from '../../../_services/collection.service';
import {TrnProductStockService} from "../../../_services/trnProductStock.service";
import {
  DataTableModule,
  SharedModule,
  ButtonModule,
  AutoCompleteModule,
  DropdownModule,
  OverlayPanelModule,
  DialogModule,
  CalendarModule,
  RadioButtonModule,
  ConfirmDialogModule,
  ConfirmationService,
} from 'primeng/primeng';

import { TrnMaterialSelectionService } from "../../../_services/trnMaterialSelection.service";
import { TrnCurtainSelectionService } from "../../../_services/trnCurtainSelection.service";
import { TrnCurtainSelectionComponent } from "./trnCurtainSelection.component";
import { TrnCurtainSelectionListComponent } from "./trnCurtainSelection-list/trnCurtainSelection-list.component";
import { TrnCurtainSelectionAddEditComponent } from "./trnCurtainSelection-add-edit/trnCurtainSelection-add-edit.component";
import { ShadeService } from "../../../_services/shade.service";
import { FomSizeService } from "../../../_services/fomSize.service";
import { MatSizeService } from "../../../_services/matSize.service";
import { CustomerService } from "../../../_services/customer.service";

const routes: Routes = [
  {
    path: "",
    component: DefaultComponent,
    children: [
      {
        path: "",
        component: TrnCurtainSelectionComponent,
        children: [
          {
            path: 'list',
            component: TrnCurtainSelectionListComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['curtainselection']
            }
          },
          {
            path: 'add',
            component: TrnCurtainSelectionAddEditComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['curtainselection']
            }
          },
          {
            path: 'edit/:id',
            component: TrnCurtainSelectionAddEditComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['curtainselection']
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
    CalendarModule,
    OverlayPanelModule,
    DialogModule,
    RadioButtonModule,
    ConfirmDialogModule
  ],
  declarations: [
    TrnCurtainSelectionComponent,
    TrnCurtainSelectionListComponent,
    TrnCurtainSelectionAddEditComponent
  ],
  providers: [
    CommonService,
    TrnCurtainSelectionService,
    CustomerService,
    ShadeService,
    FomSizeService,
    MatSizeService,
    ConfirmationService,
    CollectionService,
    TrnProductStockService,
    TrnMaterialSelectionService
  ],
})
export class TrnCurtainSelectionModule {
}
