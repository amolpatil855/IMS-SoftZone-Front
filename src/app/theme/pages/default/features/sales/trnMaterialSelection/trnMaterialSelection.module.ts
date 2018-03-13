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
import { TrnMaterialSelectionComponent } from "./trnMaterialSelection.component";
import { TrnMaterialSelectionListComponent } from "./trnMaterialSelection-list/trnMaterialSelection-list.component";
import { TrnMaterialSelectionAddEditComponent } from "./trnMaterialSelection-add-edit/trnMaterialSelection-add-edit.component";
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
        component: TrnMaterialSelectionComponent,
        children: [
          {
            path: 'list',
            component: TrnMaterialSelectionListComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['materialselection']
            }
          },
          {
            path: 'add',
            component: TrnMaterialSelectionAddEditComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['materialselection']
            }
          },
          {
            path: 'edit/:id',
            component: TrnMaterialSelectionAddEditComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['materialselection']
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
    TrnMaterialSelectionComponent,
    TrnMaterialSelectionListComponent,
    TrnMaterialSelectionAddEditComponent
  ],
  providers: [
    CommonService,
    TrnMaterialSelectionService,
    CustomerService,
    ShadeService,
    FomSizeService,
    MatSizeService,
    ConfirmationService,
    CollectionService,
    TrnProductStockService
  ],
})
export class TrnMaterialSelectionModule {
}
