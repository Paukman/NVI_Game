import React, { memo, useEffect, useContext, useState, Fragment, createRef } from 'react';
import dayjs from 'dayjs';
import { useParams, useHistory } from 'react-router-dom';

import { Button, ToolBar, ToolBarItem, InputDate } from 'mdo-react-components';

import { AppContext, DashboardContext, GlobalFilterContext, HotelContext } from 'contexts';
import {
  DataLoading,
  PortfolioSelector,
  DisplayNoData,
  DataContainer,
  Widgets,
  Widget,
  DisplayApiErrors,
  PeriodSelector,
  useIfPermitted,
} from 'components';

import logger from 'utils/logger';
import { isDashboardDateValid, strReplace, getText, isDateValid, isKeyPresent } from 'utils';
import { APP_KEYS } from 'config/appSettings';

/***
 * This page component is expected to
 */
const Dashboard = memo((props) => {
  const params = useParams();
  const history = useHistory();
  const { dashboardGet, dashboardLoading, dashboard, customTableState, onHandleActions } = useContext(DashboardContext);
  const { dashboards, setPageProps, appPages } = useContext(AppContext);
  const { portfolio, selectPortfolio, assignGlobalValue } = useContext(GlobalFilterContext);
  const { getPortfolioHotelIds } = useContext(HotelContext);
  const [reportRequested, setReportRequested] = useState(false);
  const [filters, setFilters] = useState({
    date: portfolio?.primaryDashboardDate ?? new Date().setDate(new Date().getDate() - 1),
    period: 'L7DAYS',
  });

  const ref = createRef();

  const { isPermitted } = useIfPermitted({ dashboardPage: 'primary' });

  useEffect(() => {
    if (dashboard.errors.length > 0) {
      return;
    }

    const id = dashboards?.slugs?.[params.slug]?.id;
    if (id) {
      dashboardGet(id);
    }
  }, [dashboardGet, params.slug]);

  useEffect(() => {
    if (dashboard.data) {
      setPageProps({
        title: dashboard.data.dashboardName,
      });
      // In the database periods for dashboard are stored as comma seprated string
      const periods = (dashboard.data?.dashboardSettings?.periods?.settingValue || '').split(',');

      // on initial load
      setFilters((state) => ({
        ...state,
        period: periods[0],
      }));
    }
  }, [dashboard, setFilters, setPageProps]);

  useEffect(() => {
    if (!isDateValid(filters.date)) {
      setReportRequested(true);
    } else {
      setReportRequested(false);
    }
  }, [filters.date]);

  const handleFilterChange = (name, value) => {
    logger.debug('Filter changed:', { name, value });
    setFilters((state) => ({
      ...state,
      [name]: value,
    }));
  };

  const handleTempDate = (name, value) => {
    //    setDate(value);

    logger.debug('Filter changed:', { name, value });
    setFilters((state) => ({
      ...state,
      [name]: value,
    }));
    assignGlobalValue('primaryDashboardDate', value);
  };

  const handleChangePortfolio = (name, value) => {
    logger.debug('Portfolio changed:', value);

    selectPortfolio(value);
  };

  if (!dashboard.data && dashboardLoading) {
    return <DataLoading />;
  }

  const settings = dashboard.data?.dashboardSettings || {};
  const periods = settings.periods?.settingValue;

  logger.debug('Dashboard settings:', settings);

  const widgetsCnt = dashboard.data?.dashboardWidgets?.length;
  const widgets = (dashboard.data?.dashboardWidgets || []).reduce((acc, dw) => {
    // if (!isDateValid(filters.date)) {
    //   return null;
    // }

    if (dw[0]?.statusId === 0) {
      return [...acc];
    }
    return [
      ...acc,
      <Widget
        key={dw[0].id}
        dashboard={dashboard}
        dashboardWidget={dw}
        hotelId={getPortfolioHotelIds(portfolio)}
        date={isDateValid(filters.date) ? dayjs(filters.date).format('YYYY-MM-DD') : null}
        containerRef={ref}
        period={filters.period}
        portfolio={portfolio}
      />,
    ];
  }, []);

  const isLoading = false;

  // if (['PROD'].indexOf(appSettings.appEnvironment) !== -1) {
  //   return <DisplayNoData message='The page is in development' />;
  // }

  return (
    <Fragment>
      <ToolBar>
        {settings.displayPropertyGroupSelector?.settingValue ? (
          <ToolBarItem>
            <PortfolioSelector
              name={'porfolio'}
              value={portfolio}
              onChange={handleChangePortfolio}
              disabled={isLoading}
              disableClearable
              allowAllGroups
              allowAllHotels
            />
          </ToolBarItem>
        ) : null}
        {settings.displayPropertySelector?.settingValue ? (
          <ToolBarItem>
            <InputDate
              name='date'
              label={getText('generic.date')}
              value={portfolio?.primaryDashboardDate}
              onChange={handleTempDate}
              disabled={isLoading}
              dataEl='inputDate'
              autoClose={true}
              width={140}
              inputDateIconPadding={0}
            />
          </ToolBarItem>
        ) : null}
        {periods ? (
          <ToolBarItem>
            <PeriodSelector
              name='period'
              label={getText('generic.period')}
              value={filters.period}
              periods={periods}
              onChange={handleFilterChange}
              disabled={isLoading}
              dataEl='periodSelected'
            />
          </ToolBarItem>
        ) : null}
        <ToolBarItem toTheRight />
        {settings.displayWidgetsOrderButton?.settingValue ? (
          <ToolBarItem>
            {isPermitted('change-order') && (
              <Button
                iconName={'Sort'}
                text={getText('dashboard.order')}
                title={getText('dashboard.order')}
                variant='tertiary'
                onClick={() => {
                  history.push(strReplace(`${appPages.keys['dashboard-widgets-order'].url}`, { slug: params.slug }));
                }}
                disabled={isLoading}
                dataEl='buttonOrderWidgets'
              />
            )}
          </ToolBarItem>
        ) : null}
        {settings.displayAddWidgetButton?.settingValue ? (
          <ToolBarItem toTheRight>
            <Button
              iconName={'Add'}
              text={getText('dashboard.addWidget')}
              title={getText('dashboard.addWidget')}
              variant='tertiary'
              onClick={() => {
                history.push(strReplace(`${appPages.keys['dashboard-widgets-add'].url}`, { slug: params.slug }));
              }}
              disabled={isLoading || !isDashboardDateValid(filters.date)}
              dataEl='buttonAddWidget'
            />
          </ToolBarItem>
        ) : null}
        {settings.displayToggleWidgetsButton?.settingValue ? (
          <ToolBarItem>
            {isPermitted('toggle-status') && (
              <Button
                iconName={'ToggleOff'}
                text={getText('dashboard.toggle')}
                title={getText('dashboard.toggle')}
                variant='tertiary'
                onClick={() => {
                  if (isKeyPresent(appPages, APP_KEYS.DASHBOARD_WIDGETS_TOGGLE)) {
                    history.push(strReplace(`${appPages.keys['dashboard-widgets-toggle'].url}`, { slug: params.slug }));
                  }
                }}
                disabled={isLoading}
                dataEl='buttonOrderWidgets'
              />
            )}
          </ToolBarItem>
        ) : null}
      </ToolBar>
      <Fragment>
        <DataContainer ref={ref} obsoleteData={reportRequested}>
          {widgetsCnt > 0 && <Widgets>{widgets}</Widgets>}
          {widgetsCnt === 0 && (
            <Widgets data-el='dashboard-widgets'>
              <DisplayNoData message={getText('dashboard.noWidgets')} />
            </Widgets>
          )}
          {dashboard.errors.length > 0 && !dashboardLoading && (
            <Widgets centered data-el='dashboard-error'>
              <DisplayApiErrors errors={dashboard.errors} />
            </Widgets>
          )}
        </DataContainer>
      </Fragment>
    </Fragment>
  );
});

Dashboard.displayName = 'Dashboard';

export { Dashboard };
