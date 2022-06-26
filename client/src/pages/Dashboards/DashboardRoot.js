import React, { memo } from 'react';
import { Redirect } from 'react-router-dom';

const DashboardRoot = memo(() => {
  return <Redirect to='/dashboards/primary' />;
});

DashboardRoot.displayName = 'DashboardRoot';

export { DashboardRoot };
