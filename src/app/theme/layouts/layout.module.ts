import { NgModule } from '@angular/core';
import { LayoutComponent } from './layout/layout.component';
import { HeaderNavComponent } from './header-nav/header-nav.component';
import { DefaultComponent } from '../pages/default/default.component';
import { AsideNavComponent } from './aside-nav/aside-nav.component';
import { FooterComponent } from './footer/footer.component';
import { ScrollTopComponent } from './scroll-top/scroll-top.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HrefPreventDefaultDirective } from '../../_directives/href-prevent-default.directive';
import { UnwrapTagDirective } from '../../_directives/unwrap-tag.directive';
import { IsAuthorizeDirective } from '../../_directives/isAuthorize.directive';
import { OnlyNumber } from '../../_directives/OnlyNumber.directive';
import { ImageUploadService } from '../pages/default/_services/imageUpload.service';
import { UserService } from "../pages/default/_services/user.service";
import { RoleService } from "../pages/default/_services/role.service";
import { CompanyService } from "../pages/default/_services/company.service";
import { AutofocusDirective } from '../../_directives/autoFocus.directive';
@NgModule({
  declarations: [
    LayoutComponent,
    HeaderNavComponent,
    DefaultComponent,
    AsideNavComponent,
    FooterComponent,
    ScrollTopComponent,
    HrefPreventDefaultDirective,
    UnwrapTagDirective,
    IsAuthorizeDirective,
    OnlyNumber,
    AutofocusDirective
  ],
  exports: [
    LayoutComponent,
    HeaderNavComponent,
    DefaultComponent,
    AsideNavComponent,
    FooterComponent,
    ScrollTopComponent,
    HrefPreventDefaultDirective,
    IsAuthorizeDirective,
    OnlyNumber,
    AutofocusDirective
  ],
  providers: [
    ImageUploadService,
    UserService,
    RoleService,
    CompanyService
  ],
  imports: [
    CommonModule,
    RouterModule,
  ]
})
export class LayoutModule {
}
