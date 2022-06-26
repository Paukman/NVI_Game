import {
  Button,
  ButtonDownloadAs,
  InputDate,
  Search,
  ToolBar,
  ToolBarItem,
  Toggle,
  RecursiveDataTable,
  colors,
  Currency,
} from 'mdo-react-components';
import React, { memo, Fragment, useState, useContext, useCallback, useMemo, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { AppContext, HotelContext } from '../../contexts';
import {
  DataContainer,
  DisplayApiErrors,
  DataLoading,
  DisplayNoData,
  PortfolioSelector,
  IfPermitted,
} from '../../components';
import { getText } from '../../utils/localesHelpers';
import { isDateValid } from '../../utils/validators';
import { use306090Report } from '../../graphql/use306090Report';
import logger from '../../utils/logger';
import { getComparator, stableSort } from '../../utils/pageHelpers';
import { CellRenderer } from '../ProfitAndLoss/CellRenderer';
import { newPositionOfElement } from '../../utils/dataManipulation';
import numeral from 'numeral';
import { buildDownloadableFilename } from '../../utils/downloadHelpers';
import { DownloadableReportNames } from 'config/downlodableReportNames';
import { useTableData } from 'hooks';
import { exportToXLSX } from '../../utils/downloadHelpers';
import { filter, padStart } from 'lodash';

let baseHoteId = [];
let baseData = [];

const RollingMonth306090 = memo(() => {
  const { hotels, hotelsGroups, hotelsGroupsMap } = useContext(HotelContext);
  const { appPages } = useContext(AppContext);
  const history = useHistory();
  const [state, setState] = useState([]);
  const [allData, setAllData] = useState([]);
  const { rollingReport3060690GetLoading, getRollingReport306090, rollingReport3060690Get } = use306090Report();
  const [reportRequested, setReportRequested] = useState(false);
  const [subHeadersOfTable, setSubHeadersOfTable] = useState([]);
  const [headersOfTable, setHeadersOfTable] = useState([]);
  const [order, setOrder] = useState('');
  const [sortComparator, setSortComparator] = useState('');
  const [sortColumns, setSortColumns] = useState('');
  const [orderBy, setOrderBy] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [defaultHotelId, setdefaultHotelId] = useState('');
  const [defaultHotelName, setdefaultHotelName] = useState('');
  const [downloadFileName, setDownloadFileName] = useState('');
  const { onRequestTableData, tableData: resultData } = useTableData();
  const [portfolio, setPortfolio] = useState({
    hotelGroupId: -1,
    hotelId: -1,
  });

  const [filters, setFilters] = useState({
    hotelId: null,
    date: new Date(new Date().setDate(new Date().getDate() - 1)),
  });

  const customError =
    !!filters.date &&
    (filters.date.length !== 10 || new Date('1900-01-01') > new Date(filters.date)) &&
    getText('generic.invalidDate');

  useMemo(() => {
    if (hotelsGroups.length > 0) {
      if (!filters.hotelId) {
        setFilters({
          ...filters,
          hotelId: hotels.map((hotel) => hotel.id),
        });
      }
      setdefaultHotelId(hotels.map((hotel) => hotel.id));
      setdefaultHotelName(hotelsGroupsMap[hotelsGroups[0]?.id]?.hotels[0]?.hotelName);
    }
  }, [setdefaultHotelId, setdefaultHotelName, hotelsGroupsMap, hotelsGroups]);

  useMemo(() => {
    if (rollingReport3060690Get?.data.length > 0) {
      rollingReport3060690Get?.data[0]?.items.map((column, index, array) => {
        array.length - 1 === index
          ? column?.columnsData.forEach((header) => {
              header.adr = header?.roomsSoldQty != 0 ? header?.revenueTotal / header?.roomsSoldQty : '';
            })
          : '';
      });
      const mappedHeaders = rollingReport3060690Get?.data[0]?.columnsCfg.map((column) => {
        const { title } = column || {};
        return { title };
      });
      let headerTable = [];
      let count = 1;
      mappedHeaders.forEach((header, idx) => {
        Object.keys(rollingReport3060690Get?.data[0]?.subColumnsCfg).forEach((column, index) => {
          headerTable.push({
            field: `${column}-${idx}${index}`,
            headerName: getText(`report306090.${column}`),
            align: 'left',
            minWidth: index === 0 ? 120 : 90,
            width: index === 0 ? 120 : 90,
            sortable: true,
            parentTitle: header.title,
            hasBorder: count % 3 === 0 && mappedHeaders.length - 1 > idx ? true : false,
            bgColor: count % 2 === 1 ? true : false,
            // eslint-disable-next-line
            onRender: (e) =>
              column === 'roomsSoldQty' ? (
                CellRenderer(e)
              ) : (
                <span style={{ fontWeight: e?.dataRow?.property === 'TOTAL' ? 700 : 300 }}>
                  <Currency value={Number(e?.value)} />
                </span>
              ),
          });
          count++;
        });
      }, []);

      let tableData = [];
      rollingReport3060690Get?.data[0]?.items.forEach((item) => {
        const { hotelName, id } = item?.hotel || {};
        tableData.push(
          item.columnsData.reduce((obj, column, idx) => {
            const row = Object.keys(column).reduce((acc, col, index) => {
              return {
                ...acc,
                [`${col}-${idx}${index}`]: numeral(column[col]).format('0[.]00'),
              };
            }, {});
            return {
              ...obj,
              ...row,
              ...(!hotelName && { header: true }),

              property: hotelName ? hotelName : getText('report306090.total'),
              hotelId: id,
            };
          }, {}),
        );
      });
      const keysOfRow = Object.keys(tableData[0]);
      if (searchValue) {
        tableData = tableData.filter(
          (data) =>
            data?.property?.toLowerCase()?.includes(searchValue.toLowerCase()) || data?.property?.includes('TOTAL'),
        );
      }
      const sortColumnsRows = tableData.map((a) => ({
        ...a,
        ...keysOfRow.reduce((acc, key) => {
          return { ...acc, [key]: key !== 'property' ? Number(a[key]) || 0 : a[key] };
        }, {}),
      }));

      const sortComparatorKey = (orderBy) => {
        const selectedKey = keysOfRow.find((key) => {
          return key === orderBy;
        });

        return selectedKey || orderBy;
      };

      setSortComparator(sortComparatorKey(orderBy));
      setSortColumns(sortColumnsRows);
      baseData = tableData;
      setState(tableData);
      setAllData(tableData);
      setHeadersOfTable(mappedHeaders);
      setSubHeadersOfTable([
        {
          field: 'property',
          headerName: getText('generic.property'),
          align: 'left',
          minWidth: 200,
          width: 200,
          sortable: true,
          background: colors.white,
          hasBorder: true,
          bgColor: false,
        },
        ...headerTable,
      ]);
    }
  }, [
    rollingReport3060690Get,
    setHeadersOfTable,
    setSortColumns,
    setState,
    setSubHeadersOfTable,
    orderBy,
    searchValue,
  ]);

  const headers = () => {
    const headers = [{ span: 1, single: true }];
    headersOfTable.map((header, index) => {
      headers.push({
        span: 3,
        content: header.title,
      });
    });
    return headers;
  };

  const handleFilterChange = (name, value) => {
    setSearchValue(value);
  };

  const requestReport = (filtrate = null) => {
    getRollingReport306090({
      params: filtrate
        ? {
            ...filtrate,
            hotelId:
              filtrate.hotelId !== null && filtrate.hotelId !== undefined && filtrate.hotelId != -1
                ? filtrate.hotelId
                : hotels.map((hotel) => hotel.id),
          }
        : {
            ...filters,
            hotelId:
              filters.hotelId !== null && filters.hotelId !== undefined && filters.hotelId != -1
                ? filters.hotelId
                : hotels.map((hotel) => hotel.id),
          },
    });

    if (!reportRequested) {
      setReportRequested(true);
    }
  };
  [
    {
      span: 1,
      single: true,
    },
    {
      span: 3,
      content: '30 Day Outlook',
    },
    {
      span: 3,
      content: '31-60 Day Outlook',
    },
    {
      span: 3,
      content: '60 Day Total',
    },
    {
      span: 3,
      content: '90 Day Outlook',
    },
    {
      span: 3,
      content: '90 Day Total',
    },
  ];
  const handleDownloadAs = ({ value }) => {
    if (rollingReport3060690Get?.data && Array.isArray(resultData) && resultData?.length) {
      let subHeader = [];
      let span = [];
      let count = 1;
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
      exportToXLSX(
        resultData,
        buildDownloadableFilename({
          hotelGroupName:
            portfolio.hotelGroupId == -1 || portfolio.hotelGroupId == 0
              ? getText('generic.all')
              : hotelsGroups.find((element) => element.id == portfolio.hotelGroupId).groupName,
          date: filters.date,
          reportName: DownloadableReportNames.report306090,
        }),
        value == 'excel' ? 'xlsx' : value,
        '',
        {
          isHeader: false,
          style: true,
          subHeader,
          span,
        },
      );
    }
  };

  const requestSort = useCallback(
    (a, b) => {
      if (orderBy === a) {
        setOrder(order === 'desc' ? 'asc' : 'desc');
      } else {
        setOrder(b);
      }

      setOrderBy(a);
      setState(stableSort(sortColumns, getComparator(b, sortComparator)));
    },
    [setState, setOrderBy, sortColumns, sortComparator, getComparator, stableSort, setOrder, orderBy, order],
  );
  const location = useLocation();

  useEffect(() => {
    if (location.state) {
      if (location.state.portfolio) {
        setPortfolio(location.state.portfolio);
      }
      setFilters({
        hotelId: location.state.hotelId ? location.state.hotelId : defaultHotelId,
        date: location.state.date,
      });
      if (location.state.date) {
        requestReport({ hotelId: location.state.hotelId ?? defaultHotelId, date: location.state.date });
      }
    }
  }, [location?.state]);

  const dfn = () => {
    return buildDownloadableFilename({
      hotelGroupName:
        portfolio.hotelGroupId == -1 || portfolio.hotelGroupId == 0
          ? getText('generic.all')
          : hotelsGroups.find((element) => element.id == portfolio.hotelGroupId).groupName,
      date: filters.date,
      reportName: DownloadableReportNames.report306090,
    });
  };

  const sortData = (state) => {
    const condition = state[state.length - 1]?.property;

    if (state.length > 0 && condition !== getText('report306090.total')) {
      return newPositionOfElement(state, getText('report306090.total'), 'calendar');
    }
    return state;
  };
  return (
    <Fragment>
      <ToolBar>
        <ToolBarItem>
          <PortfolioSelector
            name={'portfolio'}
            value={portfolio.hotelId === -1 ? { hotelGroupId: 0, hotelId: defaultHotelId } : portfolio}
            onChange={(name, value) => {
              setPortfolio(value);
              let hotelIds = [];

              if (value.hotelGroupId === 0 && value.hotelId === 0) {
                hotelIds = hotels.map((hotel) => hotel.id);
              } else if (value.hotelGroupId !== 0) {
                hotelIds = hotelsGroupsMap[value.hotelGroupId]?.hotels.map((hotel) => hotel.id);
              }
              baseHoteId = hotelIds.length > 0 ? hotelIds : value.hotelId;
              setFilters({
                ...filters,
                hotelId: hotelIds.length > 0 ? hotelIds : value.hotelId,
              });
              setReportRequested(false);
            }}
            disableClearable
            allowAllGroups
            allowHotelSelection={false}
          />
        </ToolBarItem>
        <ToolBarItem>
          <InputDate
            label={getText('generic.date')}
            name='date'
            value={filters.date}
            placeholder='01/01/2021'
            onChange={(name, value) => {
              logger.debug('Filter changed:', { name, value });

              setFilters({
                ...filters,
                date: value,
              });
              setReportRequested(false);
            }}
            disabled={rollingReport3060690GetLoading}
            dataEl='inputDate'
          />
        </ToolBarItem>
        <ToolBarItem>
          <Button
            iconName={reportRequested ? 'Refresh' : ''}
            text={reportRequested ? '' : getText('generic.go')}
            title={getText(`generic.${reportRequested ? 'refresh' : 'go'}`)}
            variant='secondary'
            onClick={() => requestReport()}
            disabled={rollingReport3060690GetLoading || !isDateValid(filters.date)}
            dataEl='buttonGo'
          />
        </ToolBarItem>
        <ToolBarItem toTheRight>
          <Toggle
            value={0}
            onChange={(item) => {
              if (item === 1) {
                history.push({
                  pathname: appPages.keys['306090-calendar-month'].url,
                  state: {
                    ...filters,
                    hotelId:
                      filters.hotelId !== null && filters.hotelId !== undefined && filters.hotelId != -1
                        ? filters.hotelId
                        : hotels.map((hotel) => hotel.id),
                    portfolio,
                  },
                });
              }
            }}
            dataEl='toggleRollingMonth306090'
          >
            <div data-el='buttonMapping'>{getText('report306090.rollingMonth')}</div>
            <div data-el='buttonSummary'>{getText('report306090.calendarMonth')}</div>
          </Toggle>
        </ToolBarItem>
      </ToolBar>
      <ToolBar>
        <ToolBarItem width={'450px'}>
          <Search
            label={getText('generic.search')}
            value={searchValue}
            name='keyword'
            onChange={handleFilterChange}
            disabled={rollingReport3060690GetLoading}
            dataEl='searchInput'
          />
        </ToolBarItem>
        <ToolBarItem toTheRight>
          <IfPermitted page='306090-rolling-month' permissionType='download'>
            <ButtonDownloadAs
              iconName='CloudDownloadSharp'
              text=''
              variant='tertiary'
              title={getText('generic.download')}
              onClick={handleDownloadAs}
              exclude={['pdf']}
              disabled={rollingReport3060690GetLoading}
              dataEl={'buttonDownloadAs'}
            />
          </IfPermitted>
        </ToolBarItem>
      </ToolBar>
      <Fragment>
        {rollingReport3060690GetLoading && <DataLoading />}
        {!rollingReport3060690GetLoading && rollingReport3060690Get.errors.length > 0 && (
          <DisplayApiErrors errors={rollingReport3060690Get.errors} customError={customError} />
        )}
        {!rollingReport3060690GetLoading &&
          rollingReport3060690Get.data.length === 0 &&
          rollingReport3060690Get.errors.length === 0 && (
            <DisplayNoData
              message={reportRequested ? getText('generic.emptyData') : getText('generic.selectFilters')}
            />
          )}
        {!rollingReport3060690GetLoading && rollingReport3060690Get.data.length > 0 && (
          <DataContainer obsoleteData={!reportRequested}>
            <RecursiveDataTable
              footer
              hasStripes={false}
              expandCollapePlacement={-1}
              headers={[headers()]}
              subHeaders={subHeadersOfTable}
              data={[{ children: sortData(state) }]}
              order={order}
              orderBy={orderBy}
              onRequestSort={requestSort}
              freezeColumns={0}
              stickyHeaders={true}
              onRequestTableData={(value) => {
                value.forEach((v) => {
                  const vs = ['Rooms Sold', 'Revenue', 'ADR'];
                  const hs = headers().map((w) => w.content);
                  Object.keys(v).forEach((q) => {
                    let hasValue = vs.find((a) => q.includes(a));
                    if (hasValue) {
                      v[
                        `${hasValue}${
                          Number(q.replace(hasValue, ''))
                            ? `(${hs[Number(q.replace(hasValue, '')) + 1]})`
                            : `(${hs[1]})`
                        }`
                      ] =
                        hasValue === 'Rooms Sold'
                          ? numeral(v[q]).format(`(0,0)`)
                          : numeral(Math.abs(v[q]) < 1e-6 ? 0 : v[q]).format(`($0,0.${padStart('', 2, '0')})`);
                      delete v[q];
                    }
                  });
                });
                onRequestTableData(value);
              }}
            />
          </DataContainer>
        )}
      </Fragment>
    </Fragment>
  );
});

RollingMonth306090.displayName = 'RollingMonth306090';

export { RollingMonth306090 };
