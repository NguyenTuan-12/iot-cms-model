import { Routes } from "@angular/router";

export const ProductServiceRoutes: Routes = [
  {
    path: "",
    redirectTo: "/cms/productservice",
    pathMatch: "full",
  },
  {
    path: 'productcategory',
    loadChildren: "./productcategory/productcategory.module#ProductCategoryModule",
  },
  {
    path: 'productlist',
    loadChildren: "./productlist/productlist.module#ProductListModule",
  },
  {
    path: 'servicecategory',
    loadChildren: "./servicecategory/servicecategory.module#ServiceCategoryModule",
  },
  {
    path: 'servicelist',
    loadChildren: "./servicelist/servicelist.module#ServiceListModule",
  },
   { path: 'promotion',
    loadChildren: "./promotion/promotion.module#AppPromotionModule",
  },
];
