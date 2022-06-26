import React, { Fragment, memo, useEffect, useState, useContext, useCallback, useMemo } from 'react';
import { padStart } from 'lodash';
import dayjs from 'dayjs';
import {
  buildHierarchy,
  Button,
  ButtonDownloadAs,
  Drawer,
  RecursiveDataTable,
  ToolBar,
  ToolBarItem,
  YearSelector,
  Toggle,
  Switch,
  Dropdown,
} from 'mdo-react-components';

import { AppContext, GlobalFilterContext, HotelContext } from 'contexts';
import {
  DataContainer,
  DisplayApiErrors,
  DisplayNoData,
  DataLoading,
  PortfolioSelector,
  PnLColumnFilters,
  PnLCustomViews,
  GenericSelector,
  IfPermitted,
} from 'components';
import { usePnlReports, useUserSettings } from '../../graphql';

import logger from 'utils/logger';
import { exportToXLSX, buildDownloadableFilename, findDepth } from 'utils/downloadHelpers';
import { getText } from 'utils/localesHelpers';

import {
  VALUE_DATA_TYPES,
  VALUE_TYPES,
  PNL_REPORT_USER_SETTINGS,
  USER_SETTINGS_TYPES,
  PERIODS,
} from 'config/constants';
import { DownloadableReportNames } from 'config/downlodableReportNames';
import { useHistory } from 'react-router-dom';
import { CellRenderer } from './CellRenderer';
import { TextCellRenderer } from './TextCellRenderer';

import { addTopLevelHeadersToItems } from './pnlHelpers';
import { columnNamesMappingYearly, shouldHideReportRow } from './utils';
import { useTableData, useGetTableHeaders } from 'hooks';
import { usePnLView } from './hooks';
import { ADD_CUSTOM_VIEW } from './constants';

const PnLYearly = memo(() => {
  const history = useHistory();
  const { hotelId, portfolio, selectPortfolio } = useContext(GlobalFilterContext);
  const { getPortfolioHotelIds, hotelsMap, hotelsGroupsMap } = useContext(HotelContext);
  const { appPages } = useContext(AppContext);
  const { userSettingsSet, settingsListGet } = useUserSettings();
  const {
    fetchPnlAnnualReports,
    pnlAnnualReport,
    loadingAnnualReport,
    pnlReportGetForecastNumbers,
    pnlForecastNumbers,
    pnlReportGetForecastNumbersLoading,
    // fetchPnlReportMinMaxDates,
    // pnlDatesRange,
    // loadingDatesRange,
  } = usePnlReports();

  const currentDate = dayjs();
  const currentYear = currentDate.get('year');

  const [subHeaders, setSubHeaders] = useState();
  const [pnlReportData, setPnlReportData] = useState([]);
  const [requestNo, setRequestNo] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [nullRecordsHide, setNullRecordsHide] = useState();
  const [filters, setFilters] = useState({
    columns: [
      {
        dataType: VALUE_DATA_TYPES.ACTUAL,
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
    ],
    year: currentYear,
    customViewId: '',
    selectedYear: currentYear,
  });

  const [errors, setErrors] = useState([]);
  const [reportRequested, setReportRequested] = useState(false);

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
        columns: _.map(filters.columns, (col) => ({ ...col, yearOffest: 0 })),
        [name]: value,
      };

      logger.debug('Filter changed:', {
        filters,
        newFilters,
        portfolio,
        hotelId: getPortfolioHotelIds(newFilters?.portfolio || portfolio),
      });

      setFilters(newFilters);

      if (name === 'selectedYear') {
        newFilters.year = value;
        newFilters.year = value === PERIODS.TTM ? currentYear : value;

        pnlReportGetForecastNumbers({
          hotelId: getPortfolioHotelIds(newFilters?.portfolio || portfolio),
          years: newFilters.columns.map((column) => {
            return newFilters.year - column.yearOffest;
          }),
        });
      }
      if (name === 'customViewId' && value === ADD_CUSTOM_VIEW && appPages?.keys['pnl-view']?.url) {
        history.push({
          pathname: appPages.keys['pnl-view'].url,
          state: { key: 'pnl-yearly' },
        });
      }

      if (reportRequested) {
        setReportRequested(false);
      }
    },
    [filters, getPortfolioHotelIds, pnlReportGetForecastNumbers, portfolio, reportRequested],
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
    [reportRequested],
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

  const handleChangePortfolio = useCallback(
    (name, value) => {
      logger.debug('Portfolio changed:', value);

      selectPortfolio(value);

      if (reportRequested) {
        setReportRequested(false);
      }
    },
    [setReportRequested, reportRequested, selectPortfolio],
  );

  const requestReport = useCallback(
    (newFilters) => {
      setErrors([]);
      setPnlReportData([]);

      const currentFilters = newFilters ? newFilters : filters;

      const date = currentDate.subtract(currentFilters.columns[0].yearOffest, 'years');

      const filters2use = {
        hotelId: getPortfolioHotelIds(currentFilters?.portfolio || portfolio),
        customViewId: currentFilters.customViewId,
        period: filters.selectedYear === PERIODS.TTM ? PERIODS.TTM : PERIODS.YEAR,
        date: `${date.get('year')}-${_.padStart(date.get('month'), 2, '0')}-01`,
        dataType: {
          dataType: currentFilters.columns[0].dataType,
          forecastNumber: currentFilters.columns[0].forecastNumber,
        },
        compareTo: currentFilters.columns
          .slice(1)
          .filter((item) => item.dataType)
          .map((item) => {
            return {
              dataType: item.dataType,
              year: currentFilters.year - item.yearOffest,
              forecastNumber: item.forecastNumber,
            };
          }),
      };

      fetchPnlAnnualReports(filters2use);

      if (!reportRequested) {
        setReportRequested(true);
      }

      setRequestNo(requestNo + 1);
    },
    [getPortfolioHotelIds, filters, reportRequested, fetchPnlAnnualReports, portfolio, requestNo],
  );

  const renderHeaders = useCallback(() => {
    logger.debug('Render headers', filters);

    const headers = [
      { span: 1, single: true },
      { span: 1, single: true },
    ];
    const offset = filters.columns[0].yearOffest;
    const isTtm = filters.selectedYear === PERIODS.TTM;

    let content = `${filters.year - offset} ${getText(`dataTypes.${filters.columns[0].dataType}`)}`;

    if (isTtm) {
      content = `${currentDate.format('MMMM')} ${currentYear - offset} ${PERIODS.TTM} ${getText(
        `dataTypes.${filters.columns[0].dataType}`,
      )}`;
    }

    headers.push({
      span: 13,
      content,
    });

    filters.columns
      .slice(1)
      .filter((item) => item.dataType)
      .map((item, idx) => {
        const offset = item.yearOffest;
        const content = `${!isTtm ? filters.year - offset : offset === 0 ? currentYear : currentYear - offset}`;
        headers.push({
          span: 2,
          content: `Comparison - ${content}`,
        });
      });

    return headers;
  }, [filters]);

  const { subHeader, span } = useGetTableHeaders(pnlAnnualReport?.data?.columnsCfg, renderHeaders());

  const handleDownloadReport = ({ value }) => {
    if (!pnlAnnualReport?.data || !tableData) {
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
        reportName: DownloadableReportNames.pnlYearly,
        hotelId,
        hotelName: hotelsMap[portfolio.hotelId]?.hotelName,
        hotelGroupName: hotelsGroupsMap[portfolio.hotelGroupId]?.groupName,
        year: filters.year,
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
    logger.debug('Fetch forecast numbers');

    pnlReportGetForecastNumbers({
      hotelId: getPortfolioHotelIds(filters?.portfolio || portfolio),
      years: filters.columns.map((column) => {
        return filters.year - column.yearOffest;
      }),
    });
  }, [filters, getPortfolioHotelIds, pnlReportGetForecastNumbers, portfolio]);

  useEffect(() => {
    logger.debug('Process report data');
    if (pnlAnnualReport) {
      setErrors(pnlAnnualReport.errors);

      if (pnlAnnualReport.errors.length > 0) {
        return;
      }

      const rawReport = pnlAnnualReport.data;

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

      rawReport.columnsCfg.forEach((column, idx) => {
        const field = `column_${idx}`; //column.title;

        const forecastNumber =
          [VALUE_DATA_TYPES.FORECAST, VALUE_DATA_TYPES.ACTUAL_FORECAST].indexOf(column.dataType) === -1
            ? ''
            : ` - ${column.forecastNumber}`;

        const month =
          filters.selectedYear === PERIODS.TTM
            ? dayjs(column.date).format('MMM YYYY')
            : dayjs(column.date).format('MMM');

        columns.push({
          headerName: idx > 11 ? `${column.title}${forecastNumber}` : month,
          field,
          headerAlign: 'center',
          align: 'right',
          onRender: CellRenderer,
          minWidth: '80px',
          hasBorder: [12, 14, 16, 18].indexOf(idx) !== -1,
          //colors.blue does not work as theme is unavailable
          color: '#3b6cb4',
          bgColor: idx % 2 === 0 ? true : false,
        });
        columnsMap[`${idx}`] = field;
      });

      columns[columns.length - 1].hasBorder = false;

      const tableData = [];

      rawReport.sections.forEach((section, sIdx) => {
        const { header, footer, items } = section;

        if (!header && !footer) {
          // This is static part and it does not have any headers/footers
          // So just add rows as is
          items.forEach((item, idx) => {
            const { columnsData, ...other } = item;
            tableData.push({
              ...other,
              ...columnsData.reduce((acc, column, idx) => {
                acc[columnsMap[`${idx}`]] = column.value;
                return acc;
              }, {}),
              children: [],
              topLevelHeaders: sIdx === 0,
              hasHorizontalBottomBorder: items.length - 1 === idx,
            });
          });
        } else if (!header && footer) {
          const { columnsData } = section;
          // This is a section with footer and totals only
          // Insert footer row
          tableData.push({
            id: footer,
            name: footer,
            glCode: '',
            valueType: VALUE_TYPES.CURRENCY,
            footer: true,
            ...columnsData.reduce((acc, column, idx) => {
              acc[columnsMap[`${idx}`]] = column.value;
              return acc;
            }, {}),
            children: [],
            hasHorizontalBottomBorder: true,
            hasHorizontalTopBorder: true,
          });
        } else {
          const { columnsData } = section;
          // This is a regular section with data

          // Insert header row

          tableData.push({
            id: header,
            name: header,
            glCode: '',
            valueType: '',
            header: true,
            ...columnsData.reduce((acc, column, idx) => {
              acc[columnsMap[`${idx}`]] = '';
              return acc;
            }, {}),
            children: [],
            removeBottomBorder: true,
            hasHorizontalTopBorder: true,
          });

          const tmpItems = items
            .filter((item) => !shouldHideReportRow(nullRecordsHide, item.columnsData))
            .map((item) => {
              const { columnsData, ...other } = item;
              return {
                ...other,
                ...columnsData.reduce((acc, column, idx) => {
                  acc[columnsMap[`${idx}`]] = column.value;
                  return acc;
                }, {}),
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
              ...columnsData.reduce((acc, column, idx) => {
                acc[columnsMap[`${idx}`]] = column.value;
                return acc;
              }, {}),
              children: [],
              hasHorizontalBottomBorder: true,
            });
          }
        }
      });

      setSubHeaders(columns);
      setPnlReportData([{ children: tableData }]);
    }
  }, [pnlAnnualReport, filters, nullRecordsHide]);

  const years = useMemo(() => {
    const years = Array.from({ length: 10 }).map((_, idx) => {
      const year = currentYear - idx;
      return {
        label: year,
        value: year,
      };
    });
    return [{ label: PERIODS.TTM, value: PERIODS.TTM }, ...years];
  }, []);

  const isLoading = loadingAnnualReport || pnlReportGetForecastNumbersLoading;

  return (
    <Fragment>
      <Drawer open={filterOpen} onClose={() => setFilterOpen(false)} anchor='right'>
        <PnLColumnFilters
          filters={filters}
          onApply={handleApplyFitlers}
          onCancel={() => setFilterOpen(false)}
          minRequired={2}
          forecastNumbers={pnlForecastNumbers.years}
        />
      </Drawer>
      <ToolBar>
        <ToolBarItem>
          <PortfolioSelector
            name={'portfolio'}
            value={portfolio}
            onChange={handleChangePortfolio}
            disabled={isLoading}
            disableClearable
            allowAllGroups
            allowAllHotels
            highlightDefaultHotelId={true}
          />
        </ToolBarItem>
        <ToolBarItem>
          <Dropdown
            label={getText('generic.year')}
            name='selectedYear'
            value={`${filters.selectedYear}`}
            items={years}
            onChange={handleFilterChange}
            dataEl='selectorYear'
          />
        </ToolBarItem>
        <ToolBarItem>
          <GenericSelector
            width='small'
            label='View'
            items={customViewsState.pnlViewsData}
            value={filters?.customViewId}
            onChange={handleFilterChange}
            name='customViewId'
            disabled={isLoading}
          />
        </ToolBarItem>
        <ToolBarItem>
          <Button
            iconName={reportRequested ? 'Refresh' : ''}
            text={reportRequested ? '' : getText('generic.go')}
            title={getText(`generic.${reportRequested ? 'refresh' : 'go'}`)}
            variant='secondary'
            onClick={() => requestReport()}
            disabled={isLoading || !filters.customViewId}
            dataEl='buttonGo'
          />
        </ToolBarItem>
        <ToolBarItem toTheRight>
          <IfPermitted page='pnl-yearly' permissionType='special-filter-dropdown'>
            <Button
              text='View Unmapped'
              title={'View Unmapped'}
              onClick={() => {
                history.push({
                  pathname: appPages.keys['pnl-unmapped'].url,
                  state: { year: filters.year },
                });
              }}
            />
          </IfPermitted>
        </ToolBarItem>
      </ToolBar>
      <ToolBar>
        <ToolBarItem toTheRight>
          <IfPermitted page='pnl-yearly' permissionType='toggle-status'>
            <Switch
              name='nullRecords'
              label={getText('pnl.pnlSwitch')}
              labelPlacement={'start'}
              value={nullRecordsHide}
              onChange={handleSwitchChange}
              dataEl='switchDisableNullRecords'
              disabled={isLoading}
            />
          </IfPermitted>
          <IfPermitted page='pnl-yearly' permissionType='commission-calculator'>
            <Button
              iconName='CalculateOutlined'
              text=''
              variant='tertiary'
              title={getText('pnl.commissionsCalculator')}
              onClick={() => {
                history.push({
                  pathname: appPages.keys['commissions-calculator'].url,
                  state: { key: 'pnl-yearly' },
                });
              }}
              disabled={isLoading}
              dataEl={'buttonCommissions'}
            ></Button>
          </IfPermitted>
        </ToolBarItem>
        <ToolBarItem>
          <IfPermitted page='pnl-yearly' permissionType='download'>
            <ButtonDownloadAs
              iconName='CloudDownloadSharp'
              text=''
              variant='tertiary'
              onClick={handleDownloadReport}
              exclude={['pdf']}
              disabled={isLoading || !reportRequested}
              dataEl={'buttonDownloadAs'}
            />
          </IfPermitted>
        </ToolBarItem>
        <ToolBarItem>
          <IfPermitted page='pnl-yearly' permissionType='edit-column'>
            <Button
              iconName='ViewWeekOutlined'
              variant='tertiary'
              title={getText('generic.editColumns')}
              onClick={() => {
                setFilterOpen(true);
              }}
              disabled={isLoading}
              dataEl={'buttonFilter'}
            />
          </IfPermitted>
        </ToolBarItem>
      </ToolBar>
      <Fragment>
        {loadingAnnualReport && <DataLoading />}
        {!loadingAnnualReport && <DisplayApiErrors errors={errors} />}
        {!loadingAnnualReport && pnlReportData.length === 0 && errors.length === 0 && (
          <DisplayNoData
            message={reportRequested ? getText('generic.noReportDataForTheDate') : getText('generic.selectFilters')}
          />
        )}
        {!loadingAnnualReport && pnlReportData.length > 0 && errors.length === 0 && (
          <DataContainer obsoleteData={!reportRequested}>
            <RecursiveDataTable
              key={requestNo}
              data={pnlReportData}
              subHeaders={subHeaders}
              headers={[renderHeaders()]}
              freezeColumns={0}
              removeBottomBorder={true}
              stickyHeaders={true}
              onRequestTableData={onRequestTableData}
              columnNamesMapping={columnNamesMappingYearly(subHeaders)}
            />
          </DataContainer>
        )}
      </Fragment>
    </Fragment>
  );
});

PnLYearly.displayName = 'PnLYearly';

export { PnLYearly };
