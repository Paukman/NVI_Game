import React from 'react';
import PropTypes from 'prop-types';

import {
  GlobalFilterContext,
  HotelContext,
  AppContext,
  ToastContext,
  DialogContext,
  DrawerContext,
  UserSettingsContext,
} from 'contexts';

export const RenderWithProviders = ({
  children,
  userSettingsState,
  appPages,
  sideBareItemsWithPermissions,
  permissions,
  hotels,
  hotelsMap,
  hotelsGroups,
  hotelsGroupsMap,
  portfolio,
  assignGlobalValue,
  showDrawer,
  hideDrawer,
  showDialog,
  hideDialog,
  showToast,
}) => {
  RenderWithProviders.propTypes = {
    children: PropTypes.element.isRequired,
    userSettingsState: PropTypes.any,
    appPages: PropTypes.any,
    sideBareItemsWithPermissions: PropTypes.any,
    permissions: PropTypes.any,
    hotels: PropTypes.any,
    hotelsMap: PropTypes.any,
    hotelsGroups: PropTypes.any,
    hotelsGroupsMap: PropTypes.any,
    portfolio: PropTypes.any,
    assignGlobalValue: PropTypes.func,
    showDrawer: PropTypes.func,
    hideDrawer: PropTypes.func,
    showDialog: PropTypes.func,
    hideDialog: PropTypes.func,
    showToast: PropTypes.func,
  };
  return (
    <UserSettingsContext.Provider value={{ userSettingsState }}>
      <AppContext.Provider value={{ appPages, sideBareItemsWithPermissions, permissions }}>
        <HotelContext.Provider value={{ hotels, hotelsMap, hotelsGroups, hotelsGroupsMap }}>
          <GlobalFilterContext.Provider value={{ portfolio, assignGlobalValue }}>
            <DialogContext.Provider value={{ showDialog, hideDialog }}>
              <ToastContext.Provider value={{ showToast }}>
                <DrawerContext.Provider value={{ showDrawer, hideDrawer }}>{children}</DrawerContext.Provider>
              </ToastContext.Provider>
            </DialogContext.Provider>
          </GlobalFilterContext.Provider>
        </HotelContext.Provider>
      </AppContext.Provider>
    </UserSettingsContext.Provider>
  );
};
