import React, { Fragment, memo, useEffect, useState, useContext, useCallback } from 'react';

import {
  buildHierarchy,
  Button,
  ButtonDownloadAs,
  Drawer,
  RecursiveDataTable,
  ToolBar,
  ToolBarItem,
  InputDate,
  Toggle,
  Switch,
} from 'mdo-react-components';

import { AppContext, GlobalFilterContext, HotelContext } from 'contexts';

import {
  DataContainer,
  DisplayApiErrors,
  DisplayNoData,
  DataLoading,
  GroupSelector,
  PnLColumnFilters,
  PnLPeriodSelector,
  PnLCustomViews,
  GenericSelector,
  IfPermitted,
} from 'components';

import { usePnlReports, useUserSettings } from '../../graphql';

import logger from 'utils/logger';
import { exportToXLSX, buildDownloadableFilename, findDepth } from 'utils/downloadHelpers';
import { isDateValid } from 'utils/validators';
import { getText } from 'utils/localesHelpers';
import { formatDateForApi } from 'utils/dataManipulation';
import { useHistory } from 'react-router-dom';
import { VALUE_DATA_TYPES, VALUE_TYPES, PNL_REPORT_USER_SETTINGS, USER_SETTINGS_TYPES } from 'config/constants';

import { DownloadableReportNames } from 'config/downlodableReportNames';

import { CellRenderer } from './CellRenderer';
import { TextCellRenderer } from './TextCellRenderer';

import { addTopLevelHeadersToItems } from './pnlHelpers';
import { columnNamesMappingComparison, shouldHideReportRow } from './utils';
import dayjs from 'dayjs';
import { ADD_CUSTOM_VIEW } from './constants';
import { usePnLView } from './hooks';

import { useTableData, useGetTableHeaders } from 'hooks';

const PnLPropertyComparison = memo(() => {
  const history = useHistory();
  const { hotelId, portfolio, selectPortfolio } = useContext(GlobalFilterContext);
  const { getPortfolioHotelIds, hotelsGroups, hotelsMap, hotelsGroupsMap } = useContext(HotelContext);
  const { appPages } = useContext(AppContext);
  const { userSettingsSet, settingsListGet } = useUserSettings();
  const {
    pnlReportGetPropertyComparison,
    pnlReportPropertyComparison,
    loadingPnLReportPropertyComparison,
    pnlReportGetForecastNumbers,
    pnlForecastNumbers,
    pnlReportGetForecastNumbersLoading,
  } = usePnlReports();

  const [headers, setHeaders] = useState({
    headers: [],
    subHeaders: [],
  });
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
    ],
    date: dayjs().add(-1, 'day').toDate(),
    period: 'MTD',
    customViewId: '',
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
        [name]: value,
      };

      setFilters(newFilters);

      if (name === 'customViewId' && value === ADD_CUSTOM_VIEW && appPages?.keys['pnl-view']?.url) {
        history.push({
          pathname: appPages.keys['pnl-view'].url,
          state: { key: 'pnl-property-comparison' },
        });
      }

      if (reportRequested) {
        setReportRequested(false);
      }
    },
    [filters, reportRequested],
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

  const handleChangeHotelGroup = useCallback(
    (name, value) => {
      logger.debug('Hotel Group changed:', value);

      selectPortfolio(value);

      if (reportRequested) {
        setReportRequested(false);
      }
    },
    [selectPortfolio, reportRequested],
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

  const requestReport = useCallback(
    (newFilter) => {
      setErrors([]);
      setPnlReportData([]);

      const currentParams = newFilter || filters;

      const year = currentParams.date?.getFullYear();

      const params2use = {
        date: formatDateForApi(currentParams.date),
        hotelId: getPortfolioHotelIds(currentParams?.portfolio || portfolio),
        period: currentParams.period,
        customViewId: currentParams.customViewId,
        dataType: {
          dataType: currentParams.columns[0].dataType,
          year: year - currentParams.columns[0].yearOffest,
          forecastNumber: currentParams.columns[0].forecastNumber,
        },
        compareTo: currentParams.columns
          .slice(1)
          .filter((item) => item.dataType)
          .map((item) => {
            return {
              dataType: item.dataType,
              year: year - item.yearOffest,
              forecastNumber: item.forecastNumber,
            };
          }),
      };

      logger.debug('Requesting P&L Property Comparison Report', { params2use });

      pnlReportGetPropertyComparison(params2use);

      if (!reportRequested) {
        setReportRequested(true);
      }

      setRequestNo(requestNo + 1);
    },
    [getPortfolioHotelIds, filters, reportRequested, pnlReportGetPropertyComparison, portfolio, requestNo],
  );

  const renderHeaders = useCallback(() => {
    logger.debug('Render headers');

    const pnlPropertyComparisonHeaders = [
      { span: 1, single: true },
      { span: 1, single: true },
    ];
    headers?.headers?.map((obj, index) => {
      if (index !== 0) {
        pnlPropertyComparisonHeaders.push({
          span: obj.colspan,
          content: obj.title,
        });
      }
    });

    return pnlPropertyComparisonHeaders;
  }, [headers]);

  const { subHeader, span } = useGetTableHeaders(pnlReportPropertyComparison?.data?.columnsCfg, renderHeaders());

  const handleDownloadReport = ({ value }) => {
    if (!pnlReportPropertyComparison?.data || !tableData) {
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
        reportName: DownloadableReportNames.pnlPropertyComp,
        hotelId,
        hotelName: hotelsMap[portfolio.hotelId]?.hotelName,
        hotelGroupName: hotelsGroupsMap[portfolio.hotelGroupId]?.groupName,
        period: filters.period,
        startDate: pnlReportPropertyComparison.data.startDate,
        endDate: pnlReportPropertyComparison.data.endDate,
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

  // useEffect(() => {
  //   logger.debug('Fetch forecast numbers');

  //   pnlReportGetForecastNumbers({
  //     hotelId: getPortfolioHotelIds(filters?.portfolio || portfolio),
  //     years: filters.columns.map((column) => {
  //       return filters.date?.getFullYear() - column.yearOffest;
  //     }),
  //   });
  // }, [filters, getPortfolioHotelIds, pnlReportGetForecastNumbers, portfolio]);

  useEffect(() => {
    logger.debug('Process report data');

    if (pnlReportPropertyComparison) {
      setErrors(pnlReportPropertyComparison.errors);

      if (pnlReportPropertyComparison.errors.length > 0) {
        return;
      }

      const rawReport = pnlReportPropertyComparison.data;

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
          hasBorder: true,
          // colors.white or colors.blue does not work here as theme is unavailable
          color: '#3b6cb4',
        },
      ];

      const year = filters.date?.getFullYear();
      const initialColSpan = rawReport.columnsCfg.filter((item) => item.hotelId).length + 1;

      const forecastNumber =
        [VALUE_DATA_TYPES.FORECAST, VALUE_DATA_TYPES.ACTUAL_FORECAST].indexOf(filters.columns[0].dataType) === -1
          ? ''
          : ` - ${filters.columns[0].forecastNumber}`;

      const headers = [
        {
          title: '',
          colspan: 2,
        },
        {
          title: `${getText(`dataTypes.${filters.columns[0].dataType}`)}${forecastNumber} - ${
            year - filters.columns[0].yearOffest
          }`,
          colspan: initialColSpan,
        },
        ...filters.columns
          .slice(1)
          .filter((item) => item.dataType)
          .map((item) => {
            return {
              title: `${getText('dataTypes.COMPARISON')} - ${year - item.yearOffest}`,
              colspan: 2,
            };
          }),
      ];

      rawReport.columnsCfg.forEach((column, idx) => {
        const field = `column_${idx + 2}`;

        const forecastNumber =
          [VALUE_DATA_TYPES.FORECAST, VALUE_DATA_TYPES.ACTUAL_FORECAST].indexOf(column.dataType) === -1
            ? ''
            : ` - ${column.forecastNumber}`;

        columns.push({
          headerName: column?.hotel?.hotelName ?? `${column.title}${forecastNumber}`,
          field,
          headerAlign: 'center',
          align: 'right',
          width: '120px',
          minWidth: '120px',
          maxWidth: '120px',
          onRender: CellRenderer,
          hasBorder: [initialColSpan - 1, initialColSpan + 1, initialColSpan + 3].indexOf(idx) !== -1,
          //colors.blue does not work as theme is unavailable
          color: '#3b6cb4',
          bgColor: idx % 2 === 0 ? true : false,
          location: 'PnL comparison',
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
            removeBottomBorder: true,
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

      setHeaders({
        subHeaders: columns,
        headers: headers,
      });

      setPnlReportData([{ children: tableData }]);
    }
  }, [pnlReportPropertyComparison, filters, nullRecordsHide]);

  const isLoading = loadingPnLReportPropertyComparison || pnlReportGetForecastNumbersLoading;

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
          <GroupSelector
            name={'porfolio'}
            value={portfolio}
            onChange={handleChangeHotelGroup}
            disabled={isLoading || hotelsGroups.length === 0}
            disableClearable
            allowAllGroups
          />
        </ToolBarItem>
        <ToolBarItem>
          <InputDate
            name='date'
            label={getText('generic.date')}
            // minDate={datesRange.minDate}
            // maxDate={datesRange.maxDate}
            value={filters.date}
            onChange={handleFilterChange}
            disabled={isLoading}
            dataEl='inputDate'
            autoClose={true}
            errorMsg={getText('generic.dateErrorText')}
          />
        </ToolBarItem>
        <ToolBarItem>
          <PnLPeriodSelector
            label={getText('generic.period')}
            name='period'
            value={filters.period}
            onChange={handleFilterChange}
            disabled={isLoading}
            dataEl='selectorPnLPeriod'
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
            disabled={isLoading || !isDateValid(filters.date) || !filters.customViewId}
            dataEl='buttonGo'
          />
        </ToolBarItem>
        <ToolBarItem toTheRight>
          <IfPermitted page='pnl-property-comparison' permissionType='special-filter-dropdown'>
            <Button
              text='View Unmapped'
              title={'View Unmapped'}
              onClick={() => {
                history.push({
                  pathname: appPages.keys['pnl-unmapped'].url,
                  state: { year: dayjs(filters.date).format('YYYY') },
                });
              }}
              dataEl='buttonViewUnmapped'
            />
          </IfPermitted>
        </ToolBarItem>
      </ToolBar>
      <ToolBar>
        <ToolBarItem toTheRight>
          <IfPermitted page='pnl-property-comparison' permissionType='toggle-status'>
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
        </ToolBarItem>
        <ToolBarItem>
          <IfPermitted page='pnl-property-comparison' permissionType='commission-calculator'>
            <Button
              iconName='CalculateOutlined'
              text=''
              variant='tertiary'
              title={getText('pnl.commissionsCalculator')}
              onClick={() => {
                history.push({
                  pathname: appPages.keys['commissions-calculator'].url,
                  state: { key: 'pnl-property-comparison' },
                });
              }}
              disabled={isLoading}
              dataEl={'buttonCommissions'}
            ></Button>
          </IfPermitted>
        </ToolBarItem>
        <ToolBarItem>
          <IfPermitted page='pnl-property-comparison' permissionType='download'>
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
          <IfPermitted page='pnl-property-comparison' permissionType='edit-column'>
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
        {loadingPnLReportPropertyComparison && <DataLoading />}
        {!loadingPnLReportPropertyComparison && <DisplayApiErrors errors={errors} />}
        {!loadingPnLReportPropertyComparison && pnlReportData.length === 0 && errors.length === 0 && (
          <DisplayNoData
            message={reportRequested ? getText('generic.noReportDataForTheDate') : getText('generic.selectFilters')}
          />
        )}
        {!loadingPnLReportPropertyComparison && pnlReportData.length > 0 && errors.length === 0 && (
          <DataContainer obsoleteData={!reportRequested}>
            <RecursiveDataTable
              key={requestNo}
              data={pnlReportData}
              subHeaders={headers.subHeaders}
              headers={[renderHeaders()]}
              freezeColumns={0}
              removeBottomBorder={true}
              stickyHeaders={true}
              onRequestTableData={onRequestTableData}
              columnNamesMapping={columnNamesMappingComparison(headers.subHeaders)}
            />
          </DataContainer>
        )}
      </Fragment>
    </Fragment>
  );
});

PnLPropertyComparison.displayName = 'PnLPropertyComparison';

export { PnLPropertyComparison };
