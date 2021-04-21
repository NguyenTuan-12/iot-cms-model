import { Routes } from "@angular/router";

export const CustomerRoutes: Routes = [
  {
    path: 'garange',
    loadChildren: "./garange/garange.module#AppGarangeModule",
  },
  {
    path: 'insurrance',
    loadChildren: "./insurrance/insurrance.module#AppInsurranceModule",
  }
];
