import { useState, useEffect, useContext } from 'react';
import { useCustomTableRowColumn, useCustomTableRowColumnCfg } from '../../../../graphql';
import { inputTypeId, CUSTOM_COLUMN_MODE, WIDGET_ID } from '../constants';
import logger from 'utils/logger';
import { mapCustomTableRowColumnCfg, updateLocalFormFields, getCustomDate, getOrderNo } from '../utils';
import { AppContext, ToastContext } from 'contexts';
import { formatQueryErrors, getText } from 'utils';

export const usePrimaryTableColumnAddEdit = ({ args }) => {
  const {
    hideDrawer,
    mode,
    customTable,
    columnId,
    slug,
    onDashboardGet,
    widgetId,
    widgetPeriods,
    currentPeriod,
    columnName,
    columnIndex,
    onPerformanceColumn,
    statusOfPerformanceIndicator,
  } = args;
  const { customTableRowColumnGet, customTableRowColumnCreate, customTableRowColumnUpdate, customTableRowColumn } =
    useCustomTableRowColumn();
  const customTableTypeId = customTable?.customTableTypeId;
  const { customTableRowColumnCfgList, customTableRowColumnCfg } = useCustomTableRowColumnCfg();
  const { dashboards } = useContext(AppContext);

  const { showToast } = useContext(ToastContext);

  const [columnState, updateState] = useState({
    data: mode === CUSTOM_COLUMN_MODE.EDIT ? null : { overrideDefaultPeriod: false },
    errors: [],
    columnConfig: null,
    mode: mode ?? CUSTOM_COLUMN_MODE.EDIT, //edit by default
    customTable: customTable,
    customTableTypeId: customTableTypeId, //1 by property, 2 by revenue, it is retrieved from column configuration query
    widgetPeriods: widgetPeriods || [],
    currentPeriod: currentPeriod,
    widgetId: widgetId,
  });

  // only here so we can use one use effect for everything when getting data back
  // possible actions: get, create, update, delete
  const [action, setAction] = useState('get');

  useEffect(() => {
    if (columnId) {
      customTableRowColumnGet(columnId);
    }
    // in all cases we need to get configuration, both for edit and add...
    // no id, we're in add column...
    if (customTableTypeId) {
      customTableRowColumnCfgList({ customTableTypeId });
    }
  }, [columnId, customTableRowColumnGet]);

  // get configuration when adding new column...
  useEffect(() => {
    if (customTableRowColumnCfg?.data || customTableRowColumnCfg?.errors?.length) {
      // no errors
      if (customTableRowColumnCfg?.data && !customTableRowColumnCfg?.errors?.length) {
        if (!customTableRowColumnCfg.data?.length) {
          // condition if no data is available
          // no data
          // should not happen!!!
          showToast({
            severity: 'error',
            message: getText('generic.genericToastError'),
          });
          hideDrawer();
        } else {
          const columnConfig = mapCustomTableRowColumnCfg(customTableRowColumnCfg.data);
          logger.debug('Column configuration is: ', columnConfig, customTableRowColumnCfg.data);
          updateState((state) => ({
            ...state,
            columnConfig,
            customTableTypeId: customTableRowColumnCfg.data[0]?.customTableTypeId || 1, // by property default
          }));
        }
      } // errors...
      else if (customTableRowColumnCfg?.errors?.length) {
        logger.debug('Error when getting a configuration: ', customTableRowColumn?.errors);
        showToast({
          severity: 'error',
          message: getText('generic.genericToastError'),
        });
        hideDrawer();
      }
    }
    // TODO use proper state from graphQL here
  }, [customTableRowColumnCfg]);

  useEffect(() => {
    const lastAction = action;
    //setAction('get');
    if (customTableRowColumn?.data || customTableRowColumn?.errors?.length) {
      // no errors
      if (customTableRowColumn?.data && !customTableRowColumn?.errors?.length) {
        if (!customTableRowColumn.data?.length) {
          // condition if no data is available
          // no data
          logger.debug('Failed to get column, no data!');
          showToast({
            severity: 'error',
            message: getText('generic.genericToastError'),
          });
        } else {
          const data = customTableRowColumn.data[0];
          logger.debug('Received custom column on ', lastAction, ':', data);
          let columnConfig = [inputTypeId.kpiId, inputTypeId.valueDataType, inputTypeId.valueDateOffsetType];
          // dataSourceId: 9 - calculated, 4 - kpi
          // use formula selector for this one
          if (data.dataSourceId === 9) {
            columnConfig = [inputTypeId.formula, inputTypeId.valueTypeId];
          }

          if (lastAction === 'create') {
            hideDrawer();
            showToast({
              message: data.name
                ? `${getText('widgets.successfullyCreatedColumn')}, ${data.name}`
                : `${getText('widgets.successfullyCreatedColumn')}!`,
            });

            setAction('get');
            onDashboardGet(dashboards?.slugs?.[slug]?.id);
          } else if (lastAction === 'update') {
            hideDrawer();
            showToast({
              message: data.name
                ? `${getText('widgets.successfullyUpdatedColumn')}, ${data.name}`
                : `${getText('widgets.successfullyUpdatedColumn')}!`,
            });
            setAction('get');
            onDashboardGet(dashboards?.slugs?.[slug]?.id);
          }

          updateState((state) => ({
            ...state,
            data: updateLocalFormFields(data, mode, statusOfPerformanceIndicator),
            columnConfig,
          }));
        }
      } // errors...
      else if (customTableRowColumn?.errors?.length) {
        logger.debug('Errors when getting a column: ', customTableRowColumn?.errors);
        showToast({
          severity: 'error',
          message: getText('generic.genericToastError'),
        });
        updateState((state) => ({
          ...state,
          errors: formatQueryErrors(customTableRowColumn.errors),
        }));
      }
    }
  }, [customTableRowColumn]);

  const onCancel = () => {
    hideDrawer();
  };

  const onAddNew = (values) => {
    logger.debug('Adding new custom column with values:', values);
    // TODO this is quick FE error check if BE is not implemented

    let valueDecimals = null;

    if (values?.overrideDecimalMaster && values?.valueDecimals === '') {
      valueDecimals = 0;
    } else if (values?.overrideDecimalMaster && values?.valueDecimals >= 0) {
      valueDecimals = values.valueDecimals;
    }

    const params = {
      customTableId: customTable.id,
      thisIsRow: false,
      name: values?.name,
      // if formula is present then 9 - calculated else 4 - kpi
      dataSourceId: values?.formula ? 9 : 4,
      mdoGlCode: values?.mdoGlCode,
      kpiId: values?.kpiId,
      brandId: values?.brandId,
      priority: values?.priority,
      description: values?.description,
      period: values?.period,
      valueDataType: values?.valueDataType,
      valueDateOffsetType: values?.valueDateOffsetType,
      // TODO if I pass in zero, cannot show table. TBD in BE
      aggregator: values?.aggregator ?? '',
      formula: values?.formula ?? '',
      rowColumnKey: values?.name,
      orderNo: getOrderNo(columnState.customTable),
      customDate: getCustomDate(values?.year, values?.month),
      valueDecimals: valueDecimals,
    };

    // possible actions: get, create, update, delete
    setAction('create');
    logger.debug('Create custom column with params: ', params);

    customTableRowColumnCreate(params);
  };

  const onUpdate = (values, inputData) => {
    logger.debug('Updating custom column with values:', values, inputData);

    const id = inputData?.id;
    const params = inputData;
    // copy changed values to the input data...
    for (const [key, value] of Object.entries(values)) {
      params[key] = value;
    }

    onPerformanceColumn({
      performanceIndicatorMasterOverride: params.performanceIndicatorMasterOverride,
      columnName,
      columnIndex,
    });

    // scrap id, month and year
    delete params.id;
    delete params.month;
    delete params.year;
    delete params.brandDescription;

    if (!params.overrideDefaultPeriod && widgetId === WIDGET_ID.BY_PROPERTY) {
      params.period = null;
    }
    delete params.overrideDefaultPeriod;

    let valueDecimals = null;

    if (inputData.overrideDecimalMaster && inputData.valueDecimals === '') {
      valueDecimals = 0;
    } else if (inputData.overrideDecimalMaster && inputData.valueDecimals >= 0) {
      valueDecimals = inputData.valueDecimals;
    }

    params.valueDecimals = valueDecimals;
    delete params.overrideDecimalMaster;

    // possible actions: get, create, update, delete
    setAction('update');

    params.customDate = getCustomDate(values?.year, values?.month);
    logger.debug('Update custom column with params: ', { id, params });
    const { performanceIndicatorMasterOverride, ...rest } = params;
    
    customTableRowColumnUpdate(id, rest);
  };

  return { state: columnState, onCancel, onAddNew, onUpdate };
};