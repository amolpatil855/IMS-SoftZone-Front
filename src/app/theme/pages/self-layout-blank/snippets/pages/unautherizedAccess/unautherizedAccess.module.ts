import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { LayoutModule } from '../../../../../layouts/layout.module';
import { UnAutherizedAccessComponent } from './unautherizedAccess.component';

const routes: Routes = [
  {
    "path": "",
    "component": UnAutherizedAccessComponent
  }
];
@NgModule({
  imports: [
    CommonModule, RouterModule.forChild(routes),
    LayoutModule,
  ],
  exports: [
    RouterModule
  ],
  declarations: [
    UnAutherizedAccessComponent
  ],
})
export class UnAutherizedAccessModule {

}
