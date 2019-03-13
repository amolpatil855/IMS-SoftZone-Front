import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { DefaultComponent } from "../../../default.component";
import { AuthGuard } from "../../../../../../auth/_guards/auth.guard";
import { LayoutModule } from "../../../../../layouts/layout.module";
import { CommonService } from '../../../_services/common.service';
import { CollectionService } from '../../../_services/collection.service';
import { TrnProductStockService } from "../../../_services/trnProductStock.service";
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
import { ShadeService } from "../../../_services/shade.service";
import { TrnCurtainSelectionService } from "../../../_services/trnCurtainSelection.service";
import { TrnCurtainQuotationService } from "../../../_services/trnCurtainQuotation.service";
import { TrnCurtainQuotationComponent } from "./trnCurtainQuotation.component";
import { TrnCurtainQuotationListComponent } from "./trnCurtainQuotation-list/trnCurtainQuotation-list.component";
import { TrnCurtainQuotationAddEditComponent } from "./trnCurtainQuotation-add-edit/trnCurtainQuotation-add-edit.component";
import { CustomerService } from "../../../_services/customer.service";
import { TrnMaterialSelectionService } from "../../../_services/trnMaterialSelection.service";

const routes: Routes = [
  {
    path: "",
    component: DefaultComponent,
    children: [
      {
        path: "",
        component: TrnCurtainQuotationComponent,
        children: [
          {
            path: 'list',
            component: TrnCurtainQuotationListComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['curtainquotation']
            }
          },
          {
            path: 'add',
            component: TrnCurtainQuotationAddEditComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['curtainquotation']
            }
          },
          {
            path: 'edit/:id',
            component: TrnCurtainQuotationAddEditComponent,
            canActivate: [AuthGuard],
            data: {
              permissions: ['curtainquotation']
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
    TrnCurtainQuotationComponent,
    TrnCurtainQuotationListComponent,
    TrnCurtainQuotationAddEditComponent
  ],
  providers: [
    CommonService,
    TrnCurtainQuotationService,
    TrnMaterialSelectionService,
    CustomerService,
    ConfirmationService,
    CollectionService,
    TrnProductStockService,
    TrnCurtainSelectionService,
    ShadeService
  ],
})
export class TrnCurtainQuotationModule {
}
