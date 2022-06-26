import React, { memo, useEffect, useContext, useState, Fragment, useCallback, useMemo } from 'react';
import { flatten } from 'lodash';
import { useParams, useHistory } from 'react-router-dom';
import { Button, ToolBar, ToolBarItem, RecursiveDataTable, Switch, Search } from 'mdo-react-components';

import { useDashboard, useDashboardWidget } from '../../graphql';
import { AppContext } from 'contexts';
import { DataLoading, DisplayNoData, DisplayApiErrors, ButtonsCancelSave, Widget } from 'components';

import logger from 'utils/logger';
import { getText, search } from 'utils/localesHelpers';
import { strReplace } from 'utils/formatHelpers';

import { StyledButton, StyledList } from './styled';
import { ItemIndexStyle } from 'pages/PurchaseOrders/styled';

const DashboardWidgetsToggle = memo(() => {
  const params = useParams();
  const history = useHistory();
  const { dashboardGetBySlug, dashboardBySlugLoading, dashboardBySlugCalled, dashboard } = useDashboard();
  const {
    dashboardWidgetToggle,
    dashboardWidgetToggleSaving,
    dashboardWidgetToggleCalled,
    dashboardWidgetToggleResult,
  } = useDashboardWidget();
  const { setPageProps, appPages } = useContext(AppContext);
  const [widgets, setWidgets] = useState([]);
  const [allWidgets, setAllWidgets] = useState([]);
  const [keyword, setKeyword] = useState('');

  const goBack = useCallback(() => {
    history.push(strReplace(appPages.keys['dashboards'].url, params));
  }, [history, appPages, params]);

  const handleClickSave = () => {
    const newStatuses = flatten(
      widgets.map((dw) => {
        return dw.ids.map((id) => {
          return {
            dashboardWidgetId: id,
            statusId: dw.statusId,
          };
        });
      }),
    );

    logger.debug('Saving dashboard widgets statuses:', newStatuses);

    dashboardWidgetToggle({ dashboardId: dashboard.data.id, dashboardWidgetToggle: newStatuses });
  };

  useEffect(() => {
    // Initial loading of a dashboard by slug along with the dashboard widgets

    if (dashboardBySlugLoading || params.slug === dashboard.data?.slug || dashboardBySlugCalled) {
      return;
    }

    if (dashboard.errors.length > 0) {
      return;
    }

    logger.debug('Load dashboard and its widgets by its slug:', params.slug);

    dashboardGetBySlug(params.slug);
  }, [dashboard, dashboardBySlugLoading, dashboardGetBySlug, dashboardBySlugCalled, params]);

  useEffect(() => {
    // Settings dashboard widgets available for changing status after the dashboard is loaded

    if (dashboardBySlugLoading) {
      return;
    }

    const widgets = (dashboard.data?.dashboardWidgets || []).map((dw) => {
      return {
        id: dw[0].id,
        label: dw.map((item) => item.widgetName || item?.widget?.widgetName).join('/'),
        statusId: dw[0].statusId,
        ids: dw.map((item) => item.id),
      };
    });

    logger.debug('Preparing widgets for rendering in the table:', widgets);

    setWidgets(widgets);
    setAllWidgets(widgets);
  }, [dashboard, dashboardBySlugLoading]);

  useEffect(() => {
    // Going back to the dashboard after new dashboard widgets status is successfully setup

    if (!dashboardWidgetToggleCalled || dashboardWidgetToggleSaving) {
      return;
    }

    if (dashboardWidgetToggleResult.errors.length > 0) {
      return;
    }

    goBack();
  }, [dashboardWidgetToggleSaving, dashboardWidgetToggleCalled, dashboardWidgetToggleResult, goBack]);

  const filteredWidgets = useMemo(() => {
    let result = allWidgets;
    if (keyword) {
      result = allWidgets.filter((widget) => search(String(widget.label), keyword) !== -1);
    }
    return result;
  }, [keyword, allWidgets]);

  if (dashboardBySlugLoading) {
    return <DataLoading />;
  }

  const columnsConfig = [
    { field: 'label', width: 250, bold: true },
    {
      field: 'statusId',
      align: 'right',
      width: 10,
      onRender: (args) => {
        const { dataRow, value } = args;
        return (
          <Switch
            name={dataRow?.id}
            value={Number(value) === 100}
            onChange={(name, value) => {
              const updatedWidgets = widgets.map((item) => {
                if (item.id === dataRow.id) {
                  item.statusId = value ? 100 : 0;
                }

                return item;
              });

              setWidgets([...updatedWidgets]);
            }}
          />
        );
      },
    },
  ];

  // if (['PROD'].indexOf(appSettings.appEnvironment) !== -1) {
  //   return <DisplayNoData message='The page is in development' />;
  // }

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
        <StyledList>
          <ToolBarItem>
            <Search
              dataEl='searchInput'
              label={getText('generic.search')}
              name='keyword'
              value={keyword}
              onChange={(name, value, e) => {
                setKeyword(value); // introduce the state
              }}
              disabled={dashboardBySlugLoading}
            />
          </ToolBarItem>
          {!dashboardBySlugLoading && widgets.length > 0 ? (
            <Fragment>
              <RecursiveDataTable noHeaders subHeaders={columnsConfig} data={[{ children: filteredWidgets }]} />
              {!dashboardWidgetToggleSaving && dashboardWidgetToggleResult.errors.length > 0 && (
                <StyledButton>
                  <DisplayApiErrors errors={dashboardWidgetToggleResult.errors} />
                </StyledButton>
              )}
              <StyledButton>
                <ButtonsCancelSave
                  canSave
                  onCancel={() => goBack()}
                  onSave={() => handleClickSave()}
                  centered
                  inProgress={dashboardWidgetToggleSaving}
                />
              </StyledButton>
            </Fragment>
          ) : null}
        </StyledList>

        {!dashboardBySlugLoading && widgets.length === 0 ? (
          <DisplayNoData message={getText('dashboard.noWidgets')} />
        ) : null}
      </Fragment>
    </Fragment>
  );
});

DashboardWidgetsToggle.displayName = 'DashboardWidgetsToggle';

export { DashboardWidgetsToggle };
