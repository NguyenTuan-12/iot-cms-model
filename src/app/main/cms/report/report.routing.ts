import { Routes } from "@angular/router";

export const ReportRoutes: Routes = [
  {
    path: "",
    redirectTo: "/cms/blog",
    pathMatch: "full",
  },
  {
    path: "amount",
    loadChildren: "./amount/amount.module#AppAmountModule",
  },
  {
    path: "cancel",
    loadChildren: "./cancel/cancel.module#AppCancelModule",
  },
  {
    path: "content",
    loadChildren: "./content/content.module#AppContentModule",
  },
  {
    path: "services",
    loadChildren: "./services/services.module#AppServicesModule",
  },
];
