import React, { useContext, memo } from 'react';
import PropTypes from 'prop-types';

import { AppContext } from 'contexts';

export const IfPermitted = memo((props) => {
  const { children, page, permissionType, dashboardPage } = props;
  const { permissions } = useContext(AppContext);

  const isPagePermissionPermitted = permissions?.page?.[page]?.includes(permissionType);
  const isDashboardPermissionPermitted = permissions?.dashboard?.[dashboardPage]?.includes(permissionType);

  if (isPagePermissionPermitted || isDashboardPermissionPermitted) {
    return <>{children}</>;
  } else return null;
});

IfPermitted.propTypes = {
  children: PropTypes.node,
  page: PropTypes.string,
  permissionType: PropTypes.string,
  dashboardPage: PropTypes.string,
};

IfPermitted.displayName = 'IfPermitted';
