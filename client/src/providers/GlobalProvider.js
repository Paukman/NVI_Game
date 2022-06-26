import React from 'react';
import PropTypes from 'prop-types';
import { UserProvider } from './UserProvider';
import { HotelProvider } from './HotelProvider';
import { GlobalFilterProvider } from './GlobalFilterProvider';
import { AppProvider } from './AppProvider';
import { MdoGlCodeProvider } from './MdoGlCodeProvider';
import { DictionaryProvider } from './DictionaryProvider';
import { ToastProvider } from '../components/Toast';
import { DashboardProvider } from './DashboardProvider';
import { ReportProvider } from './ReportProvider';
import { OrganizationProvider } from './OrganizationProvider';
import { DialogProvider } from 'components/Dialog';
import { KpiProvider } from './KpiProvider';
import { DrawerProvider } from 'components/Drawer';
import { SalesManagerProvider } from './SalesManagerProvider';
import { UserSettingsProvider } from './UserSettingsProvider';

/**
 * Add here all the provders that should be global
 * @param {object} props
 * @returns
 */
const GlobalProvider = (props) => {
  const { children } = props;

  return (
    <UserProvider>
      <UserSettingsProvider>
        <OrganizationProvider>
          <AppProvider>
            <HotelProvider>
              <KpiProvider>
                <GlobalFilterProvider>
                  <DialogProvider>
                    <ToastProvider>
                      <DrawerProvider>
                        <MdoGlCodeProvider>
                          <DictionaryProvider>
                            <DashboardProvider>
                              <SalesManagerProvider>
                                <ReportProvider>{children}</ReportProvider>
                              </SalesManagerProvider>
                            </DashboardProvider>
                          </DictionaryProvider>
                        </MdoGlCodeProvider>
                      </DrawerProvider>
                    </ToastProvider>
                  </DialogProvider>
                </GlobalFilterProvider>
              </KpiProvider>
            </HotelProvider>
          </AppProvider>
        </OrganizationProvider>
      </UserSettingsProvider>
    </UserProvider>
  );
};

GlobalProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { GlobalProvider };
