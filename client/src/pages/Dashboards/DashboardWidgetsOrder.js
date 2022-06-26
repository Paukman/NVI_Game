import React, { memo, useEffect, useContext, useState, Fragment, useCallback } from 'react';
import { flatten } from 'lodash';
import { useParams, useHistory } from 'react-router-dom';
import { Button, colors, ToolBar, ToolBarItem, DragDropList } from 'mdo-react-components';

import { useDashboard, useDashboardWidget } from '../../graphql';
import { AppContext } from 'contexts';
import { DataLoading, DisplayApiErrors, ButtonsCancelSave, DisplayNoData } from 'components';

import logger from 'utils/logger';
import { getText } from 'utils/localesHelpers';
import { strReplace } from 'utils/formatHelpers';
import { StyledDragDropList, StyledList, StyledButton } from './styled';
/**
 * TODO: Complete the page when drag-and-drop list is implemented
 *
 * Make sure that when drag and drop happens then `widgets` state gets updated with new order
 */
const WIDTH = 265;
const DashboardWidgetsOrder = memo(() => {
  const params = useParams();
  const history = useHistory();
  const { dashboardGetBySlug, dashboardBySlugLoading, dashboardBySlugCalled, dashboard } = useDashboard();
  const {
    dashboardWidgetSetOrder,
    dashboardWidgetSettingOrder,
    dashboardWidgetSetOrderCalled,
    dashboardWidgetSetOrderResult,
    dashboardWidgets,
  } = useDashboardWidget();
  const { setPageProps, appPages } = useContext(AppContext);
  const [widgets, setWidgets] = useState([]);

  const goBack = useCallback(() => {
    history.push(strReplace(appPages.keys['dashboards'].url, params));
  }, [history, appPages, params]);

  const handleChangeOrder = (value) => {
    console.log('Widgets order has changed to:', value);
    setWidgets(value);
  };

  const handleClickSave = useCallback(() => {
    const newOrder = flatten(
      widgets.map((dw) => {
        return dw.ids.map((id) => {
          return id;
        });
      }),
    );

    logger.debug('Saving widgets order:', newOrder);

    dashboardWidgetSetOrder({
      dashboardId: dashboard.data.id,
      dashboardWidgetId: newOrder,
    });
  }, [dashboardWidgetSetOrder, dashboard, widgets]);

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
    // Setting page title according to the loaded dashboard

    if (dashboard.data) {
      logger.debug('Setting page title with the dashboard name:', dashboard.data.dashboardName);

      setPageProps({
        title: strReplace(getText('dashboard.titles.changeOrder'), dashboard.data),
      });
    }
  }, [dashboard, setPageProps]);

  useEffect(() => {
    // Settings dashboard widgets available for changing status after the dashboard is loaded

    if (dashboardBySlugLoading) {
      return;
    }

    const widgets = (dashboard.data?.dashboardWidgets || []).map((dw) => {
      return {
        id: dw[0].id,
        label: dw.map((item) => item.widgetName || item?.widget?.widgetName).join('/'),
        ids: dw.map((item) => item.id),
        alwaysTop: dw[0].alwaysFirst,
      };
    });

    logger.debug('Preparing widgets for rendering in the table:', widgets);

    setWidgets(widgets);
  }, [dashboard, dashboardBySlugLoading]);

  useEffect(() => {
    // Going back to the dashboard after new dashboard widgets order is successfully setup

    if (!dashboardWidgetSetOrderCalled || dashboardWidgetSettingOrder) {
      return;
    }

    if (dashboardWidgets.errors.length > 0) {
      return;
    }

    goBack();
  }, [dashboardWidgets, dashboardWidgetSettingOrder, dashboardWidgetSetOrderCalled, goBack]);

  if (dashboardBySlugLoading) {
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
        {!dashboardBySlugLoading && widgets.length > 0 ? (
          <Fragment>
            <StyledList>
              <StyledDragDropList>
                <DragDropList
                  itemsData={widgets}
                  //onChange={setOrderedList}
                  onChange={handleChangeOrder}
                  backgrounds={{
                    background: colors.white,
                    draggingBackground: colors.blue,
                    draggingOverBackground: colors.grey,
                  }}
                  width={'auto'}
                />
              </StyledDragDropList>
              {!dashboardWidgetSettingOrder && dashboardWidgetSetOrderResult.errors.length > 0 && (
                <StyledButton>
                  <DisplayApiErrors errors={dashboardWidgetSetOrderResult.errors} />
                </StyledButton>
              )}
              <StyledButton>
                <ButtonsCancelSave
                  canSave
                  onCancel={() => goBack()}
                  onSave={() => handleClickSave()}
                  centered
                  inProgress={dashboardWidgetSettingOrder}
                />
              </StyledButton>
            </StyledList>
          </Fragment>
        ) : null}
        {!dashboardBySlugLoading && widgets.length === 0 ? (
          <DisplayNoData message={getText('dashboard.noWidgets')} />
        ) : null}
      </Fragment>
    </Fragment>
  );
});

DashboardWidgetsOrder.displayName = 'DashboardWidgetsOrder';

export { DashboardWidgetsOrder };
