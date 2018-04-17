import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { DefaultComponent } from "../../../default.component";
import { AuthGuard } from "../../../../../../auth/_guards/auth.guard";
import { LayoutModule } from "../../../../../layouts/layout.module";
import { CommonService } from '../../../_services/common.service';
import { CollectionService } from '../../../_services/collection.service';
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

import { TrnWorkOrderService } from "../../../_services/trnWorkOrder.service";
import { TrnWorkOrderComponent } from "./trnWorkOrder.component";
import { TrnWorkOrderListComponent } from "./trnWorkOrder-list/trnWorkOrder-list.component";
import { TrnWorkOrderAddEditComponent } from "./trnWorkOrder-add-edit/trnWorkOrder-add-edit.component";

const routes: Routes = [
    {
        path: "",
        component: DefaultComponent,
        children: [
            {
                path: "",
                component: TrnWorkOrderComponent,
                children: [
                    {
                        path: 'list',
                        component: TrnWorkOrderListComponent,
                        canActivate: [AuthGuard],
                        data: {
                            permissions: ['workorder']
                        }
                    },
                    {
                        path: 'add',
                        component: TrnWorkOrderAddEditComponent,
                        canActivate: [AuthGuard],
                        data: {
                            permissions: ['workorder']
                        }
                    },
                    {
                        path: 'edit/:id',
                        component: TrnWorkOrderAddEditComponent,
                        canActivate: [AuthGuard],
                        data: {
                            permissions: ['workorder']
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
        TrnWorkOrderComponent,
        TrnWorkOrderListComponent,
        TrnWorkOrderAddEditComponent
    ],
    providers: [
        CommonService,
        TrnWorkOrderService,
        ConfirmationService,
        CollectionService
    ],
})
export class TrnWorkOrderModule {
}
