import { Routes } from "@angular/router";

export const BlogRoutes: Routes = [
  {
    path: "",
    redirectTo: "/cms/blog",
    pathMatch: "full",
  },
  {
    path: 'blogcategory',
    loadChildren: "./blogcategory/blogcategory.module#BlogGroupModule",
  },
  {
    path: 'bloglist',
    loadChildren: "./bloglist/bloglist.module#BlogListModule",
  }
];
