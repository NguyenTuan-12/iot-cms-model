import { Routes } from "@angular/router";

export const PartnerRoutes: Routes = [
  {
    path: "",
    redirectTo: "/cms/partner",
    pathMatch: "full",
  },
  {
    path: 'customer',
    loadChildren: "./customer/customer.module#AppCustomerModule",
  },
  {
    path: 'partnerlist',
    loadChildren: "./partnerlist/partnerlist.module#AppPartnerListModule",
  },
];
