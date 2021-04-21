import { Navigation } from '../_models/index';

export const navigationSystem: Navigation[] = [
  {
    id: 'sys_dashboard',
    title: 'Tổng quan',
    translate: 'NAV_SYSTEM.DASHBOARDS',
    type: 'item',
    icon: 'home',
    url: '/sys/sdashboard'
  },
  {
    id: 'sys_users',
    title: 'Hệ thống',
    translate: 'NAV_SYSTEM.USERS',
    type: 'group',
    icon: 'gear',
    url: '/sys/config',
    children: [
      {
        id: 'sys_account',
        title: 'Quản lý tài khoản',
        translate: 'NAV_SYSTEM.USERS_LIST.USER',
        type: 'item',
        url: '/sys/config/account',
        exactMatch: true
      }
    ]
  }
];
