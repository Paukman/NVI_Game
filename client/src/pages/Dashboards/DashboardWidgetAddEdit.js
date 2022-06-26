import React, { memo, useEffect, useContext, useState, Fragment, useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Button, ToolBar, ToolBarItem, BaseList } from 'mdo-react-components';

import { useDashboard, useDashboardWidget } from '../../graphql';
import { AppContext } from 'contexts';
import { DataLoading, DisplayNoData, DisplayApiErrors, ButtonsCancelSave, WidgetDropdown } from 'components';

import { appSettings } from 'config/appSettings';

import logger from 'utils/logger';
import { getText } from 'utils/localesHelpers';
import { strReplace } from 'utils/formatHelpers';

/**
 * TODO: Complete the page - add form, load edited dashboard widget, call create or update respectively
 */

const DashboardWidgetAddEdit = memo(() => {
  const params = useParams();
  const history = useHistory();
  const {
    dashboardWidgetGet,
    dashboardWidgetCreate,
    dashboardWidgetUpdate,
    dashboardWidget,
    dashboardWidgetLoading,
    dashboardWidgetCreating,
    dashboardWidgetUpdating,
    dashboardWidgetGetCalled,
    dashboardWidgetCreateCalled,
    dashboardWidgetUpdateCalled,
  } = useDashboardWidget();
  const { dashboardGet, dashboard, dashboardLoading } = useDashboard();
  const { dashboards, setPageProps, appPages } = useContext(AppContext);
  const [localDashboardWidget, setLocalDashboardWidget] = useState({});

  const goBack = useCallback(() => {
    history.push(strReplace(appPages.keys['dashboards'].url, params));
  }, [history, appPages, params]);

  const handleClickSave = useCallback((formData) => {
    logger.log('Saving dashboard widget:', formData);

    // TODO: dashboardWidgetCreate or dashboardWidgetUpdate
  }, []);

  useEffect(() => {
    if (dashboardLoading || params.slug === dashboard.data?.slug) {
      return;
    }

    if (dashboard.errors.length > 0) {
      return;
    }

    const id = dashboards?.slugs?.[params.slug]?.id;

    if (id) {
      dashboardGet(id);
    }
  }, [dashboard, dashboardLoading, dashboardGet, params, dashboards]);

  useEffect(() => {
    if (dashboardWidgetLoading || dashboardWidgetGetCalled) {
      return;
    }

    if (dashboardWidget.errors.length > 0) {
      return;
    }

    if (dashboardWidget.data?.id) {
      return;
    }

    if (params.id) {
      dashboardWidgetGet(params.id);
    }
  }, [dashboardWidgetGet, dashboardWidget, dashboardWidgetLoading, dashboardWidgetGetCalled, params]);

  useEffect(() => {
    if (!dashboardWidgetGetCalled) {
      return;
    }

    logger.log('Set dashboardWidget', dashboardWidget?.data);
    if (dashboardWidgetLoading) {
      return;
    }

    if (dashboardWidget.errors.length > 0) {
      return;
    }

    if (dashboardWidget.data) {
      setLocalDashboardWidget(dashboardWidget.data);
    }
  }, [dashboardWidgetGet, dashboardWidget, dashboardWidgetLoading, dashboardWidgetGetCalled]);

  useEffect(() => {
    if (dashboard.data) {
      logger.log('dashboard', dashboard);
      const title = localDashboardWidget.id ? 'editDashboardWidget' : 'addDashboardWidget';
      setPageProps({
        title: strReplace(getText(`dashboard.titles.${title}`), dashboard.data),
      });
    }
  }, [dashboard, setPageProps, localDashboardWidget]);

  useEffect(() => {
    if (!dashboardWidgetCreateCalled && !dashboardWidgetUpdateCalled) {
      return;
    }

    if (!dashboardWidgetCreating && !dashboardWidgetUpdating) {
      return;
    }

    if (dashboardWidget.errors.length > 0) {
      return;
    }

    // Go back to the dashboard after successfully creating or updating a dashboard widget
    goBack();
  }, [
    dashboardWidget,
    dashboardWidgetCreateCalled,
    dashboardWidgetUpdateCalled,
    dashboardWidgetCreating,
    dashboardWidgetUpdating,
    goBack,
  ]);

  if (dashboardLoading) {
    return <DataLoading />;
  }

  return (
    <Fragment>
      <ToolBar>
        <ToolBarItem toTheRight>
          <Button
            iconName='Close'
            variant='tertiary'
            onClick={() => {
              goBack();
            }}
            dataEl='buttonClose'
          />
        </ToolBarItem>
      </ToolBar>
      <Fragment>
        {/* Insert Form Here: Widget Name (can be empty), widget to use, width (values: 1... how many columns the dashboard has), default period (if supported), default priority (if supported),  */}
        <WidgetDropdown label={getText('dashboard.labels.selectWidget')} value={localDashboardWidget?.widgetId} />
      </Fragment>
    </Fragment>
  );
});

DashboardWidgetAddEdit.displayName = 'DashboardWidgetAddEdit';

export { DashboardWidgetAddEdit };
