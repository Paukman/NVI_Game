import React from 'react';
import PropTypes from 'prop-types';
import { DashboardContext } from '../contexts';
import { useDashboard, useWidget } from '../graphql';
import { useDashboardCustomTable } from '../hooks';

const DashboardProvider = (props) => {
  const { children } = props;
  const dashboardHooks = useDashboard();
  const widgetHooks = useWidget();
  const dashboardPrimaryHooks = useDashboardCustomTable();

  return (
    <DashboardContext.Provider
      value={{
        ...dashboardHooks,
        ...widgetHooks,
        ...dashboardPrimaryHooks,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

DashboardProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { DashboardProvider };
