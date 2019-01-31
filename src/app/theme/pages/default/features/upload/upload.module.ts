import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { DefaultComponent } from "../../default.component";
import { AuthGuard } from "../../../../../auth/_guards/auth.guard";
import { LayoutModule } from "../../../../layouts/layout.module";
import {
  DataTableModule,
  SharedModule,
  FileUploadModule
} from 'primeng/primeng';
// import {FileUploadModule} from 'primeng/fileupload';
import { UploadComponent } from "./upload.component";

const routes: Routes = [
  {
    "path": "",
    "component": DefaultComponent,
    "children": [
      {
        "path": "",
        "component": UploadComponent
      }
    ]
  }
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
    FileUploadModule
  ],
  declarations: [
    UploadComponent
  ],
  providers: [
  ],
})
export class UploadModule {
}
