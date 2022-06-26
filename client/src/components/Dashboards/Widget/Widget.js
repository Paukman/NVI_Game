import React, { createRef, useCallback, useEffect, useState, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router';
import {
  Button,
  ChartCard,
  mapArrayBy,
  Grid,
  GridItem,
  Toggle,
  ButtonDownloadAs,
  InputDate,
} from 'mdo-react-components';

import {
  DataLoading,
  DisplayApiErrors,
  DisplayNoData,
  CustomRangePeriodSelector,
  PeriodSelector,
  useIfPermitted,
} from 'components';
import { GssAssignedPrioritiesDropdown } from 'components/Gss/GssAssignedPrioritiesDropdown';
import { useWidget } from '../../../graphql';

import {
  AppContext,
  DashboardContext,
  HotelContext,
  DrawerContext,
  DialogContext,
  GlobalFilterContext,
} from 'contexts';

import { GaugeValue } from './GaugeValue';
import { GraphValue } from './GraphValue';
import { NumberValue } from './NumberValue';
import { PieValue } from './PieValue';
import { TableValue } from './TableValue';
import { ColumnChartValue } from './ColumnChartValue';
import { AreaGraphValue } from './AreaGraphValue';
import { InvalidValue } from './InvalidValue';

import { Content, WidgetWrapper, PeriodStyling, StartDateStyling, EndDateStyling } from './styled';
import logger from 'utils/logger';
import dayjs from 'dayjs';
import { castArray } from 'lodash';
import { useIsByRevenueOrProperty } from './hooks/useIsByRevenueOrProperty';
import { useTableData, useWindowDimensions } from 'hooks';
import { DownloadableReportNames } from 'config/downlodableReportNames';
import {
  buildDownloadableFilename,
  exportToXLSX,
  strReplace,
  getText,
  isElementInView,
  isDashboardDateValid,
  findDepth,
  isDateValid,
  isKeyPresent,
  removeElementFromArray,
  buildMissingDateFileName,
} from 'utils';
import { WIDGET_ID, CUSTOM_COLUMN_MODE, DATE_RANGE, missingDateColumns } from './constants';
import { AddEditDashboardComment, PrimaryTableColumnAddEdit, MasterDecimalSelector } from './components';

import { useDeleteCustomColumn, useMissingDates } from './hooks';
import { APP_KEYS } from 'config/appSettings';

const mapValues = {
  1: TableValue,
  2: NumberValue,
  3: GaugeValue,
  4: GraphValue,
  5: PieValue,
  6: ColumnChartValue,
  7: AreaGraphValue,
};

const Widget = (props) => {
  const { dashboard, dashboardWidget, hotelId, date, period, containerRef, customError } = props;
  const { customTableState, onHandleActions, onUserSettingsSetValue, onChangeCustomTableData, dashboardGet } =
    useContext(DashboardContext);
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const { portfolio } = useContext(GlobalFilterContext);

  const castedArray = castArray(dashboardWidget);

  const { active, setActive } = useIsByRevenueOrProperty(castedArray, customTableState?.isRevenueSelected);

  const { widgetCalculate, widgetCalculationLoading, widgetCalculation } = useWidget();
  const { appPages } = useContext(AppContext);
  const { hotelGroupId, hotelsMap, hotelsGroupsMap } = useContext(HotelContext);
  const [state, updateState] = useState({
    period: active.dashboardWidget?.defaultPeriod ?? '',
    startDate: portfolio?.primaryDashboardDate ?? new Date().setDate(new Date().getDate() - 1),
    endDate: portfolio?.primaryDashboardDate ?? new Date().setDate(new Date().getDate() - 1),
    dateRangeJustSelected: false,
    priority: 1,
    requestReport: true,
  });
  const [dataRequested, setDataRequested] = useState(false);
  const [missingCsvData, setMissingCsvData] = useState([]);
  const ref = createRef();
  const history = useHistory();
  const { deleteColumn } = useDeleteCustomColumn();
  const { onRequestTableData, onGetGroupData, tableData: resultData, groupTableData } = useTableData();
  const { showDialog, hideDialog } = useContext(DialogContext);
  const { showDrawer, hideDrawer } = useContext(DrawerContext);

  const { state: missingDownloadData } = useMissingDates(
    active.dashboardWidget?.widget?.id,
    dashboard?.data?.id,
    active.dashboardWidget?.defaultPeriod ?? '',
    date,
    hotelId,
  );

  const { isPermitted } = useIfPermitted({ dashboardPage: 'primary' });

  const getMissingDownloadData = (data) => {
    setMissingCsvData(data);
  };

  const handleChangePeriod = useCallback(
    (name, value) => {
      const isPeriod = name === 'period';
      const requestReport = (isPeriod && value !== DATE_RANGE) || (value === DATE_RANGE && !isPeriod) ? true : false;
      updateState((prevState) => ({
        ...prevState,
        [name]: value,
        requestReport: requestReport,
        dateRangeJustSelected: isPeriod && value === DATE_RANGE && state.period !== DATE_RANGE,
      }));

      setDataRequested(false);
    },
    [state],
  );

  useEffect(() => {
    if (state?.period !== DATE_RANGE && date && isDateValid(date)) {
      updateState((prevState) => ({
        ...prevState,
        startDate: portfolio?.primaryDashboardDate ?? new Date().setDate(new Date().getDate() - 1),
        endDate: portfolio?.primaryDashboardDate ?? new Date().setDate(new Date().getDate() - 1),
      }));
    }
  }, [date, state.period]);

  const onCustomRangeUpdate = useCallback(() => {
    loadData(true);
    updateState((prevState) => ({
      ...prevState,
      requestReport: true,
      dateRangeJustSelected: true,
    }));
  }, [state]);

  const handleChangePriority = useCallback((name, value) => {
    updateState((prevState) => ({
      ...prevState,
      priority: value,
    }));
    setDataRequested(false);
  }, []);

  const loadData = useCallback(
    (enforce) => {
      if (
        (dataRequested && !enforce) ||
        !isDashboardDateValid(date) ||
        customTableState?.isAddEditDrawerOpen ||
        (state.period === DATE_RANGE &&
          !state.requestReport &&
          (!isDateValid(state.startDate) || !isDateValid(state.endDate))) ||
        (state.period === DATE_RANGE && !state.dateRangeJustSelected)
      ) {
        return;
      }

      const widget = active.dashboardWidget.widget;
      if (state.period || !widget.periods) {
        const params = {
          hotelId,
          items: [
            {
              widgetId: widget.id,
              date,
              period: state.period || period,
              priority: state.priority,
              budgetNumber: null,
              forecastNumber: null,
            },
          ],
        };

        if (state.period === DATE_RANGE) {
          params.items[0].startDate = isDateValid(state.startDate) ? dayjs(state.startDate).format('YYYY-MM-DD') : null; //state.startDate;
          params.items[0].endDate = isDateValid(state.endDate) ? dayjs(state.endDate).format('YYYY-MM-DD') : null; //state.endDate;
          delete params.items[0].period;
          delete params.items[0].date;
        }

        widgetCalculate(params);
        setDataRequested(true);
      }
    },
    [dataRequested, widgetCalculate, hotelId, date, state, active, period],
  );

  const onRefreshWidget = ({ widgetId }) => {
    if (active.dashboardWidget.widget.id !== widgetId) {
      return;
    }
    //force reload of active widget
    loadData(true);
  };
  const onDashboardGet = (id) => {
    if (dashboard?.data?.id === id) {
      dashboardGet(id);
    }
  };

  useEffect(() => {
    setDataRequested(false);
  }, [date, hotelId, state.period, active, period]);

  useEffect(() => {
    const reference = containerRef?.current;
    const widget = dashboard.dashboardWidgets?.[active?.dashboardWidget?.widget?.id];

    const handleScroll = (event) => {
      if (isElementInView(reference, ref.current)) {
        // Trigger load if no data loaded yet when the widget becomes visible when scrolling
        loadData();
      }
    };

    if (reference) {
      reference.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (reference) {
        reference.removeEventListener('scroll', handleScroll);
      }
    };
  }, [ref, containerRef, active, dashboard, loadData]);

  useEffect(() => {
    if (!containerRef?.current) {
      loadData();
    } else if (isElementInView(containerRef.current, ref.current)) {
      loadData();
    }
  }, [loadData, containerRef, ref]);

  const handleDownloadAs = ({ value }) => {
    let indents = [];
    if (groupTableData?.isGroupedByProperty) {
      findDepth(groupTableData?.groupData, indents);
    }

    if (missingCsvData && value === 'missingDates') {
      const csvData = missingCsvData?.length ? missingCsvData : missingDateColumns;

      exportToXLSX(
        csvData,
        buildMissingDateFileName(DownloadableReportNames.missingDates, state?.period, state?.startDate, state?.endDate),
        'csv',
        '',
        {
          isHeader: false,
          style: true,
          indents,
        },
      );
    } else if (dashboard?.data && Array.isArray(resultData) && resultData?.length) {
      const excelData = resultData.map((item) => {
        const obj = Object.keys(item).reduce((acc, key) => {
          if (key == 1) return acc;
          if (item[key] === '' || item[key] === null) {
            acc[key == 'name' ? '' : key] = 'N/A';
          } else {
            acc[key == 'name' ? '' : key] = item[key];
          }

          return acc;
        }, {});
        return obj;
      });
      exportToXLSX(
        excelData,
        buildDownloadableFilename({
          reportName: DownloadableReportNames.primaryDashboard,
          hotelName: hotelsMap[hotelId]?.hotelName,
          hotelGroupName: hotelsGroupsMap[hotelGroupId]?.groupName,
          date,
        }),
        value == 'excel' ? 'xlsx' : value,
        '',
        {
          isHeader: false,
          style: true,
          indents,
        },
      );
    }
  };

  const activeDashboardWidget = active.dashboardWidget;

  const widget = dashboard.dashboardWidgets?.[activeDashboardWidget?.widget?.id] || {};
  const widgetTypeId = activeDashboardWidget?.widgetTypeId || widget?.widgetTypeId;
  const WidgetValue = mapValues[widgetTypeId] || InvalidValue;
  const widgetPeriods = widget?.periods;
  const widgetName = activeDashboardWidget.widgetName || activeDashboardWidget?.widget?.widgetName || '';
  const multiplePropsNoSupported = !widget.supportsMultipleProperties && hotelId.length > 1;
  const hasPriorities = widget.hasPriorities;
  const canChangePeriod =
    activeDashboardWidget?.canChangePeriod != null ? activeDashboardWidget?.canChangePeriod != null : true;
  const canChangePriority =
    activeDashboardWidget?.canChangePriority != null ? activeDashboardWidget?.canChangePriority : true;

  const mapWidgetValues = Array.isArray(widget?.widgetValues) ? mapArrayBy(widget.widgetValues, 'id') : {};
  widget.mapWidgetValues = mapWidgetValues;

  const toggles = useMemo(() => {
    return castArray(dashboardWidget).map((item) => item.widgetShortName || item.widgetName || item.widget?.widgetName);
  }, [dashboardWidget]);

  const periods = !multiplePropsNoSupported && widgetPeriods && canChangePeriod;
  const priorities = !multiplePropsNoSupported && hasPriorities && canChangePriority;
  const edit = false;
  const refresh = true;
  const hasToggles = toggles?.length > 1;

  const [width, updateWidth] = useState(`${(100 / dashboard.data.columnsQty) * (active.dashboardWidget?.width || 1)}%`);
  const [performanceColumn, onPerformanceColumn] = useState({});
  const [performanceColumnIds, setPerformanceColumnIds] = useState(
    customTableState?.userSettings && customTableState?.userSettings.length
      ? customTableState?.userSettings[0]?.userSettingValue?.split(',').map((item) => Number(item))
      : [],
  );

  useEffect(() => {
    if (windowWidth < 768 && active.dashboardWidget?.width < 2) {
      updateWidth(`${(100 / 1) * (active.dashboardWidget?.width || 1)}%`);
    } else if (windowWidth >= 768 && windowWidth < 1200 && active.dashboardWidget?.width < 2) {
      updateWidth(`${(100 / 2) * (active.dashboardWidget?.width || 1)}%`);
    } else {
      updateWidth(`${(100 / dashboard.data.columnsQty) * (active.dashboardWidget?.width || 1)}%`);
    }
  }, [updateWidth, windowWidth]);

  let height = activeDashboardWidget.height; // 1 or 0

  if (widget.id === WIDGET_ID.BY_REVENUE && multiplePropsNoSupported) {
    // have to think of a better way perhaps instead of hardcoding
    height = null; // make it smaller when not supporting multiple properites
  }
  const onAddDashboardComment = () => {
    const args = {
      dashboardId: dashboard?.data?.id,
      hideDrawer: hideDrawer,
      onHandleAddComment: onRefreshWidget,
      widgetId: widget.id,
    };
    showDrawer({
      content: <AddEditDashboardComment args={args} />,
    });
  };

  const onViewAllComments = (hotelId) => {
    if (isKeyPresent(appPages, APP_KEYS.DASHBOARD_PRIMARY_COMMENTS)) {
      history.push({
        pathname: strReplace(appPages.keys[APP_KEYS.DASHBOARD_PRIMARY_COMMENTS].url, {
          slug: dashboard?.data?.slug,
        }),
        state: { hotelId: hotelId },
      });
    } else {
      logger.debug(`Page ${APP_KEYS.DASHBOARD_PRIMARY_COMMENTS} not present`);
    }
  };

  const onAddNewCustomColumn = () => {
    const args = {
      slug: dashboard.data?.slug,
      mode: CUSTOM_COLUMN_MODE.ADD,
      customTable: widget?.widgetValues?.[0]?.customTable,
      onDashboardGet,
      widgetId: widget.id,
      hideDrawer: hideDrawer,
      widgetPeriods: widget?.periods,
      currentPeriod: state?.period,
    };

    showDrawer({
      content: <PrimaryTableColumnAddEdit args={args} />,
    });
  };

  const onEditCustomColumn = ({ id, name, index }) => {
    const args = {
      slug: dashboard.data?.slug,
      mode: CUSTOM_COLUMN_MODE.EDIT,
      customTable: widget?.widgetValues?.[0]?.customTable,
      onDashboardGet,
      widgetId: widget.id,
      hideDrawer: hideDrawer,
      columnId: id,
      widgetPeriods: widget?.periods,
      currentPeriod: state?.period,
      columnIndex: index,
      columnName: name,
      onPerformanceColumn,
      statusOfPerformanceIndicator: performanceColumnIds.includes(index),
    };

    showDrawer({
      content: <PrimaryTableColumnAddEdit args={args} />,
    });
  };

  useMemo(() => {
    if (
      performanceColumn?.performanceIndicatorMasterOverride == 'On' &&
      !performanceColumnIds.includes(performanceColumn?.columnIndex)
    ) {
      setPerformanceColumnIds([...performanceColumnIds, performanceColumn?.columnIndex]);
    } else if (
      performanceColumn?.performanceIndicatorMasterOverride == 'Off' &&
      performanceColumnIds.includes(performanceColumn?.columnIndex)
    ) {
      let arr = performanceColumnIds;
      const removedPerformanceId = removeElementFromArray(arr, performanceColumn?.columnIndex);

      setPerformanceColumnIds(removedPerformanceId);
    }
  });

  useMemo(() => {
    onUserSettingsSetValue(performanceColumnIds.map((item) => item).join(','));
  }, [performanceColumnIds]);

  const onDeleteColumn = ({ id, name }) => {
    if (!id) {
      logger.debug('This column does not have id', { id, name });
      return;
    }
    deleteColumn({ id, name });
  };

  return (
    <WidgetWrapper width={width} ref={ref} height={height}>
      <ChartCard
        elevation={3}
        id={`id-${widgetName}`}
        titleMargin={3}
        chartPadding={'12px 32px 18px 24px'}
        title={
          hasToggles ? (
            <Grid container spacing={1} direction='row' justify='space-between' alignItems='center'>
              <GridItem xs={2}>
                <Grid container direction='row' justify='flex-start' alignItems='center'>
                  <div style={{ paddingBottom: '16px' }}>
                    <GridItem>{widgetName}</GridItem>
                  </div>
                  {refresh && (
                    <div style={{ paddingBottom: '16px' }}>
                      <GridItem>
                        <Button
                          iconName='Refresh'
                          title={getText(`generic.refresh`)}
                          variant='tertiary'
                          onClick={() => {
                            loadData(true);
                          }}
                          disabled={widgetCalculationLoading}
                          dataEl={`buttonRefresh${widgetName}`}
                        />
                      </GridItem>
                    </div>
                  )}
                </Grid>
              </GridItem>
              <GridItem xs={10}>
                {!customTableState?.customTableEnabled && (
                  <Grid container direction='row' justify='flex-end' alignItems='flex-start'>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      {isPermitted('comment') && (
                        <Button
                          iconName='AddComment'
                          variant='tertiary'
                          title={getText('generic.addComment')}
                          onClick={onAddDashboardComment}
                          disabled={widgetCalculationLoading}
                          dataEl={'buttonAddComment'}
                        />
                      )}
                      {isPermitted('comment') && (
                        <Button
                          iconName='Comment'
                          variant='tertiary'
                          title={getText('dashboard.comments')}
                          onClick={() => {
                            if (isKeyPresent(appPages, APP_KEYS.DASHBOARD_PRIMARY_COMMENTS)) {
                              history.push({
                                pathname: strReplace(appPages.keys[APP_KEYS.DASHBOARD_PRIMARY_COMMENTS].url, {
                                  slug: dashboard?.data?.slug,
                                }),
                              });
                            }
                          }}
                          disabled={widgetCalculationLoading}
                          dataEl={'buttonComments'}
                        />
                      )}
                      {isPermitted('download-widget') && (
                        <ButtonDownloadAs
                          variant='tertiary'
                          text=''
                          title={getText('generic.download')}
                          exclude={['pdf']}
                          onClick={handleDownloadAs}
                          disabled={widgetCalculationLoading}
                          include={[
                            {
                              label: getText('generic.missingDates'),
                              value: 'missingDates',
                              icon: '',
                            },
                          ]}
                          dataEl={'buttonDownloadAs'}
                        />
                      )}

                      {isPermitted('edit') && (
                        <Button
                          iconName='Edit'
                          title={getText(`generic.edit`)}
                          variant='tertiary'
                          onClick={() =>
                            onChangeCustomTableData('customTableEnabled', !customTableState?.customTableEnabled)
                          }
                          dataEl='buttonCustomizeTable'
                        />
                      )}
                    </div>
                    <GridItem style={{ marginBottom: '10px', marginRight: '10px', marginLeft: '10px' }}>
                      <Toggle
                        value={active.idx}
                        onChange={(value) => {
                          const activeObj = {
                            idx: value,
                            dashboardWidget: castArray(dashboardWidget)[value],
                          };
                          setActive(activeObj);
                          onChangeCustomTableData('isRevenueSelected', value === 1);
                        }}
                        dataEl='toggleCustomTable'
                      >
                        {toggles.map((item, idx) => {
                          return <span key={idx}>{item}</span>;
                        })}
                      </Toggle>
                    </GridItem>
                  </Grid>
                )}
                {customTableState?.customTableEnabled && (
                  <Grid container direction='row' justify='flex-end' alignItems='flex-start'>
                    {widget.id === WIDGET_ID.BY_PROPERTY && (
                      <MasterDecimalSelector
                        widget={widget}
                        onDashboardGet={onDashboardGet}
                        slug={dashboard.data?.slug}
                      />
                    )}
                    {widget.id === WIDGET_ID.BY_REVENUE && (
                      <MasterDecimalSelector
                        widget={widget}
                        onDashboardGet={onDashboardGet}
                        slug={dashboard.data?.slug}
                      />
                    )}
                    <Button
                      iconName={'Sort'}
                      title={getText(`widgets.orderColumn`)}
                      text={getText(`widgets.orderColumn`)}
                      variant='tertiary'
                      onClick={() => {
                        if (isKeyPresent(appPages, APP_KEYS.DASHBOARD_PRIMARY_TABLE_COLUMN_ORDER)) {
                          history.push({
                            pathname: strReplace(
                              `${appPages.keys[APP_KEYS.DASHBOARD_PRIMARY_TABLE_COLUMN_ORDER].url}`,
                              {
                                slug: dashboard.data?.slug,
                              },
                            ),
                            state: {
                              customTable: widget?.widgetValues?.[0]?.customTable,
                            },
                          });
                        }
                      }}
                      dataEl='buttonOrderColumn'
                    />
                    <GridItem style={{ marginBottom: '10px', marginRight: '10px' }}>
                      <Button
                        iconName='Add'
                        title={getText(`widgets.addColumn`)}
                        text={getText(`widgets.addColumn`)}
                        variant='tertiary'
                        onClick={onAddNewCustomColumn}
                        dataEl='buttonAddAColumn'
                      />
                    </GridItem>
                    <GridItem style={{ marginBottom: '10px', marginRight: '10px' }}>
                      <Button
                        text={getText(`generic.imDone`)}
                        title={getText(`generic.imDone`)}
                        variant='success'
                        onClick={() => onChangeCustomTableData('customTableEnabled', false)}
                        dataEl='buttonFinishCustomization'
                      />
                    </GridItem>
                  </Grid>
                )}
              </GridItem>
            </Grid>
          ) : (
            <Grid container direction='row' justify='flex-start' alignItems='center'>
              <GridItem>{widgetName}</GridItem>
              {refresh && (
                <GridItem>
                  <Button
                    iconName='Refresh'
                    title={getText(`generic.refresh`)}
                    variant='tertiary'
                    onClick={() => {
                      loadData(true);
                    }}
                    disabled={widgetCalculationLoading}
                    dataEl='buttonRefresh'
                  />
                </GridItem>
              )}
            </Grid>
          )
        }
      >
        {hasToggles && <div style={{ marginBottom: '-20px' }} />}
        <Content>
          <Grid justify='space-between'>
            <GridItem xs={hasToggles ? 6 : 12}>
              <Grid container spacing={1} direction='row' justify='flex-start' alignItems='center'>
                {periods && (
                  <GridItem xs={state.period === DATE_RANGE ? 12 : 3}>
                    <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                      <PeriodStyling>
                        <PeriodSelector
                          autoSelectOnNoValue
                          periods={widgetPeriods}
                          onChange={handleChangePeriod}
                          disabled={widgetCalculationLoading}
                          value={state?.period}
                          selectFontSize={14}
                          dataEl='selectorPeriod'
                          label={getText('generic.period')}
                          name='period'
                        />
                      </PeriodStyling>
                      {state.period === DATE_RANGE && (
                        <>
                          <StartDateStyling>
                            <InputDate
                              dataEl='inputDateStartDate'
                              label={getText('generic.fromDate')}
                              name='startDate'
                              onChange={handleChangePeriod}
                              value={state?.startDate}
                              fontSize={14}
                              labelSize={12}
                              iconSize={14}
                              iconPadding={0}
                            />
                          </StartDateStyling>
                          <EndDateStyling>
                            <InputDate
                              dataEl='inputDateEndDate'
                              label={getText('generic.toDate')}
                              name='endDate'
                              onChange={handleChangePeriod}
                              value={state?.endDate}
                              fontSize={14}
                              labelSize={12}
                              iconSize={14}
                              iconPadding={0}
                            />
                          </EndDateStyling>
                          <div style={{ paddingLeft: '8px', paddingTop: '14px' }}>
                            <Button
                              iconName={'Refresh'}
                              text={''}
                              title={getText(`generic.${state?.requestReport ? 'refresh' : 'go'}`)}
                              variant='secondary'
                              onClick={() => {
                                onCustomRangeUpdate();
                              }}
                              dataEl='buttonGo'
                              size={'xsSmall'}
                              width={28}
                              disabled={
                                state?.requestReport ||
                                state?.dateRangeJustSelected ||
                                !isDateValid(state.startDate) ||
                                !isDateValid(state.endDate)
                              }
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </GridItem>
                )}
                {edit && (
                  <GridItem xs={1}>
                    <Button
                      iconName='Edit'
                      title={getText(`generic.edit`)}
                      variant='tertiary'
                      onClick={() => {
                        if (isKeyPresent(appPages, APP_KEYS.DASHBOARD_WIDGETS_EDIT)) {
                          history.push(
                            strReplace(appPages.keys[APP_KEYS.DASHBOARD_WIDGETS_EDIT].url, {
                              slug: dashboard?.data?.slug,
                              id: activeDashboardWidget?.id,
                            }),
                          );
                        }
                      }}
                      disabled={widgetCalculationLoading}
                      dataEl='buttonEdit'
                    />
                  </GridItem>
                )}
                <GridItem xs />
              </Grid>
            </GridItem>
            {!multiplePropsNoSupported && !widgetCalculationLoading && widgetCalculation.data.length > 0 && (
              <GridItem xs={12} style={{ paddingRight: '10px', paddingTop: '16px' }}>
                <div
                  style={{
                    opacity:
                      ((state.dateRangeJustSelected || state?.requestReport) && state.period === DATE_RANGE) ||
                      state.period !== DATE_RANGE
                        ? '1'
                        : '0',
                  }}
                >
                  <WidgetValue
                    widgetCalculation={widgetCalculation}
                    dashboard={dashboard}
                    dashboardWidget={activeDashboardWidget}
                    widget={widget}
                    hotelId={hotelId}
                    date={date}
                    period={state.period}
                    customTableEnabled={customTableState?.customTableEnabled}
                    onRequestTableData={onRequestTableData}
                    onEditCustomColumn={onEditCustomColumn}
                    onDeleteColumn={onDeleteColumn}
                    onGetGroupData={onGetGroupData}
                    onViewAllComments={onViewAllComments}
                    performanceColumnIds={performanceColumnIds}
                    startDate={state.startDate}
                    endDate={state.endDate}
                    missingDownloadData={getMissingDownloadData}
                  />
                </div>
              </GridItem>
            )}
            {priorities && !widgetCalculationLoading && (
              <Grid>
                <GridItem xs={2} />
                <GridItem xs={8}>
                  <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                    <GssAssignedPrioritiesDropdown
                      onChange={handleChangePriority}
                      value={state.priority}
                      name='priority'
                      hotelId={castArray(hotelId)[0]}
                      year={dayjs(date).year()}
                      disabled={widgetCalculationLoading}
                      dataEl='selectorPriority'
                      selectFontSize={14}
                      label={getText('generic.priority')}
                    />
                  </div>
                </GridItem>
                <GridItem xs={2} />
              </Grid>
            )}
          </Grid>
          {!multiplePropsNoSupported && widgetCalculationLoading && <DataLoading />}
          {!multiplePropsNoSupported && !widgetCalculationLoading && widgetCalculation.errors.length > 0 && (
            <DisplayApiErrors errors={widgetCalculation.errors} customError={customError} />
          )}
          {multiplePropsNoSupported && <DisplayNoData message={getText('widgets.multiplePropertiesUnsupported')} />}
        </Content>
      </ChartCard>
    </WidgetWrapper>
  );
};

Widget.displayName = 'Widget';

Widget.propTypes = {
  hotelId: PropTypes.any,
  date: PropTypes.any,
  period: PropTypes.string,
  dashboard: PropTypes.any,
  dashboardWidget: PropTypes.any,
  onLoad: PropTypes.func,
  loading: PropTypes.bool,
  containerRef: PropTypes.any,
};

export { Widget };
