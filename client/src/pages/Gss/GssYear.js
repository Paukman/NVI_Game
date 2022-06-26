import React, { memo, Fragment, useState, useContext, useCallback, useMemo, useEffect, useRef } from 'react';

import {
  ToolBar,
  ToolBarItem,
  YearSelector,
  Button,
  Search,
  ButtonDownloadAs,
  colors,
  InputDate,
  Switch,
} from 'mdo-react-components';

import { AppContext, GlobalFilterContext, HotelContext } from '../../contexts';
import {
  HotelSelector,
  GssPeriodSelector,
  DisplayApiErrors,
  DisplayNoData,
  DataLoading,
  PaginatedDataTable,
  GroupSelector,
  DataContainer,
  GenericSelector,
  IfPermitted,
} from '../../components';
import logger from '../../utils/logger';
import { getText, search } from '../../utils/localesHelpers';
import { useGSSReports, useUserSettings } from '../../graphql';
import { CellRenderer } from './CellRenderer';
import { CSVLink } from 'react-csv';
import { buildDownloadData, buildDownloadableFilename } from '../../utils/downloadHelpers';
import { isDateValid } from '../../utils/validators';
import { useHistory } from 'react-router-dom';
import dayjs from 'dayjs';
import numeral from 'numeral';
import { DownloadableReportNames } from 'config/downlodableReportNames';
import { timestampNoSeparators } from '../../utils/formatHelpers';
import { useTableData } from 'hooks';
import { buildReportFilename, exportToXLSX } from '../../utils/downloadHelpers';
import { isZeroConditionExluded } from 'utils';
import { DateTimeHelpers } from '../../utils/dateHelpers';

let csvColumns = '';
let downloadHeaders = '';
let cColumns = [];

const GssYear = memo(() => {
  const { gssByMonthReportGet, gssByMonthReport, gssByMonthReportLoading, listquerygssBrandList, gssBrandList } =
    useGSSReports();
  const { hotelId, selectHotelId, portfolio, selectPortfolio } = useContext(GlobalFilterContext);
  const { hotelsGroups, hotelsGroupsMap, hotels, hotelsMap, loadingList } = useContext(HotelContext);
  const [reportRequested, setReportRequested] = useState(false);
  const history = useHistory();
  const [columns, setColumns] = useState([]);
  const [brandItems, setBrandItems] = useState([]);
  const { appPages, setPageProps } = useContext(AppContext);
  const { userSettingsState, userSettingsGetList, userSettingsSet, settingsListGet } = useUserSettings();
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({
    period: 'YTM',
    date: new Date(),
    keyword: '',
    from: new Date(),
    to: new Date(),
    hotelId: [],
    compareView: false,
    brandId: 'All',
  });
  const { onRequestTableData, tableData: resultData } = useTableData();

  const getPriorityColumnForDownloads = (item) => {
    if (item?.priority1Description) {
      return item?.priority1Description;
    }
    if (item?.hasNoData) {
      return getText('gss.noData');
    }
    return getText('gss.noPriority');
  };

  const getPriorityColumn1 = (item) => {
    if (item?.priority1Description) {
      return <span>{item?.priority1Description}</span>;
    }
    if (item?.hasNoData) {
      return getText('gss.noData');
    }
    return (
      <a
        style={{ textDecoration: 'underline', color: 'blue', cursor: 'pointer' }}
        onClick={() => history.push({ pathname: appPages.keys['medallia'].url, state: { id: item?.hotel?.id } })}
      >
        {getText('gss.setPriority')}
      </a>
    );
  };

  const defaultColumnsConfig = [
    {
      field: 'property',
      headerName: getText('generic.property'),
      align: 'left',
      width: 250,
      minWidth: 100,
    },
    {
      field: 'priority1',
      headerName: getText('gss.priority1'),
      align: 'left',
      width: 100,
      minWidth: 100,
      // eslint-disable-next-line
      onRender: (e) => getPriorityColumn1(e?.dataRow),
    },
    {
      field: 'sampleSize',
      headerName: getText('gss.sampleSize'),
      align: 'center',
      headerAlign: 'center',
      minWidth: 100,
      width: 100,
      onRender: (e) => {
        return !e?.dataRow?.priority1Description ? '-' : !e.dataRow.hasNoData ? e.dataRow.sampleSize : '-';
      },
    },
    // Other columns are dynamically added
  ];
  const csvLink = useRef();
  const excelLink = useRef();

  const handleFilterChange = (name, value) => {
    logger.debug('Filter changed:', { name, value });

    const newFilters = {
      ...filters,
      [name]: value,
    };

    setFilters(newFilters);

    if (name === 'compareView') {
      userSettingsSet({
        params: [{ settingCode: 'reports:gss:by-month:settings:enableComparison', userSettingValue: value.toString() }],
      });
    }
    if (['keyword, compareView'].indexOf(name) !== -1) {
      return;
    }

    if (reportRequested) {
      //requestReport(newFilters);
      setReportRequested(false);
    }
  };

  const handleDownloadAs = ({ value }) => {
    if (gssByMonthReport?.data && Array.isArray(resultData) && resultData?.length) {
      exportToXLSX(
        resultData,
        buildDownloadableFilename({
          reportName: DownloadableReportNames.gssMonth,
          startDate: timestampNoSeparators(new Date(gssByMonthReport?.data[0]?.startDate)),
          endDate: timestampNoSeparators(new Date(gssByMonthReport?.data[0]?.endDate)),
          hotelName: hotelsMap[gssByMonthReport.data.hotelId]?.hotelName,
          period: gssByMonthReport?.data[0]?.period,
        }),
        value == 'excel' ? 'xlsx' : value,
        '',
        {
          isHeader: false,
          style: true,
          noTotalStyle: true,
          // subHeader: ['', '', 'Actual', 'Budget', 'Variance'],
          // span: [
          //   [1, 1],
          //   [2, 2],
          //   [3, 4],
          //   [5, 6],
          //   [7, 8],
          // ],
        },
      );
    }
  };

  useEffect(() => {
    listquerygssBrandList({});
    userSettingsGetList({
      settingTypeId: 5000,
    });
  }, []);

  useEffect(() => {
    if (gssBrandList?.data && gssBrandList?.data.length > 0) {
      setBrandItems([
        { label: 'All Brands', value: 'All' },
        ...gssBrandList?.data.map((q) => ({ label: q?.brandName, value: q?.id })),
      ]);
      //setFilters({ ...filters, brandId: gssBrandList?.data[0]?.id });
    }
  }, [gssBrandList]);

  useEffect(() => {
    if (userSettingsState?.data?.length) {
      const varianceSettingCode = userSettingsState.data.find(
        (switchSetting) => switchSetting?.settingCode === 'reports:gss:by-month:settings:enableComparison',
      );
      setFilters({
        ...filters,
        ...(varianceSettingCode && { compareView: varianceSettingCode?.userSettingValue == 'false' ? false : true }),
      });
    }
  }, [userSettingsState]);

  const requestReport = (newFilters) => {
    const filters2use = newFilters || filters;
    portfolio.date = filters2use.date;
    const params = {
      hotelId: filters2use.hotelId || hotelId,
      period: filters2use.period,
      date: filters2use.date,
      brandId: filters2use?.brandId === 'All' ? '' : filters2use?.brandId,
      compareTo: (() => {
        const dh = new DateTimeHelpers();
        const datesRange = dh.createPeriod(filters2use.period, filters2use.date, { format: true, dateOnly: false });
        return {
          startDate: dh.applyOffsetByType({
            dateStr: datesRange.startDate,
            offsetType: 'LAST_YEAR',
            customDate: '',
            opt: {
              format: true,
              dateOnly: true,
            },
          }),
          endDate: dh.applyOffsetByType({
            dateStr: datesRange.endDate,
            offsetType: 'LAST_YEAR',
            customDate: '',
            opt: {
              format: true,
              dateOnly: true,
            },
          }),
        };
      })(),
    };
    logger.debug('Request GSS By Month report with params:', params);
    setColumns([]);
    gssByMonthReportGet(params);

    if (!reportRequested) {
      setReportRequested(true);
    }
  };

  useEffect(() => {
    const varianceColumn = [...cColumns].map((varianceMap, i) => {
      if (i > 2 && i < cColumns.length - 3) {
        // let value = gssPriortyList.data.find((q) => q.priority == c?.shn?.replace('Priority ', ''));
        // if (value) {
        varianceMap.headerName = filters.compareView ? (
          <>
            {varianceMap?.headerName}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <p
                style={{
                  color: colors.darkBlue,
                  margin: '0',
                  marginRight: '20px',
                  width: '80px',
                  textAlign: 'center',
                }}
              >
                Current
              </p>
              <p style={{ color: colors.darkBlue, margin: '0', width: '80px', textAlign: 'center' }}>Var_LY</p>
            </div>
          </>
        ) : (
          varianceMap?.emv
        );
        // }
        return varianceMap;
      } else {
        return varianceMap;
      }
    });
    setColumns(varianceColumn);
    if (filters.compareView) {
      setData(
        data.map((item) => ({
          ...item,
          ...item.columnsData.reduce((acc, columnData, idx) => {
            const columnName = cColumns[idx + 3];
            acc[columnName?.field] = (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <p
                  style={{
                    margin: '0px',
                    marginRight: '20px',
                    width: '80px',
                    textAlign: 'center',
                  }}
                >
                  {columnData.value}
                </p>
                <p style={{ margin: '0', width: '80px', textAlign: 'center' }}>
                  {numeral(columnData?.valueVariance).format('0.00')}
                </p>
              </div>
            );
            return acc;
          }, {}),
        })),
      );
    } else {
      setData(
        data.map((item) => ({
          ...item,
          ...item.columnsData.reduce((acc, columnData, idx) => {
            const columnName = cColumns[idx + 3];
            acc[columnName?.field] = columnData.value;
            return acc;
          }, {}),
        })),
      );
    }
  }, [filters?.compareView]);

  const handleClickDownload = (value) => {
    logger.debug('Download GSS By Month report as', value);
    switch (value.value) {
      case 'csv':
        //csvLink.current.link.click();
        break;

      case 'excel':
        //excelLink.current.click();
        break;
    }
  };

  useEffect(() => {
    if (!hotelId && hotels.length > 0) {
      selectHotelId(hotels[0].id);
    }
  }, [hotelId, hotels, selectHotelId]);

  useEffect(() => {
    if (gssByMonthReport.errors.length > 0) {
      return;
    }

    const data = gssByMonthReport.data[0];

    if (!data) {
      return;
    }

    // TODO: Update the code after API is ready
    const columns2set = data.columnsCfg || [];
    const newColumns = [...defaultColumnsConfig];

    columns2set.forEach((column, idx) => {
      newColumns.push({
        field: `column_${idx + 3}`,
        headerName: filters?.compareView ? (
          <>
            {dayjs(column.date).format('MMM YYYY')}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <p
                style={{
                  color: colors.darkBlue,
                  margin: '0',
                  marginRight: '20px',
                  width: '80px',
                  textAlign: 'center',
                }}
              >
                Current
              </p>
              <p style={{ color: colors.darkBlue, margin: '0', width: '80px', textAlign: 'center' }}>Var_LY</p>
            </div>
          </>
        ) : (
          dayjs(column.date).format('MMM YYYY')
        ),
        emv: dayjs(column.date).format('MMM YYYY'),
        align: 'center',
        headerAlign: 'center',
        width: filters?.compareView ? 150 : 80,
        minWidth: filters?.compareView ? 150 : 80,
        sortable: false,
        // onRender: CellRenderer,
        bgColor: idx % 2 === 1 ? colors.lightGrey : colors.white,
      });
    });

    const cCol = [
      ...newColumns,
      {
        field: `total`,
        headerName: 'Total',
        align: 'center',
        headerAlign: 'center',
        width: 100,
        minWidth: 100,
        sortable: false,
        // eslint-disable-next-line
        onRender: (e) => {
          return !e?.dataRow?.priority1Description ? (
            '-'
          ) : isZeroConditionExluded(e?.dataRow?.hasNoData) ? (
            <CellRenderer dataRow={e?.dataRow} column={e?.column} value={e.dataRow.total} />
          ) : (
            '-'
          );
        },
        bgColor: newColumns.length % 2 === 1 ? true : false,
      },
      {
        field: 'benchmark',
        headerName: 'Benchmark',
        align: 'center',
        headerAlign: 'center',
        width: 100,
        minWidth: 100,
        sortable: false,
        // eslint-disable-next-line
        onRender: (e) => {
          return !e?.dataRow?.priority1Description ? (
            '-'
          ) : !e.dataRow.hasNoData ? (
            <CellRenderer dataRow={e?.dataRow} column={e?.column} value={e.dataRow.benchmark} />
          ) : (
            '-'
          );
        },
        bgColor: (newColumns.length + 1) % 2 === 1 ? true : false,
      },
      {
        field: `variance`,
        headerName: 'Variance',
        align: 'center',
        headerAlign: 'center',
        width: 100,
        minWidth: 100,
        sortable: false,
        // eslint-disable-next-line
        onRender: (e) => {
          return !e?.dataRow?.priority1Description ? (
            '-'
          ) : !e.dataRow.hasNoData ? (
            <CellRenderer dataRow={e?.dataRow} column={e?.column} value={e.dataRow.variance} />
          ) : (
            '-'
          );
        },
        bgColor: (newColumns.length + 2) % 2 === 1 ? true : false,
      },
    ];

    setColumns(cCol);
    csvColumns = cCol.reduce((a, b) => {
      a[b.field] = {
        Header: b.headerName,
      };

      return a;
    }, {});
    downloadHeaders = cCol.reduce((a, b) => {
      a.push({ accessor: b.field, title: b.headerName });
      return a;
    }, []);
    let newData = [];
    data.items.forEach((item) => {
      newData.push({
        ...item,
        property: item?.hotel?.hotelName,
        priority1: getPriorityColumnForDownloads(item),
        sampleSize: item?.sampleSize ?? '-',
        total: isZeroConditionExluded(item?.total) ? numeral(item.total).format('0.00') : '-',
        benchmark: isZeroConditionExluded(item?.benchmark) ? numeral(item.benchmark).format('0.00') : '-',
        variance: isZeroConditionExluded(item?.variance) ? numeral(item.variance).format('0.00') : '-',
        ...(!item.priority1Description
          ? Array(cCol.length - 6).fill('-')
          : !item.hasNoData
          ? item.columnsData
          : Array(cCol.length - 6).fill('-')
        ).reduce((acc, columnData, idx) => {
          const columnName = cCol[idx + 3].field;
          acc[columnName] = columnData?.value;
          return acc;
        }, {}),
      });
    });
    if (filters.compareView) {
      newData = newData.map((item) => ({
        ...item,
        ...item.columnsData.reduce((acc, columnData, idx) => {
          const columnName = cCol[idx + 3];
          acc[columnName?.field] = (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p
                style={{
                  margin: '0px',
                  marginRight: '20px',
                  width: '80px',
                  textAlign: 'center',
                }}
              >
                {columnData.value}
              </p>
              <p style={{ margin: '0', width: '80px', textAlign: 'center' }}>
                {numeral(columnData?.valueVariance).format('0.00')}
              </p>
            </div>
          );
          return acc;
        }, {}),
      }));
    }
    cColumns = [...cCol];
    setData(newData);
  }, [gssByMonthReport]);

  const items = useMemo(() => {
    return data.filter((item) => {
      let found = false;

      if (filters.keyword.length === 0) {
        found = true;
      } else if (search(item.hotel?.hotelName, filters.keyword) !== -1) {
        found = true;
      } else if (search(item.priority1Description, filters.keyword) !== -1) {
        found = true;
      } else if (search(String(item.sampleSize), filters.keyword) !== -1) {
        found = true;
      } else if (search(String(item.total), filters.keyword) !== -1) {
        found = true;
      } else if (search(String(item.benchmark), filters.keyword) !== -1) {
        found = true;
      } else if (search(String(item.variance), filters.keyword) !== -1) {
        found = true;
      } else if (item.columnsData.includes(!isNaN(filters.keyword) ? Number(filters.keyword) : ' ')) {
        found = true;
      }

      return found;
    });
  }, [data, filters.keyword]);

  const downloadFileName = () => {
    const fromDate = timestampNoSeparators(new Date(gssByMonthReport.data[0].columnsCfg[0].date));
    const toDate = new Date(gssByMonthReport.data[0].columnsCfg[gssByMonthReport.data[0].columnsCfg.length - 1].date);
    return buildDownloadableFilename({
      hotelGroupName: hotelsGroupsMap[portfolio?.hotelGroupId]?.groupName,
      reportName: DownloadableReportNames.gssMonth,
      period: filters.period,
      startDate: fromDate,
      endDate: toDate,
    });
  };

  return (
    <Fragment>
      <ToolBar>
        <ToolBarItem>
          <GroupSelector
            name={'portfolio'}
            value={portfolio?.hotelGroupId === 0 ? { hotelGroupId: 0, hotelId: 0 } : portfolio}
            onChange={(name, value) => {
              const groupHotels = value ? hotelsGroupsMap[value?.hotelGroupId]?.hotels || [] : hotels;
              selectPortfolio(value);
              setFilters({
                ...filters,
                hotelId:
                  value?.hotelGroupId === -1 ? hotels.map((hotel) => hotel.id) : groupHotels.map((hotel) => hotel.id),
              });
              setReportRequested(false);
            }}
            disableClearable
            allowAllGroups
            allowAllHotels
          />
        </ToolBarItem>
        <ToolBarItem>
          <GenericSelector
            width='50px'
            label='Brand'
            items={brandItems}
            value={filters?.brandId}
            onChange={handleFilterChange}
            name='brandId'
            disabled={gssByMonthReportLoading || gssBrandList.data.length === 0}
          />
        </ToolBarItem>
        <ToolBarItem>
          <GssPeriodSelector name={'period'} value={filters.period} onChange={handleFilterChange} yearPeriods />
        </ToolBarItem>
        <ToolBarItem>
          <InputDate
            name='date'
            label={getText('generic.date')}
            // minDate={datesRange.minDate}
            // maxDate={datesRange.maxDate}
            value={filters.date}
            onChange={handleFilterChange}
            dataEl='inputDate'
            autoClose={true}
            errorMsg={getText('generic.dateErrorText')}
          />
        </ToolBarItem>
        <ToolBarItem>
          <Button
            iconName={reportRequested ? 'Refresh' : ''}
            text={reportRequested ? '' : getText('generic.go')}
            title={getText(`generic.${reportRequested ? 'refresh' : 'go'}`)}
            variant='secondary'
            onClick={() => requestReport(filters)}
            disabled={gssByMonthReportLoading || !isDateValid(filters.date)}
            dataEl='buttonGo'
          />
        </ToolBarItem>
      </ToolBar>
      <ToolBar>
        <ToolBarItem width={'450px'}>
          <Search
            label={getText('generic.search')}
            value={filters.keyword}
            name='keyword'
            onChange={handleFilterChange}
            disabled={gssByMonthReportLoading || !isDateValid(filters.date)}
            dataEl='searchInput'
            maxHeight={'200px'}
          />
        </ToolBarItem>
        <ToolBarItem toTheRight>
          <IfPermitted page='gss-month' permissionType='toggle-status'>
            <Switch
              name='compareView'
              labelPlacement={'start'}
              label={'Variance View'}
              value={filters.compareView}
              onChange={handleFilterChange}
              dataEl='compareView'
              disabled={gssByMonthReportLoading}
            />
          </IfPermitted>
        </ToolBarItem>
        <ToolBarItem>
          <IfPermitted page='gss-month' permissionType='download'>
            <ButtonDownloadAs
              iconName='CloudDownloadSharp'
              text=''
              variant='tertiary'
              title={getText('generic.download')}
              onClick={handleDownloadAs}
              exclude={['pdf']}
              dataEl={'buttonDownloadAs'}
              disabled={gssByMonthReportLoading || items.length === 0}
            />
          </IfPermitted>
        </ToolBarItem>
      </ToolBar>
      <Fragment>
        {gssByMonthReportLoading && <DataLoading />}
        {!gssByMonthReportLoading && gssByMonthReport.errors.length > 0 && (
          <DisplayApiErrors errors={gssByMonthReport.errors} />
        )}
        {!gssByMonthReportLoading && gssByMonthReport.data.length === 0 && gssByMonthReport.errors.length === 0 && (
          <DisplayNoData message={reportRequested ? getText('generic.emptyData') : getText('generic.selectFilters')} />
        )}
        {!gssByMonthReportLoading && gssByMonthReport.data.length > 0 && items?.length > 0 && (
          <PaginatedDataTable
            // obsoleteData={!reportRequested}
            expandCollapePlacement={-1}
            subHeaders={columns}
            items={items}
            dataRowsCount={gssByMonthReport.data.length}
            freezeColumns={0}
            stickyHeaders={true}
            onRequestTableData={onRequestTableData}
            filtersActive={!!filters?.keyword}
            search={filters?.keyword ?? ''}
          />
        )}
      </Fragment>
    </Fragment>
  );
});

GssYear.displayName = 'GssYear';

export { GssYear };
