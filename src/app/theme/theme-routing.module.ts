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
