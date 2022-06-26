import React, { Fragment, memo, useEffect, useState, useContext, useCallback } from 'react';

import { buildHierarchy } from 'mdo-react-components';

import { AppContext, GlobalFilterContext, HotelContext } from 'contexts';

import { usePnlReports, useUserSettings } from '../../../graphql';
import { VALUE_DATA_TYPES, VALUE_TYPES, PNL_REPORT_USER_SETTINGS, USER_SETTINGS_TYPES } from 'config/constants';
import { staticData, ADD_CUSTOM_VIEW } from '../constants';

import {
  exportToXLSX,
  buildDownloadableFilename,
  findDepth,
  capitalize,
  search,
  formatDateForApi,
} from 'utils/downloadHelpers';

import logger from 'utils/logger';

import { useHistory } from 'react-router-dom';
import { DownloadableReportNames } from 'config/downlodableReportNames';

import { CellRenderer } from '../CellRenderer';
import { TextCellRenderer } from '../TextCellRenderer';

import { addTopLevelHeadersToItems } from '../pnlHelpers';
import { shouldHideReportRow } from '../utils';
import dayjs from 'dayjs';

import { useTableData, useGetTableHeaders } from 'hooks';
import { usePnLView } from './hooks';

const usePnlMonthly = () => {
  const history = useHistory();
  const { hotelId, portfolio, updateHotelAndGroup, assignGlobalValue } = useContext(GlobalFilterContext);
  const { getPortfolioHotelIds, hotelsMap, hotelsGroupsMap } = useContext(HotelContext);
  const { userSettingsSet, settingsListGet } = useUserSettings();
  const {
    fetchPnlMonthlyReports,
    pnlMonthlyReport,
    loadingMonthlyReport,
    pnlReportGetForecastNumbers,
    pnlForecastNumbers,
    pnlReportGetForecastNumbersLoading,
  } = usePnlReports();

  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    kpi: 'NO_KPI',
    period: portfolio.pnlPeriod,
    columns: [
      {
        dataType: VALUE_DATA_TYPES.ACTUAL,
        yearOffest: 0,
        forecastNumber: 1,
      },
      {
        dataType: VALUE_DATA_TYPES.BUDGET,
        yearOffest: 0,
        forecastNumber: 1,
      },
      {
        dataType: VALUE_DATA_TYPES.FORECAST,
        yearOffest: 0,
        forecastNumber: 1,
      },
      {
        dataType: '',
        yearOffest: 0,
        forecastNumber: 1,
      },
      {
        dataType: '',
        yearOffest: 0,
        forecastNumber: 1,
      },
      {
        dataType: '',
        yearOffest: 0,
        forecastNumber: 1,
      },
    ],
    date: dayjs().add(-1, 'day').toDate(),
    hotelId: hotelId,
    customViewId: '',
    portfolio: portfolio || {},
  });

  const [topHeaders, setTopHeaders] = useState([]);
  const [kpi, setKpi] = useState('');
  const [subHeaders, setSubHeaders] = useState();
  const [pnlReportData, setPnlReportData] = useState([]);
  const [nullRecordsHide, setNullRecordsHide] = useState();

  const [errors, setErrors] = useState([]);
  const [reportRequested, setReportRequested] = useState(false);
  const [requestNo, setRequestNo] = useState(1);
  const { appPages } = useContext(AppContext);

  const { onRequestTableData, tableData } = useTableData();
  const { state: customViewsState } = usePnLView();

  useEffect(() => {
    if (customViewsState.defaultViewId) {
      setFilters((state) => ({
        ...state,
        customViewId: customViewsState.defaultViewId,
      }));
    }
  }, [customViewsState.defaultViewId]);

  const handleFilterChange = useCallback(
    (name, value) => {
      logger.debug('Filter changed:', { name, value });

      const newFilters = {
        ...filters,
        [name]: value,
      };

      if (name === 'date') {
        assignGlobalValue('date', value); // keep globals up to date
      }
      if (name === 'period') {
        assignGlobalValue('pnlPeriod', value); // keep globals up to date
      }
      if (name === 'customViewId' && value === ADD_CUSTOM_VIEW && appPages?.keys['pnl-view']?.url) {
        history.push({
          pathname: appPages.keys['pnl-view'].url,
          state: { key: 'pnl-monthly' },
        });
      }

      setFilters(newFilters);

      if (reportRequested) {
        setReportRequested(false);
      }
    },
    [filters, getPortfolioHotelIds, pnlReportGetForecastNumbers, portfolio, reportRequested],
  );

  const handleSwitchChange = useCallback(
    (_, value) => {
      setNullRecordsHide(value);
      userSettingsSet({
        params: [{ settingCode: PNL_REPORT_USER_SETTINGS.SUPPRESS_ZEROS, userSettingValue: value.toString() }],
      });
    },
    [setNullRecordsHide],
  );

  const handleApplyFitlers = useCallback(
    (newFilters) => {
      logger.debug('Columns filters changed:', newFilters);

      setFilters(newFilters);
      setFilterOpen(false);
      if (reportRequested) {
        setReportRequested(false);
      }
    },
    [setReportRequested, reportRequested],
  );

  const handleChangePortfolio = useCallback(
    (name, value) => {
      logger.debug('Portfolio changed:', value);

      updateHotelAndGroup({ value });

      if (reportRequested) {
        setReportRequested(false);
      }
    },
    [setReportRequested, reportRequested, updateHotelAndGroup],
  );

  const requestReport = useCallback(
    (newFilter) => {
      setErrors([]);

      setPnlReportData([]);

      const currentParams = newFilter || filters;

      const year = currentParams.date?.getFullYear();

      const params2use = {
        hotelId: portfolio.hotelId || getPortfolioHotelIds(currentParams?.portfolio || portfolio),
        date: formatDateForApi(currentParams.date),
        kpi: currentParams.kpi,
        dataTypes: [
          ...currentParams.columns
            .filter((column) => column.dataType)
            .map((column) => {
              return {
                dataType: column.dataType,
                year: year - column.yearOffest,
                forecastNumber: column.forecastNumber,
              };
            }),
        ],
        period: currentParams.period,
        customViewId: currentParams.customViewId,
      };

      logger.debug('Requesting P&L Monthly Report', { params2use });

      fetchPnlMonthlyReports(params2use);

      if (!reportRequested) {
        setReportRequested(true);
      }

      setRequestNo(requestNo + 1);
    },
    [getPortfolioHotelIds, filters, reportRequested, fetchPnlMonthlyReports, portfolio, requestNo],
  );

  const renderHeaders = useCallback(() => {
    logger.debug('Render headers');

    const headers = topHeaders.map((topHeader) => {
      return { span: filters.kpi === 'NO_KPI' ? 1 : 2, content: topHeader.title };
    });
    return [{ span: 1, single: true }, { span: 1, single: true }, ...headers];
  }, [topHeaders, filters.kpi]);

  const getFormattedHeaderTitle = (column) =>
    search(column.title, 'Variance') === -1
      ? `${capitalize(column.title)}${
          [VALUE_DATA_TYPES.FORECAST, VALUE_DATA_TYPES.ACTUAL_FORECAST].indexOf(column.dataType) !== -1
            ? ` - ${column.forecastNumber}`
            : ''
        } - ${column.year}`
      : capitalize(column.title);

  const getFormattedTitleColumnsConfig = () =>
    pnlMonthlyReport?.data?.columnsCfg?.map((column) => ({ ...column, title: getFormattedHeaderTitle(column) }));

  const { subHeader, span } = useGetTableHeaders(getFormattedTitleColumnsConfig());

  const handleDownloadReport = ({ value }) => {
    // double check for additional conditions...
    if (!pnlMonthlyReport?.data || !tableData) {
      return;
    }
    let indents = [];
    let subHeader = [];
    let span = [];
    let count = 1;
    renderHeaders().forEach((item) => {
      subHeader.push(item?.content ? item?.content : '');
      if (item?.single) {
        span.push([count, count]);
        count++;
      } else {
        span.push([count, count + item?.span - 1]);
        count += item?.span;
      }
    });

    findDepth(pnlReportData[0]?.children, indents);

    exportToXLSX(
      tableData,
      buildDownloadableFilename({
        reportName: DownloadableReportNames.pnlMonthly,
        hotelId,
        hotelName: hotelsMap[portfolio.hotelId]?.hotelName,
        hotelGroupName: hotelsGroupsMap[portfolio.hotelGroupId]?.groupName,
        period: filters.period,
        startDate: pnlMonthlyReport.data.startDate,
        endDate: pnlMonthlyReport.data.endDate,
      }),
      value == 'excel' ? 'xlsx' : value,
      '',
      {
        isHeader: false,
        style: true,
        subHeader,
        span,
        indents,
        noTotalStyle: true,
      },
    );
  };

  useEffect(() => {
    settingsListGet({
      settingCode: PNL_REPORT_USER_SETTINGS.SUPPRESS_ZEROS,
      settingTypeId: USER_SETTINGS_TYPES.REPORT_META_INFO,
    });
  }, [settingsListGet]);

  useEffect(() => {
    logger.debug('Process report data');

    if (pnlMonthlyReport) {
      setErrors(pnlMonthlyReport.errors);

      if (pnlMonthlyReport.errors.length > 0) {
        return;
      }

      const rawReport = pnlMonthlyReport.data;

      if (!rawReport) {
        setPnlReportData([]);
        return;
      }

      const columnsMap = {};
      const columns = [
        {
          headerName: 'Name',
          field: 'name',
          width: '200px',
          minWidth: '200px',
          onRender: TextCellRenderer,
          background: '#ffffff',
        },
        {
          headerName: 'GL Code',
          field: 'glCode',
          width: '120px',
          minWidth: '120px',
          headerAlign: 'left',
          align: 'left',
          onRender: TextCellRenderer,
          // colors.white or colors.blue does not work here as theme is unavailable
          color: '#3b6cb4',
        },
      ];

      const tmpTopHeaders = [];

      rawReport.columnsCfg.forEach((column, idx) => {
        tmpTopHeaders.push({
          title: getFormattedHeaderTitle(column),
        });

        (column.items || []).forEach((item, jdx) => {
          const colIdx = 2 * idx + jdx;
          const field = `${column.title}-${item.field}-${colIdx}`;
          const checkNoKpi = rawReport?.kpi === 'NO_KPI' && item?.field !== 'kpiValue';

          if (rawReport?.kpi !== 'NO_KPI' ? true : checkNoKpi) {
            columns.push({
              headerName: item.title,
              field,
              width: rawReport?.kpi !== 'NO_KPI' ? '100px' : '200px',
              minWidth: '100px',
              headerAlign: 'center',
              align: 'right',
              onRender: (e) => CellRenderer({ ...e, isRev: item.title === 'REV, %' }),
              hasBorder:
                rawReport?.kpi !== 'NO_KPI'
                  ? idx == 0
                    ? colIdx % 2 === 1
                    : colIdx % 4 === 1
                  : idx == 0
                  ? colIdx % 2 === 0
                  : colIdx % 4 === 0,
              bgColor:
                rawReport?.kpi !== 'NO_KPI' ? (colIdx % 2 === 0 ? true : false) : colIdx % 4 === 0 ? true : false,
              //colors.blue does not work here as theme is unavailable
              color: '#3b6cb4',
            });
          }
          columnsMap[`${colIdx}`] = field;
        });
      });

      columns[columns.length - 1].hasBorder = false;

      setTopHeaders(tmpTopHeaders);

      const tableData = [];

      const buildStaticData = (items, tableData, sIdx, hasKpi) => {
        items.forEach((item, idx) => {
          const { columnsData, ...other } = item;

          const row = {
            ...other,
            topLevelHeaders: sIdx === 0,
            ...buildRowColumns(columnsData, { hasKpi, setNAForNullKpi: true }),
            children: [],
            hasHorizontalBottomBorder: items.length - 1 === idx,
          };
          tableData.push(row);
        });
      };

      const buildRowColumns = (columnsData, { hasKpi, setEmtpy, setNAForNullKpi } = {}) => {
        const rawColumnsData = columnsData
          .reduce((acc, column) => {
            acc.push({
              value: column.value,
            });
            acc.push({
              value: hasKpi ? (setNAForNullKpi ? column.kpiValue ?? 0 : column.kpiValue) : '',
            });
            return acc;
          }, [])
          .reduce((acc, column, idx) => {
            acc[columnsMap[`${idx}`]] = setEmtpy ? '' : column.value;
            return acc;
          }, {});
        return rawColumnsData;
      };
      setKpi(rawReport.kpi);
      rawReport.sections.forEach((section, sIdx) => {
        const { header, footer, items } = section;

        if (!header && !footer) {
          // This is static part and it does not have any headers/footers
          // So just add rows as is
          // If static headers with null values need to disabled use this
          //   items.filter((item) => !shouldHideReportRow(nullRecordsHide, item.columnsData))
          if (items.length > 0) {
            buildStaticData(items, tableData, sIdx, true);
          } else {
            buildStaticData(staticData, tableData, sIdx, true);
          }
        } else if (!header && footer) {
          const { columnsData } = section;
          // This is a section with footer and totals only
          // Insert footer row
          // If footer with null values need to be hide use this
          //     if (!shouldHideReportRow(nullRecordsHide, columnsData)) {
          tableData.push({
            id: footer,
            name: footer,
            glCode: '',
            valueType: VALUE_TYPES.CURRENCY,
            footer: true,
            ...buildRowColumns(columnsData, { hasKpi: true }),
            children: [],
            hasHorizontalBottomBorder: true,
            hasHorizontalTopBorder: true,
          });
          //    }
        } else {
          const { columnsData } = section;
          // This is a regular section with data

          // Insert header row
          // Use below code if needed
          // const hideHeaderAndFooter = items.length === 0 && shouldHideReportRow(nullRecordsHide, columnsData);
          //     if (!hideHeaderAndFooter) {
          tableData.push({
            id: header,
            name: header,
            glCode: '',
            valueType: '',
            removeBottomBorder: true,
            header: true,
            ...buildRowColumns(columnsData, { hasKpi: false, setEmtpy: true }),
            children: [],
            hasHorizontalBottomBorder: false,
            hasHorizontalTopBorder: true,
          });

          const tmpItems = items
            .filter((item) => !shouldHideReportRow(nullRecordsHide, item.columnsData))
            .map((item) => {
              const { columnsData, ...other } = item;
              return {
                ...other,
                ...buildRowColumns(columnsData, { hasKpi: true }),
              };
            });

          const [tree, orphans] = buildHierarchy(tmpItems, 'id', 'parentId', 'children');
          //tableData.push(...tree.filter((item) => !item.parentId));
          addTopLevelHeadersToItems(tree);
          tableData.push(...tree);
          tableData.push(...orphans);

          if (footer) {
            // Insert footer row

            tableData.push({
              id: footer,
              name: footer,
              glCode: '',
              valueType: VALUE_TYPES.CURRENCY,
              footer: true,
              ...buildRowColumns(columnsData, { hasKpi: true }),
              children: [],
            });
          }
          //  }
        }
      });

      setSubHeaders(columns);
      setPnlReportData([{ children: tableData }]);
    }
  }, [pnlMonthlyReport, filters, nullRecordsHide]);

  const isLoading = loadingMonthlyReport || pnlReportGetForecastNumbersLoading;
};
