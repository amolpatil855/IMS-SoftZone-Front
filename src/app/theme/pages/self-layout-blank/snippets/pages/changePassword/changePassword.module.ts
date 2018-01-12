import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { LayoutModule } from '../../../../../layouts/layout.module';
import { ChangePasswordComponent } from './changePassword.component';
import { UserService } from '../../../../default/_services/index';

import {
  GrowlModule,
} from 'primeng/primeng';

const routes: Routes = [
  {
    "path": "",
    "component": ChangePasswordComponent
  }
];
@NgModule({
  imports: [
    CommonModule, RouterModule.forChild(routes),
    LayoutModule,
    FormsModule,
    ReactiveFormsModule,
    GrowlModule,
  ],
  exports: [
    RouterModule
  ],
  declarations: [
    ChangePasswordComponent
  ],
  providers: [
    UserService,
  ],
})
export class ChangePasswordModule {

}
