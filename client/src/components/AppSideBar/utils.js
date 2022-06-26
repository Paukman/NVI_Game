import { sortBy } from 'lodash';

export const updateDashboardSidebarItems = (dashboards, sideBareItemsWithPermissions, permissions, appPages) => {
  const dashboardsRoot = sideBareItemsWithPermissions.find((item) => item.alt === 'Dashboard');

  if (dashboardsRoot) {
    const rootUrl = appPages?.keys['dashboards']?.url || '';
    if (!dashboardsRoot.applied) {
      dashboardsRoot.applied = true;
      dashboardsRoot.items.push(
        ...dashboards.data.reduce((allItems, dashboard) => {
          if (permissions?.dashboard?.[dashboard.slug]?.includes('view')) {
            allItems.push({
              id: dashboard.id,
              alt: dashboard.dashboardName,
              iconName: dashboard.dashboardIcon,
              label: dashboard.dashboardName,
              orderNo: dashboard.orderNo,
              parentId: null,
              selectable: true,
              url: rootUrl.replace(':slug', dashboard.slug),
            });
          }
          return allItems;
        }, []),
      );

      dashboardsRoot.items = sortBy(dashboardsRoot.items, 'orderNo');
    }
  }

  return sideBareItemsWithPermissions;
};
