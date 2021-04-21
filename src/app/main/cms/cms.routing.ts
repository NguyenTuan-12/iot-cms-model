import { Routes } from '@angular/router';
import { Error404Component } from '../../main/errors/404/error-404.component';

export const CmsRoutes: Routes = [
  {
    path: 'dashboard',
    loadChildren: './dashboard/dashboard.module#AppDashboardModule'
  },
  {
    path: 'system',
    loadChildren: './system/system.module#AppSystemModule'
  },
  {
    path: 'blog',
    loadChildren: './blog/blog.module#BlogModule'
  },
  {
    path: 'booking',
    loadChildren: './booking/booking.module#BookingModule'
  },
  {
    path: 'cont',
    loadChildren: './cont/cont.module#AppContModule'
  },
  {
    path: 'partner',
    loadChildren: './partner/partner.module#PartnerModule'
  },
  {
    path: 'productservice',
    loadChildren: './productservice/productservice.module#ProductServiceModule'
  },
  {
    path: 'report',
    loadChildren: './report/report.module#AppReportModule'
  },
  {
    path: '**',
    component: Error404Component
  }
];
