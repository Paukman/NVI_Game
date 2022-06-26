import React, { memo, Fragment, useState, useContext, useCallback, useMemo, useEffect, useRef } from 'react';

import { ToolBar, ToolBarItem, InputDate, RecursiveDataTable, ButtonDownloadAs, Button } from 'mdo-react-components';

import { AppContext, GlobalFilterContext, HotelContext } from '../../contexts';
import {
  DisplayApiErrors,
  DisplayNoData,
  DataLoading,
  PortfolioSelector,
  DataContainer,
  SPCompareToSelector,
  SPPeriodSelector,
  useIfPermitted,
} from '../../components';
import { getText } from '../../utils/localesHelpers';
import { isValidDate, isCurrentYear } from '../../utils/formatHelpers';
import { useSalesProduction } from 'graphql/useSalesProduction';
import { TextCellRenderer } from 'pages/ProfitAndLoss/TextCellRenderer';
import { CellRenderer } from 'pages/ProfitAndLoss/CellRenderer';
import dayjs from 'dayjs';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import { v4 } from 'uuid';
import { buildDownloadableFilename, exportToXLSX, findDepth } from 'utils/downloadHelpers';
import { DownloadableReportNames } from 'config/downlodableReportNames';
import { timestampNoSeparators } from '../../utils/formatHelpers';
import { columnNamesMapping } from './utils';
import { useTableData } from 'hooks';
import { object } from 'prop-types';

const SalesProductionDefault = memo(() => {
  const { hotelId, portfolio, selectPortfolio } = useContext(GlobalFilterContext);
  const { getPortfolioHotelIds, hotelsMap, hotelsGroupsMap } = useContext(HotelContext);
  const [reportRequested, setReportRequested] = useState(false);
  const { salesProductionReportGet, salesProductionReport, salesProductionReportLoading } = useSalesProduction();
  const { isPermitted } = useIfPermitted({ page: 'sales-production-report' });

  const [filters, setFilters] = useState({
    period: 'MONTH',
    compareTo: 'LAST_YEAR',
    date: new Date(),
    startDate: new Date(),
    endDate: new Date(),
    hotelId: hotelId,
  });
  const [topHeaders, setTopHeaders] = useState([]);
  const [subHeaders, setSubHeaders] = useState();
  const [salesData, setSalesData] = useState([]);
  const [errors, setErrors] = useState([]);
  const [dateErr, setDateErr] = useState('');
  const [startDateErr, setStartDateErr] = useState('');
  const [endDateErr, setEndDateErr] = useState('');

  const { onRequestTableData, tableData } = useTableData();

  const handleFilterChange = (name, value) => {
    const newFilters = {
      ...filters,
      [name]: value,
    };

    setFilters(newFilters);

    if (['keyword'].indexOf(name) !== -1) {
      return;
    }

    if (reportRequested) {
      setReportRequested(false);
    }

    if (isValidDate(newFilters.date)) {
      if (isCurrentYear(newFilters.date)) {
        setDateErr('');
      } else {
        setDateErr('Must be current year');
      }
    } else {
      setDateErr('Invalid format');
    }

    if (isValidDate(newFilters.startDate)) {
      if (isCurrentYear(newFilters.startDate)) {
        setStartDateErr('');
      } else {
        setStartDateErr('Must be current year');
      }
    } else {
      setStartDateErr('Invalid format');
    }

    if (isValidDate(newFilters.endDate)) {
      if (isCurrentYear(newFilters.endDate)) {
        setEndDateErr('');
      } else {
        setEndDateErr('Must be current year');
      }
    } else {
      setEndDateErr('Invalid format');
    }
  };

  const handleChangePortfolio = (name, value) => {
    selectPortfolio(value);

    if (reportRequested) {
      setReportRequested(false);
    }
  };

  const requestReport = (newFilter) => {
    if (filters.period === 'CUSTOM' && dayjs(filters.startDate).isAfter(filters.endDate)) {
      return;
    }
    setErrors([]);
    setSalesData([]);

    const currentParams = newFilter || filters;

    const year = currentParams.date.getFullYear();

    const params2use = {
      ...(filters.period !== 'CUSTOM' && { period: filters.period }),
      compareTo: filters.compareTo,
      hotelId: getPortfolioHotelIds(currentParams?.portfolio || portfolio),
      ...(filters.period !== 'CUSTOM' && { date: currentParams.date }),
      ...(filters.period === 'CUSTOM' && { startDate: filters.startDate }),
      ...(filters.period === 'CUSTOM' && { endDate: filters.endDate }),
    };

    salesProductionReportGet(params2use);

    if (!reportRequested) {
      setReportRequested(true);
    }
  };

  const addTopLevelHeadersToItems = useCallback((items) => {
    items.forEach((item) => {
      if (item.children && item.children.length) {
        addTopLevelHeadersToItems(item.children);
        item.subLevelHeaders = true;
      }
    });
  }, []);

  const calcQuarter = () => {
    const formattedDate = dayjs(filters.date).format('YYYY-MM-DD');
    dayjs.extend(quarterOfYear);
    const quarter = dayjs(formattedDate).quarter();
    return `Q${quarter}`;
  };

  useEffect(() => {
    if (salesProductionReport) {
      setErrors(salesProductionReport.errors);

      if (salesProductionReport.errors.length > 0) {
        return;
      }

      const rawReport = salesProductionReport.data[0];

      if (!rawReport) {
        setSalesData([]);
        return;
      }

      const columnsMap = {};
      const columns = [
        {
          headerName: 'Description',
          field: 'description',
          width: '200px',
          minWidth: '200px',
          onRender: (e) =>
            e?.dataRow.description == 'Total' ? (
              <span style={{ marginLeft: '10px', fontWeight: 700 }}>Total</span>
            ) : (
              TextCellRenderer(e)
            ),
          background: '#ffffff',
          color: '#3b6cb4',
        },
      ];

      const tmpTopHeaders = [];

      tmpTopHeaders.push({
        title:
          filters.period === 'MONTH'
            ? dayjs(rawReport.endDate).format('MMMM')
            : `${filters.period === 'QUARTER' ? `${calcQuarter()}:` : ''}${dayjs(rawReport.startDate)
                .add(1, 'day')
                .format('MMMM')} - ${dayjs(rawReport.endDate).format('MMMM')}`,
      });
      rawReport.columnCfg.forEach((column, idx) => {
        columns.push({
          headerName: column.year,
          field: column.year,
          width: '100px',
          minWidth: '100px',
          headerAlign: 'center',
          align: 'center',
          onRender: CellRenderer,
          color: '#3b6cb4',
        });
      });
      columns.push({
        headerName: getText('salesProduction.total'),
        field: 'total',
        width: '100px',
        minWidth: '100px',
        headerAlign: 'center',
        align: 'center',
        onRender: CellRenderer,
        color: '#3b6cb4',
      });

      columns[columns.length - 1].hasBorder = false;

      setTopHeaders(tmpTopHeaders);

      const tableData = [];
      const totalValues = [];
      const buildColumns = (subItems) => {
        return subItems.reduce((p, o) => {
          p.push({
            id: v4(),
            description: `${o?.hotelClientAccount?.accountName || o?.hotel?.hotelName || ''}`,
            ...columns.slice(1).reduce((q, w, qid) => {
              q[w.field] = o.columnsData[qid];
              return q;
            }, {}),
            total: o.total,
            valueType: 'CURRENCY',
            children: o.items && o.items.length > 0 ? buildColumns(o.items) : [],
          });

          return p;
        }, []);
      };

      rawReport.sections.forEach((section, sIdx) => {
        const { items } = section;
        tableData.push({
          description: `${section.salesManager?.firstName} ${section.salesManager?.lastName}`,
          ...columns.slice(1).reduce((q, w, qid) => {
            if (totalValues[qid] !== undefined) {
              totalValues[qid] = totalValues[qid] || 0 + section.columnsData[qid];
            } else {
              totalValues.push(section.columnsData[qid]);
            }
            q[w.field] = section.columnsData[qid];
            return q;
          }, {}),
          valueType: 'CURRENCY',
          total: section.total,
          children: section.items && section.items.length > 0 ? buildColumns(section.items) : [],
          id: v4(),
        });
      });
      if (rawReport.sections.length) {
        tableData.push({
          footer: true,
          description: 'Total',
          valueType: 'CURRENCY',
          ...columns.slice(1).reduce((q, w, qid) => {
            q[w.field] = rawReport.total[qid];
            return q;
          }, {}),
          total: rawReport.sections.reduce((i, j) => {
            i = i + j.total;
            return i;
          }, 0),
        });
      }
      tableData.sort((a, b) =>
        a.description.toLowerCase() < b.description.toLowerCase()
          ? -1
          : a.description.toLowerCase() > b.description.toLowerCase()
          ? 1
          : 0,
      );
      setSubHeaders(columns);
      if (rawReport.sections.length) {
        setSalesData([{ children: tableData }]);
      }
    }
  }, [salesProductionReport, filters, addTopLevelHeadersToItems]);

  const headers = () => {
    const headers = topHeaders.map((topHeader, index) => {
      return { span: subHeaders.length - 1, content: topHeader.title };
    });
    return [{ span: 1, single: true }, ...headers];
  };

  const handleDownloadReport = ({ value }) => {
    if (!salesProductionReport?.data?.length || Object.keys(tableData).length === 0) {
      return;
    }
    let subHeader = [];
    let span = [];
    let count = 1;
    let indents = [];
    headers().forEach((item) => {
      subHeader.push(item?.content ? item?.content : '');
      if (item?.single) {
        span.push([count, count]);
        count++;
      } else {
        span.push([count, count + item?.span - 1]);
        count += item?.span;
      }
    });
    const { Description, ...rest } = tableData[0];
    const header = ['Description', ...Object.keys(rest)];
    findDepth(salesData[0]?.children, indents);
    exportToXLSX(
      tableData,
      buildDownloadableFilename({
        hotelName: hotelsMap[salesProductionReport.data[0].hotelId]?.hotelName,
        reportName: DownloadableReportNames.salesProd,
        period: salesProductionReport.data[0].period,
        startDate: timestampNoSeparators(new Date(salesProductionReport.data[0].startDate)),
        endDate: timestampNoSeparators(new Date(salesProductionReport.data[0].endDate)),
        hotelGroupName: hotelsGroupsMap[portfolio.hotelGroupId]?.groupName,
      }),
      value == 'excel' ? 'xlsx' : value,
      '',
      { subHeader, span, style: true, header, indents },
    );
  };

  return (
    <Fragment>
      <ToolBar>
        <ToolBarItem>
          <PortfolioSelector
            name={'portfolio'}
            value={portfolio}
            onChange={handleChangePortfolio}
            //disabled={salesProductionDefaultReportLoading}
            disableClearable
            allowAllGroups
            allowAllHotels
          />
        </ToolBarItem>
        <ToolBarItem>
          <SPPeriodSelector
            label={getText('generic.period')}
            name='period'
            value={filters.period}
            onChange={handleFilterChange}
            //disabled={salesProductionDefaultReportLoading}
            dataEl='selectorSPPeriod'
          />
        </ToolBarItem>
        {filters.period !== 'CUSTOM' && (
          <ToolBarItem>
            <InputDate
              label='Date'
              name='date'
              value={filters.date}
              minDate={new Date(new Date().getFullYear(), 0, 1)}
              maxDate={new Date(new Date().getFullYear(), 11, 31)}
              onChange={handleFilterChange}
              //disabled={salesProductionDefaultReportLoading}
              dataEl='inputDate'
              //maxDate={new Date()}
              errorMsg={getText('generic.dateErrorText')}
              helperText={dateErr}
            />
          </ToolBarItem>
        )}
        {filters.period === 'CUSTOM' && (
          <Fragment>
            <ToolBarItem>
              <InputDate
                label={getText('generic.startDate')}
                name='startDate'
                value={filters.startDate}
                minDate={new Date(new Date().getFullYear(), 0, 1)}
                maxDate={new Date(new Date().getFullYear(), 11, 31)}
                onChange={handleFilterChange}
                //disabled={salesProductionDefaultReportLoading}
                dataEl='inputDateStartDate'
                //maxDate={new Date()}
                errorMsg={getText('generic.dateErrorText')}
                helperText={startDateErr}
              />
            </ToolBarItem>
            <ToolBarItem>
              <InputDate
                label={getText('generic.endDate')}
                name='endDate'
                value={filters.endDate}
                minDate={filters.startDate}
                maxDate={new Date(new Date().getFullYear(), 11, 31)}
                onChange={handleFilterChange}
                //disabled={salesProductionDefaultReportLoading}
                dataEl='inputDateEndDate'
                //maxDate={new Date()}
                errorMsg={getText('generic.dateErrorText')}
                helperText={endDateErr}
              />
            </ToolBarItem>
          </Fragment>
        )}
        <ToolBarItem>
          <SPCompareToSelector
            label={getText('salesProduction.compareTo')}
            name='compareTo'
            value={filters.compareTo}
            onChange={handleFilterChange}
            //disabled={salesProductionDefaultReportLoading}
            dataEl='selectorSPCompareTo'
          />
        </ToolBarItem>
        <ToolBarItem>
          <Button
            iconName={reportRequested ? 'Refresh' : ''}
            text={reportRequested ? '' : getText('generic.go')}
            title={getText(`generic.${reportRequested ? 'refresh' : 'go'}`)}
            variant='secondary'
            onClick={() => requestReport()}
            disabled={
              filters.date == null ||
              (filters.period != 'CUSTOM' && dateErr != '') ||
              (filters.period == 'CUSTOM' && (startDateErr != '' || endDateErr != ''))
            }
            dataEl='buttonGo'
          />
        </ToolBarItem>
      </ToolBar>
      <ToolBar>
        <ToolBarItem toTheRight>
          {isPermitted('download') && (
            <ButtonDownloadAs
              iconName='CloudDownloadSharp'
              variant='tertiary'
              text=''
              title={getText('generic.download')}
              exclude={['pdf']}
              onClick={handleDownloadReport}
              disabled={Object.keys(tableData).length === 0}
              dataEl={'buttonDownloadAs'}
            />
          )}
        </ToolBarItem>
      </ToolBar>
      <Fragment>
        {salesProductionReportLoading && <DataLoading />}
        {!salesProductionReportLoading && <DisplayApiErrors errors={errors} />}
        {!salesProductionReportLoading && salesData.length === 0 && errors.length === 0 && (
          <DisplayNoData message={reportRequested ? getText('generic.emptyData') : getText('generic.selectFilters')} />
        )}
        {!salesProductionReportLoading && salesData.length > 0 && errors.length === 0 && (
          <DataContainer obsoleteData={!reportRequested}>
            <RecursiveDataTable
              data={salesData}
              subHeaders={subHeaders}
              headers={[headers()]}
              freezeColumns={0}
              removeBottomBorder={true}
              onRequestTableData={onRequestTableData}
              columnNamesMapping={columnNamesMapping(subHeaders, topHeaders[0]?.title)}
            />
          </DataContainer>
        )}
      </Fragment>
    </Fragment>
  );
});

SalesProductionDefault.displayName = 'SalesProductionDefault';

export { SalesProductionDefault };
