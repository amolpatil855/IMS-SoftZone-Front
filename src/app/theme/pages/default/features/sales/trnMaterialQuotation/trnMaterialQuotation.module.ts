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

import { TrnMaterialQuotationService } from "../../../_services/trnMaterialQuotation.service";
import { TrnMaterialQuotationComponent } from "./trnMaterialQuotation.component";
import { TrnMaterialQuotationListComponent } from "./trnMaterialQuotation-list/trnMaterialQuotation-list.component";
import { TrnMaterialQuotationAddEditComponent } from "./trnMaterialQuotation-add-edit/trnMaterialQuotation-add-edit.component";
import { ShadeService } from "../../../_services/shade.service";
import { FomSizeService } from "../../../_services/fomSize.service";
import { MatSizeService } from "../../../_services/matSize.service";
import { CustomerService } from "../../../_services/customer.service";
import { TrnMaterialSelectionService } from "../../../_services/trnMaterialSelection.service";

const routes: Routes = [
  {
    path: "",
    component: DefaultComponent,
    children: [
      {
        path: "",
        component: TrnMaterialQuotationComponent,
        children: [
          {
            path: 'list',
            component: TrnMaterialQuotationListComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['materialquotation']
            }
          },
          {
            path: 'add',
            component: TrnMaterialQuotationAddEditComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['materialquotation']
            }
          },
          {
            path: 'edit/:id',
            component: TrnMaterialQuotationAddEditComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['materialquotation']
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
    TrnMaterialQuotationComponent,
    TrnMaterialQuotationListComponent,
    TrnMaterialQuotationAddEditComponent
  ],
  providers: [
    CommonService,
    TrnMaterialQuotationService,
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
export class TrnMaterialQuotationModule {
}
