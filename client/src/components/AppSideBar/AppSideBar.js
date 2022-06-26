import React, { memo, useContext } from 'react';
import PropTypes from 'prop-types';

import { SideBar } from 'mdo-react-components';

import { SideBarSubheader } from './SideBarSubheader';
import { AppContext } from 'contexts';
import { updateDashboardSidebarItems } from './utils';

const AppSideBar = memo((props) => {
  const { open, onClose, onClick } = props;
  const { appPages, loading, sideBareItemsWithPermissions, dashboards, permissions } = useContext(AppContext);

  const sidebarItems = updateDashboardSidebarItems(dashboards, sideBareItemsWithPermissions, permissions, appPages);

  return (
    !loading && (
      <SideBar open={open} items={sidebarItems} subheader={<SideBarSubheader />} onClose={onClose} onClick={onClick} />
    )
  );
});

AppSideBar.displayName = 'AppSideBar';

AppSideBar.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onClick: PropTypes.func,
};

export { AppSideBar };
