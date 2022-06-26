import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { AppContext } from '../contexts';
import { useAppPages, useDashboard, useSideBar, usePermissions } from '../graphql';
import { normalizePermissions, applyPersmissionsForSideBarItems, logger } from 'utils';

const AppProvider = (props) => {
  const { children } = props;
  const { appPages, loading: appPagesLoading, pageProps, listAppPages, setPageProps } = useAppPages();
  const { sideBarItems, loading: sideBarLoading, listSideBarItems } = useSideBar();
  const { dashboards, dashboardsLoading, dashboardList } = useDashboard();
  const { permissionsList, permissionsListState } = usePermissions();

  const [sideBareItemsWithPermissions, updateSidebars] = useState([]);
  const [normalizedPermissions, updatePermissions] = useState({});

  useEffect(() => {
    if (sideBarItems?.data?.length && permissionsListState?.data?.length) {
      const permissions = normalizePermissions(permissionsListState.data[0]);
      logger.debug('Permissions for the user', permissions);
      updatePermissions(permissions);
      updateSidebars(applyPersmissionsForSideBarItems(sideBarItems?.data, permissions));
    }
  }, [sideBarItems, permissionsListState]);

  return (
    <AppContext.Provider
      value={{
        appPages,
        sideBarItems,
        dashboards,
        appPagesLoading,
        sideBarLoading,
        dashboardsLoading,
        listAppPages,
        listSideBarItems,
        dashboardList,
        loading: appPagesLoading || sideBarLoading || dashboardsLoading,
        pageProps,
        setPageProps,
        permissionsList,
        permissions: normalizedPermissions,
        sideBareItemsWithPermissions,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { AppProvider };
