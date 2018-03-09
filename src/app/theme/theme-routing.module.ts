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
        "path": "features\/master\/agent",
        "loadChildren": ".\/pages\/default\/features\/master\/agent\/agent.module#AgentModule"
      },
      {
        "path": "features\/master\/courier",
        "loadChildren": ".\/pages\/default\/features\/master\/courier\/courier.module#CourierModule"
      },
      {
        "path": "features\/master\/financialYear",
        "loadChildren": ".\/pages\/default\/features\/master\/financialYear\/financialYear.module#FinancialYearModule"
      },
      {
        "path": "features\/master\/accessory",
        "loadChildren": ".\/pages\/default\/features\/master\/accessory\/accessory.module#AccessoryModule"
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
        "path": "features\/master\/trnProductStock",
        "loadChildren": ".\/pages\/default\/features\/master\/trnProductStock\/trnProductStock.module#TrnProductStockModule"
      },
      {
        "path": "features\/master\/trnProductStockDetail",
        "loadChildren": ".\/pages\/default\/features\/master\/trnProductStockDetail\/trnProductStockDetail.module#TrnProductStockDetailModule"
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
        "path": "features\/purchase\/trnPurchaseOrder",
        "loadChildren": ".\/pages\/default\/features\/purchase\/trnPurchaseOrder\/trnPurchaseOrder.module#TrnPurchaseOrderModule"
      },
      {
        "path": "features\/purchase\/trnGoodReceiveNote",
        "loadChildren": ".\/pages\/default\/features\/purchase\/trnGoodReceiveNote\/trnGoodReceiveNote.module#TrnGoodReceiveNoteModule"
      },
      {
        "path": "features\/purchase\/trnPOItemsWithInsufficientStock",
        "loadChildren": ".\/pages\/default\/features\/purchase\/trnPOItemsWithInsufficientStock\/trnPOItemsWithInsufficientStock.module#TrnPOItemsWithInsufficientStockModule"
      },
      {
        "path": "features\/sales\/trnSalesOrder",
        "loadChildren": ".\/pages\/default\/features\/sales\/trnSalesOrder\/trnSalesOrder.module#TrnSalesOrderModule"
      },
      {
        "path": "features\/sales\/trnGoodIssueNote",
        "loadChildren": ".\/pages\/default\/features\/sales\/trnGoodIssueNote\/trnGoodIssueNote.module#TrnGoodIssueNoteModule"
      },
      {
        "path": "features\/sales\/trnSalesInvoice",
        "loadChildren": ".\/pages\/default\/features\/sales\/trnSalesInvoice\/trnSalesInvoice.module#TrnSalesInvoiceModule"
      },
      {
        "path": "features\/sales\/trnGINForItemsWithStockAvailable",
        "loadChildren": ".\/pages\/default\/features\/sales\/trnGINForItemsWithStockAvailable\/trnGINForItemsWithStockAvailable.module#TrnGINForItemsWithStockAvailableModule"
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
