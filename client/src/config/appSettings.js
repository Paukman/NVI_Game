import { camelCase } from 'lodash';

/**
 * Creates an application settings consisting of environment variables starting with REACT_APP.
 */
const env = process.env;
const authEnvironments = {};
const authPrefix = 'auth0';
const reactApp = 'REACT_APP_';
const envVars = Object.keys(env)
  .filter((key) => key.startsWith(reactApp))
  .reduce((acc, key) => {
    const settingKey = camelCase(key.replace(/REACT_APP_/i, ''));
    acc[settingKey] = env[key];

    if (settingKey.startsWith(authPrefix)) {
      const parts = key.substr(reactApp.length).split('_').slice(1);
      const authEnvironment = camelCase(parts.pop());
      if (!authEnvironments[authEnvironment]) {
        authEnvironments[authEnvironment] = {};
      }
      const authSetting = camelCase(parts.join('_'));
      authEnvironments[authEnvironment][authSetting] = acc[settingKey];
    }

    return acc;
  }, {});

const appSettings = {
  ...envVars,
  authEnvironments,
  isProduction: env.NODE_ENV === 'production',
  pageSize: 50,
};

export { appSettings };

export const APP_SETTINGS_CODES = {
  MYP2_PAGES_URL: 'myp1:pages:url',
  MYP2_PAGES_NAME: 'myp1:pages:name',
  APP_DEFAULT_PAGE: 'app:defaultPage',
};

export const APP_KEYS = {
  CALENDAR_MONTH_306090: '306090-calendar-month',
  REPORTS_306090: '306090-reports',
  ROLLING_MONTH_306090: '306090-rolling-month',
  ACCOUNT_MANAGEMENT: 'account-management',
  ACCOUNT_MANAGEMENT_ADD: 'account-management-add',
  ACCOUNT_MANAGEMENT_EDIT: 'account-management-edit',
  ACCOUNT_MANAGEMENT_IMPORT: 'account-management-import',
  ACCOUNT_MAPPING: 'account-mapping',
  AR_ACCOUNT: 'ar-account',
  AR_DASHBOARD: 'ar-dashboard',
  AR_PROPERTY: 'ar-property',
  CHANGE_PASSWORD: 'change-password',
  COMMISSIONS_CALCULATOR: 'commissions-calculator',
  DASHBOARDS: 'dashboards',
  DASHBOARD_PRIMARY_COMMENTS: 'dashboards-comments',
  DASHBOARD_PRIMARY_TABLE_COLUMN_ADD: 'dashboard-primary-table-column-add',
  DASHBOARD_PRIMARY_TABLE_COLUMN_EDIT: 'dashboard-primary-table-column-edit',
  DASHBOARD_PRIMARY_TABLE_COLUMN_ORDER: 'dashboard-primary-table-column-order',
  DASHBOARD_PRIMARY_TABLE_ROW_ADD: 'dashboard-primary-table-row-add',
  DASHBOARD_PRIMARY_TABLE_ROW_EDIT: 'dashboard-primary-table-row-edit',
  DASHBOARD_WIDGETS_ADD: 'dashboard-widgets-add',
  DASHBOARD_WIDGETS_EDIT: 'dashboard-widgets-edit',
  DASHBOARD_WIDGETS_ORDER: 'dashboard-widgets-order',
  DASHBOARD_WIDGETS_TOGGLE: 'dashboard-widgets-toggle',
  GL_HIERARCHY: 'gl-hierarchy',
  GL_MAPPING: 'gl-mapping',
  GL_MAPPING_ADD: 'gl-mapping-add',
  GL_MAPPING_COPY: 'gl-mapping-copy',
  GL_MAPPING_COPY_FROM: 'gl-mapping-copy-from',
  GL_MAPPING_EDIT: 'gl-mapping-edit',
  GL_MAPPING_IMPORT: 'gl-mapping-import',
  GSS_MONTH: 'gss-month',
  GSS_PRIORITY: 'gss-priority',
  HEALTH_SCORECARD: 'health-scorecard',
  HEALTH_SCORECARD_MANUAL_ENTRY: 'health-scorecard-manual-entry',
  HOME: 'home',
  HOTELS: 'hotels',
  HOTELS_GROUPS: 'hotels-groups',
  HOTEL_ADD: 'hotel-add',
  HOTEL_EDIT: 'hotel-edit',
  HOTEL_GROUP_ADD: 'hotel-group-add',
  HOTEL_GROUP_EDIT: 'hotel-group-edit',
  HOTEL_GROUP_VIEW: 'hotel-group-view',
  HOTEL_VIEW: 'hotel-view',
  IJ: 'ij',
  IJ_EXPORT: 'ij-export',
  IJ_IMPORT: 'ij-import',
  IJ_MAPPING: 'ij-mapping',
  IJ_MAPPING_COPY: 'ij-mapping-copy',
  IJ_RECONCILIATION: 'ij-reconciliation',
  IJ_SUMMARY: 'ij-summary',
  KPI: 'kpi',
  KPI_ADD: 'kpi-add',
  KPI_EDIT: 'kpi-edit',
  KPI_SHARE: 'kpi-share',
  KPI_TEST: 'kpi-test',
  LABOR: 'labor',
  LABOR_DEFAULT: 'labor-default',
  LABOR_PERIOD: 'labor-period',
  MDO_GL_CODES: 'mdo-gl-codes',
  MDO_GL_CODES_ADD: 'mdo-gl-codes-add',
  MDO_GL_CODES_EDIT: 'mdo-gl-codes-edit',
  MDO_GL_CODES_IMPORT: 'mdo-gl-codes-import',
  MEDALLIA: 'medallia',
  ORGANIZATIONS: 'organizations',
  ORGANIZATION_ADD: 'organization-add',
  ORGANIZATION_EDIT: 'organization-edit',
  ORGANIZATION_VIEW: 'organization-view',
  PICKUP: 'pickup',
  PICKUP_MONTHLY: 'pickup-monthly',
  PICKUP_SUMMARY: 'pickup-summary',
  PNL: 'pnl',
  PNL_MONTHLY: 'pnl-monthly',
  PNL_PROPERTY_COMPARISON: 'pnl-property-comparison',
  PNL_UNMAPPED: 'pnl-unmapped',
  PNL_VIEW: 'pnl-view',
  PNL_VIEW_ADD: 'pnl-view-add',
  PNL_VIEW_EDIT: 'pnl-view-edit',
  PNL_YEARLY: 'pnl-yearly',
  PURCHASE_ORDERS: 'purchase-orders',
  PURCHASE_ORDERS_ADD: 'purchase-orders-add',
  PURCHASE_ORDERS_EDIT: 'purchase-orders-edit',
  PURCHASE_ORDERS_PDF: 'purchase-orders-pdf',
  PURCHASE_ORDERS_PRINT: 'purchase-orders-print',
  PURCHASE_ORDERS_VIEW: 'purchase-orders-view',
  SALES_MANAGERS: 'sales-managers',
  SALES_MANAGERS_IMPORT: 'sales-managers-import',
  SALES_MANAGER_ADD: 'sales-manager-add',
  SALES_MANAGER_EDIT: 'sales-manager-edit',
  SALES_PRODUCTION_REPORT: 'sales-production-report',
  STR_DEFAULT: 'str-default',
  STR_DEFAULT_REPORTS: 'str-default-reports',
  STR_ROLLUP: 'str-rollup',
  USERS: 'users',
  USER_ADD: 'user-add',
  USER_EDIT: 'user-edit',
  USER_PROFILE: 'user-profile',
  USER_VIEW: 'user-view',
  VENDORS: 'vendors',
  VENDORS_IMPORT: 'vendors-import',
  VENDOR_ADD: 'vendor-add',
  VENDOR_EDIT: 'vendor-edit',
  WIDGETS: 'widgets',
  WIDGETS_ADD: 'widgets-add',
  WIDGETS_EDIT: 'widgets-edit',
};
