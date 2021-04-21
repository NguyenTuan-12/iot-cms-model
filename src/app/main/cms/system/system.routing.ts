import { Routes } from "@angular/router";

export const SystemRoutes: Routes = [
  {
    path: "",
    redirectTo: "/cms/system",
    pathMatch: "full",
  },
  {
    path: 'sysusergroup',
    loadChildren: "./usergroup/usergroup.module#SysUserGroupModule",
  },
  {
    path: 'sysuser',
    loadChildren: "./user/user.module#SysUserModule",
  },
  {
    path: 'menu',
    loadChildren: "./menu/menu.module#SysMenuModule",
  },
  {
    path: 'garage',
    loadChildren: "./garage/garage.module#SysGarageModule",
  },
  {
    path: 'servicegarage',
    loadChildren: "./servicegarage/servicegarage.module#ServiceGarageModule",
  },
  {
    path: 'ads',
    loadChildren: "./ads/ads.module#SysAdsModule",
  },
  {
    path: 'links',
    loadChildren: "./links/links.module#SysLinksModule",
  },
  {
    path: 'settings',
    loadChildren: "./settings/settings.module#SysSettingsModule",
  }
];
