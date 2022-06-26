/**
 * This file contains all available pages for the application - url, layout and page component to use to render the page.
 * In the future, all the pages will be loaded from the database via BE. This is the reason why we use string names instead
 * of components directly.
 * See componentsMap.js file where mapping of component name to component happens.
 */
export const siteMap = [
  {
    pageKey: 'hotels',
    name: 'Hotels',
    subtitle: '',
    url: '/settings/hotels',
    component: 'Hotels',
    layout: 'MainLayout',
    visible: true,
    options: {},
    roles: [],
  },
  {
    pageKey: 'ij',
    name: 'Income Journal',
    subtitle: '',
    url: '/income-journal',
    component: 'IncomeJournal',
    layout: 'MainLayout',
    visible: true,
    options: {},
    roles: [],
  },
  {
    pageKey: 'ij-import',
    name: 'Income Journal Import',
    subtitle: '',
    url: '/income-journal/import',
    component: 'IncomeJournalImport',
    layout: 'MainLayout',
    visible: true,
    options: {},
    roles: [],
  },
  {
    pageKey: 'change-password',
    name: 'Change Password',
    subtitle: '',
    url: '/admin/user-change-password',
    component: 'UserChangePassword',
    layout: 'MainLayout',
    visible: true,
    options: {},
    roles: [],
  },
  {
    pageKey: 'user-profile',
    name: 'User Profile',
    subtitle: '',
    url: '/user-profile',
    component: 'UserProfile',
    layout: 'MainLayout',
    visible: true,
    options: {},
    roles: [],
  },
  {
    name: 'Page Not Found',
    url: '*',
    component: 'PageNotFound', // note that we use string we would hook up with the componentsMap.
    layout: 'EmptyLayout', // note that we use string we would hook up with the componentsMap.
  },
];
