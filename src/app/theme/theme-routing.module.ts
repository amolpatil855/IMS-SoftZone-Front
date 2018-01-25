import { NgModule } from '@angular/core';
import { ThemeComponent } from './theme.component';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from "../auth/_guards/auth.guard";

const routes: Routes = [
  {
    "path": "",
    "component": ThemeComponent,
    "canActivate": [AuthGuard],
    "children": [
      {
        "path": "features\/master\/company",
        "loadChildren": ".\/pages\/default\/features\/master\/company\/company.module#CompanyModule"
      },
      {
        "path": "features\/master\/customer",
        "loadChildren": ".\/pages\/default\/features\/master\/customer\/customer.module#CustomerModule"
      },
      {
        "path": "features\/master\/supplier",
        "loadChildren": ".\/pages\/default\/features\/master\/supplier\/supplier.module#SupplierModule"
      },
      {
        "path": "features\/master\/collection",
        "loadChildren": ".\/pages\/default\/features\/master\/collection\/collection.module#CollectionModule"
      },
      {

        "path": "features\/master\/design",
        "loadChildren": ".\/pages\/default\/features\/master\/design\/design.module#DesignModule"
      },
      {

        "path": "features\/master\/shade",
        "loadChildren": ".\/pages\/default\/features\/master\/shade\/shade.module#ShadeModule"
      },
      {
        "path": "features\/master\/quality",
        "loadChildren": ".\/pages\/default\/features\/master\/quality\/quality.module#QualityModule"
      },
      {
        "path": "features\/master\/matThickness",
        "loadChildren": ".\/pages\/default\/features\/master\/matThickness\/matThickness.module#MatThicknessModule"
      },
      {
        "path": "features\/master\/matSize",
        "loadChildren": ".\/pages\/default\/features\/master\/matSize\/matSize.module#MatSizeModule"
      },
      {
        "path": "features\/master\/fomDensity",
        "loadChildren": ".\/pages\/default\/features\/master\/fomDensity\/fomDensity.module#FomDensityModule"
      },
      {
        "path": "features\/master\/fomSuggestedMM",
        "loadChildren": ".\/pages\/default\/features\/master\/fomSuggestedMM\/fomSuggestedMM.module#FomSuggestedMMModule"
      },
      {
        "path": "features\/master\/fomSize",
        "loadChildren": ".\/pages\/default\/features\/master\/fomSize\/fomSize.module#FomSizeModule"
      },
      {
        "path": "features\/master\/hsn",
        "loadChildren": ".\/pages\/default\/features\/master\/hsn\/hsn.module#HsnModule"
      },
      {
        "path": "features\/users",
        "loadChildren": ".\/pages\/default\/features\/users\/users.module#UsersModule"
      },
      {
        "path": "features\/roles",
        "loadChildren": ".\/pages\/default\/features\/roles\/roles.module#RolesModule"
      },

      {
        "path": "header/changePassword",
        "loadChildren": ".\/pages\/default\/features\/changePassword\/changePassword.module#ChangePasswordModule"
      },
      {
        "path": "index",
        "loadChildren": ".\/pages\/default\/index\/index.module#IndexModule"
      },
      {
        "path": "404",
        "loadChildren": ".\/pages\/default\/not-found\/not-found\/not-found.module#NotFoundModule"
      },
      {
        "path": "",
        "redirectTo": "index",
        "pathMatch": "full"
      }
    ]
  },
  {
    "path": "changePassword",
    "canActivate": [AuthGuard],
    "loadChildren": ".\/pages\/self-layout-blank\/snippets\/pages\/changePassword\/changePassword.module#ChangePasswordModule"
  },
  {
    "path": "forbidden",
    "loadChildren": ".\/pages\/self-layout-blank\/snippets\/pages\/unautherizedAccess\/unautherizedAccess.module#UnAutherizedAccessModule"
  },
  {
    "path": "**",
    "redirectTo": "404",
    "pathMatch": "full"
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ThemeRoutingModule { }
