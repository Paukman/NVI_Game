import React, { memo, Fragment, useState, useContext, useCallback, useMemo, useEffect, useRef } from 'react';
import { cloneDeep, filter } from 'lodash';
import {
  ToolBar,
  ToolBarItem,
  InputDate,
  Button,
  Search,
  Switch,
  ButtonDownloadAs,
  colors,
  InputField,
  ExclamationIcon,
} from 'mdo-react-components';
import { useHistory } from 'react-router-dom';
import { useTableData } from 'hooks';
import { buildReportFilename, exportToXLSX } from '../../utils/downloadHelpers';

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
  useIfPermitted,
} from '../../components';
import logger from '../../utils/logger';
import { getText, search } from '../../utils/localesHelpers';
import { isDateValid } from '../../utils/validators';
import { useGSSReports, useUserSettings } from '../../graphql';
import { CellRenderer } from './CellRenderer';
import { SetPriorityLink } from './styled';
import { buildDownloadData, buildDownloadableFilename } from '../../utils/downloadHelpers';
import dayjs from 'dayjs';
import numeral from 'numeral';
import { DownloadableReportNames } from 'config/downlodableReportNames';
import { timestampNoSeparators } from '../../utils/formatHelpers';
import { columnNamesMappingGssPriority } from './util';
import { DateTimeHelpers } from '../../utils/dateHelpers';

let dColumns = [];
let csvColumns = '';
let downloadHeaders = '';

const defaultColumnsConfig = [
  {
    field: 'property',
    headerName: getText('generic.property'),
    align: 'left',
    minWidth: 100,
    width: 300,
    dhn: getText('generic.property'),
    background: colors.white,
  },
];

const GssPiority = memo(() => {
  const {
    gssByPriorityReportGet,
    gssPriorityReport,
    gssPriorityReportLoading,
    listquerygssPriortyList,
    gssPriortyList,
    listgssPriortyCreateUpdate,
    gssPriorityNameSet,
  } = useGSSReports();
  const { hotelId, selectHotelId, portfolio, selectPortfolio } = useContext(GlobalFilterContext);
  const { hotelsGroups, hotelsGroupsMap, hotels, hotelsMap, loadingList } = useContext(HotelContext);
  const { appPages } = useContext(AppContext);
  const [reportRequested, setReportRequested] = useState(false);
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [filters, setFilters] = useState({
    period: GssPeriodSelector.periodsForMonthReport[0],
    date: new Date(),
    startDate: new Date(),
    endDate: new Date(),
    keyword: '',
    showDescription: false,
    priorityQty: '',
    compareView: false,
    brandId: 'All',
  });
  const history = useHistory();
  const [priorities, setPriorities] = useState([]);
  const [brandItems, setBrandItems] = useState([]);
  const { onRequestTableData, tableData: resultData } = useTableData();
  const { listgssMedalliaPriorityList, gssMedalliaPriorityList, listquerygssBrandList, gssBrandList } = useGSSReports();
  const { userSettingsState, userSettingsGetList, userSettingsSet, settingsListGet } = useUserSettings();

  useEffect(() => {
    listquerygssBrandList({});
    listgssMedalliaPriorityList({});
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
      const cv = userSettingsState.data.find(
        (switchSetting) => switchSetting?.settingCode === 'reports:gss:by-priority:settings:enableComparison',
      );

      const pq = userSettingsState.data.find(
        (switchSetting) => switchSetting?.settingCode === 'reports:gss:by-priority:settings:prioritiesQty',
      );

      setFilters({
        ...filters,
        ...(pq && { priorityQty: pq?.userSettingValue ? Number(pq?.userSettingValue) : 5 }),
        ...(cv && { compareView: cv?.userSettingValue == 'false' ? false : true }),
      });
    }
  }, [userSettingsState]);

  useEffect(() => {
    if (gssMedalliaPriorityList?.data?.length) {
      //setPriorities(gssMedalliaPriorityList.data[0].priorities);
      setPriorities(
        gssMedalliaPriorityList.data[0].priorities
          .filter((priority) => priority !== 0)
          .map((priority) => ({ label: priority, value: priority })),
      );
      setFilters({ ...filters });
    }
  }, [gssMedalliaPriorityList]);

  const handleFilterChange = (name, value) => {
    logger.debug('Filter changed:', { name, value });

    const newFilters = {
      ...filters,
      [name]: value,
    };
    if (name === 'priorityQty') {
      userSettingsSet({
        params: [{ settingCode: 'reports:gss:by-priority:settings:prioritiesQty', userSettingValue: value.toString() }],
      });
    }

    if (name === 'compareView') {
      userSettingsSet({
        params: [
          { settingCode: 'reports:gss:by-priority:settings:enableComparison', userSettingValue: value.toString() },
        ],
      });
    }

    setFilters(newFilters);
    if (!['showDescription', 'keyword', 'compareView'].includes(name)) {
      if (reportRequested) {
        setReportRequested(false);
      }
    }
    // if (name === 'showDescription' && value) {
    //   listquerygssPriortyList({
    //     priority: null,
    //     priorityName: null,
    //   });
    // }
    if (name === 'period' && value === 'DATE_RANGE') {
      return;
    }

    if (['showDescription', 'keyword'].indexOf(name) !== -1) {
      return;
    }
  };

  const handleDownloadAs = ({ value }) => {
    if (gssPriorityReport?.data && Array.isArray(resultData) && resultData?.length) {
      exportToXLSX(
        resultData,
        buildDownloadableFilename({
          reportName: DownloadableReportNames.gssByPriority,
          startDate: timestampNoSeparators(new Date(gssPriorityReport?.data[0]?.startDate)),
          endDate: timestampNoSeparators(new Date(gssPriorityReport?.data[0]?.endDate)),
          hotelName: hotelsMap[gssPriorityReport.data.hotelId]?.hotelName,
          period: gssPriorityReport?.data[0]?.period,
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

  const requestReport = (newFilters) => {
    const filters2use = newFilters || filters;
    const params = {
      // TODO: Update when API is updated, use array of hotels from selected group
      //hotelId: filters2use.hotelId || hotelId,

      ...(filters2use.period != 'DATE_RANGE' && { period: filters2use.period }),
      ...(filters2use.period != 'DATE_RANGE' && { date: filters2use.date }),
      ...(filters2use.period === 'DATE_RANGE' && { fromDate: filters2use.startDate }),
      ...(filters2use.period === 'DATE_RANGE' && { toDate: filters2use.endDate }),
      prioritiesQty: filters2use.priorityQty === 0 ? null : filters2use.priorityQty,
      brandId: filters2use?.brandId === 'All' ? '' : filters2use?.brandId,
      compareTo: (() => {
        const dh = new DateTimeHelpers();
        let datesRange;
        if (filters2use.period != 'DATE_RANGE') {
          datesRange = dh.createPeriod(filters2use.period, filters2use.date, { format: true, dateOnly: false });
        } else {
          datesRange = {
            startDate: filters2use.startDate,
            endDate: filters2use.endDate,
          };
        }
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
    logger.debug('Request GSS By Priority report with params:', params);
    setColumns([]);
    dColumns = [];
    gssByPriorityReportGet(params);
    listquerygssPriortyList({
      priority: null,
      priorityName: null,
    });
    setReportRequested(true);
  };

  const handleTextChange = (a, b, c, e) => {
    let qc = columns.map((q) => {
      if (q.field === e.field) {
        q.et = b;
        return q;
      } else {
        return q;
      }
    });
    dColumns = qc;
  };

  const saveEdit = (val = '') => {
    listgssPriortyCreateUpdate({
      params: dColumns
        .filter((col) => !!col.priority || col.priority === 0)
        .map((col) => ({
          priorityName: col.et || col.dhn || col?.headerName,
          priority: col.priority,
        })),
    });
    setIsEdit(false);
    let cols = dColumns.map((q, i) => {
      return {
        ...q,
        dhn: q.et ? q.et : q.dhn,
        headerName:
          filters.compareView && i > 1 ? (
            <>
              {q.et ? q.et : q.dhn}
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
          ) : q.et ? (
            q.et
          ) : (
            q.dhn
          ),
        et: '',
      };
    });

    dColumns = cols;
    setColumns(cols);
  };

  const handleClickEditDescriptions = (val = '') => {
    setIsEdit(!isEdit);
    if (val != '' ? val : !isEdit) {
      let col = columns.map((q, i) => {
        if (i > 1) {
          return {
            ...q,
            headerName: (
              <InputField
                defaultValue={q.et || q.dhn}
                onChange={(a, b, c) => handleTextChange(a, b, c, q)}
                fontSize={12}
              />
            ),
          };
        } else {
          return q;
        }
      });
      setColumns(col);
      dColumns = col;
    } else {
      let cols = columns.map((q, i) => {
        return {
          ...q,
          headerName:
            filters.compareView && i > 1 ? (
              <>
                {q.dhn}
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
              q.dhn
            ),
          et: '',
        };
      });
      setColumns(cols);
      dColumns = cols;
    }
  };

  const { isPermitted } = useIfPermitted({ page: 'gss-priority' });
  const permitted = isPermitted('set-priority');
  const handleSetPriority = () => (item) => {
    if (!permitted) return;
    history.push({ pathname: appPages.keys['medallia'].url, state: { id: item?.hotel?.id } });
  };

  const setPriority = (value, item) => {
    if (!value) {
      return (
        <SetPriorityLink onClick={handleSetPriority(item)} isPermitted={permitted}>
          {getText('gss.setPriority')}
        </SetPriorityLink>
      );
    }
    return <CellRenderer value={value} />;
  };

  useEffect(() => {
    if (gssPriorityNameSet && gssPriorityNameSet === 'done') {
      listquerygssPriortyList({
        priority: null,
        priorityName: null,
      });
    }
  }, [gssPriorityNameSet]);

  const setColumnField = (columnData) => {
    if (columnData?.priorityValue === 0 && !columnData?.priorityName) {
      return null;
    }
    return filters.showDescription ? columnData?.priorityName : numeral(columnData?.priorityValue).format('0.00');
  };

  useEffect(() => {
    if (!filters.showDescription) {
      let col = columns.map((q, i) => ({
        ...q,
        headerName:
          filters.compareView && i > 1 ? (
            <>
              {q.dhn}
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
            q.dhn
          ),
      }));
      setColumns(col);
      dColumns = col;
    } else {
      const dQ = columns.map((c, i) => {
        if (i > 1) {
          // let value = gssPriortyList.data.find((q) => q.priority == c?.shn?.replace('Priority ', ''));
          // if (value) {
          c.emm = gssPriortyList.data
            .filter((switchSetting) => switchSetting.priority == c?.dhn?.replace('Priority ', ''))
            .map((e) => e.priorityName);
          c.headerName = filters.compareView ? (
            <>
              <span style={{ display: 'flex' }}>
                <span style={{ marginRight: 'auto', marginLeft: 'auto' }}>{c.dhn}</span>{' '}
                {c.emm.length > 1 && <ExclamationIcon data={c.emm} />}
              </span>
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
            <span style={{ display: 'flex' }}>
              <span style={{ marginRight: 'auto', marginLeft: 'auto' }}>{c.dhn}</span>{' '}
              {c.emm.length > 1 && <ExclamationIcon data={c.emm} />}
            </span>
          );
          // }
          return c;
        } else {
          return c;
        }
      });
      setColumns(dQ);
      dColumns = dQ;
    }

    if (filters.compareView) {
      setData(
        data.map((item) => ({
          ...item,
          ...item.columnsData.reduce((acc, columnData, idx) => {
            const columnName = dColumns[idx + 2];
            acc[columnName?.field] = (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <p
                  style={{
                    margin: '0px',
                    marginRight: '20px',
                    width: '80px',
                    textAlign: 'center',
                    ...(filters.showDescription && { whiteSpace: 'break-spaces' }),
                  }}
                >
                  {setPriority(setColumnField(columnData))}
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
            const columnName = dColumns[idx + 2];
            acc[columnName?.field] = setColumnField(columnData);
            return acc;
          }, {}),
        })),
      );
    }
  }, [filters.showDescription, filters.compareView]);

  // useEffect(() => {
  //   if (filters.compareView) {
  //     setData(
  //       data.map((item) => ({
  //         ...item,
  //         ...item.columnsData.reduce((acc, columnData, idx) => {
  //           const columnName = dColumns[idx + 2];
  //           acc[columnName?.field] = (
  //             <table className='table-bordered'>
  //               <tr>
  //                 <th style={{ color: colors.darkBlue, margin: '0' }}>Current</th>
  //                 <th style={{ color: colors.darkBlue, margin: '0' }}>Var_LY</th>
  //               </tr>
  //               <tr>
  //                 <td>{setPriority(setColumnField(columnData))}</td>
  //                 <td>{numeral(columnData?.valueVariance).format('0.00')}</td>
  //               </tr>
  //             </table>
  //           );
  //           return acc;
  //         }, {}),
  //       })),
  //     );
  //   } else {
  //     setData(
  //       data.map((item) => ({
  //         ...item,
  //         ...item.columnsData.reduce((acc, columnData, idx) => {
  //           const columnName = dColumns[idx + 2];
  //           acc[columnName?.field] = setColumnField(columnData);
  //           return acc;
  //         }, {}),
  //       })),
  //     );
  //   }
  // }, [filters.compareView]);

  const handleClickDownload = (value) => {
    logger.debug('Download GSS By Priority report as', value);
    switch (value.value) {
      case 'csv':
        //csvLink.current.link.click();
        break;

      case 'excel':
        //excelLink.current.click();
        break;
    }
  };

  const validateDisabledButton = (event) => {
    if (filters.period != 'DATE_RANGE') {
      return !isDateValid(filters.date);
    } else {
      return !isDateValid(filters.startDate) || !isDateValid(filters.endDate);
    }
  };

  useEffect(() => {
    if (!hotelId && hotels.length > 0) {
      selectHotelId(hotels[0].id);
    }
  }, [hotelId, hotels, selectHotelId]);

  useEffect(() => {
    if (gssPriorityReport.errors.length > 0) {
      return;
    }

    const data = gssPriorityReport.data[0];

    if (!data) {
      return;
    }

    // TODO: Update the code after API is ready

    const columns2set = data.columnsCfg.filter((col) => col.priority <= 10 && col.priority !== 0) || [];
    let newColumns = [
      ...defaultColumnsConfig,
      {
        field: `sampleSize`,
        headerName: 'Sample Size',
        align: 'center',
        headerAlign: 'center',
        width: 100,
        minWidth: 100,
        sortable: false,
        onRender: CellRenderer,
        dhn: 'Sample Size',
      },
    ];

    columns2set.forEach((column, idx) => {
      newColumns.push({
        field: `column_${idx + 2}`,
        headerName: column.name,
        priority: column.priority,
        align: 'center',
        headerAlign: 'center',
        width: 100,
        minWidth: 100,
        sortable: false,
        onRender: (e) => setPriority(e?.value, e?.dataRow),
        dhn: column.name,
        bgColor: idx % 2 === 1 ? colors.lightGrey : colors.white,
      });
    });
    let newData = [];
    data.items.forEach((item) => {
      newData.push({
        ...item,
        property: item?.hotel?.hotelName,
        ...item.columnsData.reduce((acc, columnData, idx) => {
          const columnName = newColumns[idx + 2];
          acc[columnName?.field] = setColumnField(columnData);
          return acc;
        }, {}),
      });
    });

    newData.sort((a, b) =>
      a.property.toLowerCase() < b.property.toLowerCase()
        ? -1
        : a.property.toLowerCase() > b.property.toLowerCase()
        ? 1
        : 0,
    );
    setColumns(
      newColumns.map((q, i) =>
        filters?.compareView && i > 1
          ? {
              ...q,
              headerName: (
                <>
                  {q?.headerName}
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
              ),
            }
          : q,
      ),
    );
    dColumns = newColumns;
    if (filters.compareView) {
      setData(
        newData.map((item) => ({
          ...item,
          ...item.columnsData.reduce((acc, columnData, idx) => {
            const columnName = dColumns[idx + 2];
            acc[columnName?.field] = (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <p
                  style={{
                    margin: '0px',
                    marginRight: '20px',
                    width: '80px',
                    textAlign: 'center',
                    ...(filters.showDescription && { whiteSpace: 'break-spaces' }),
                  }}
                >
                  {setPriority(setColumnField(columnData))}
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
      setData(newData);
    }
  }, [gssPriorityReport]);

  const items = useMemo(() => {
    return data.filter((item) => {
      let found = false;

      if (filters.keyword.length === 0) {
        found = true;
      } else if (search(item.description, filters.keyword) !== -1) {
        found = true;
      } else if (search(item.property, filters.keyword) !== -1) {
        found = true;
      } else {
        const values = Object.values(item);
        for (let idx = 0, len = values.length; idx < len; ++idx) {
          found = search(`${numeral(values[idx]).format('0.00')}`, filters.keyword) !== -1;
          if (found) {
            break;
          }
        }
      }

      return found;
    });
  }, [data, filters.keyword]);

  return (
    <Fragment>
      <ToolBar>
        <ToolBarItem>
          <GroupSelector
            name={'portfolio'}
            value={portfolio}
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
            disabled={gssPriorityReportLoading || gssBrandList.data.length === 0}
          />
        </ToolBarItem>
        <ToolBarItem>
          <GssPeriodSelector name={'period'} value={filters.period} onChange={handleFilterChange} />
        </ToolBarItem>
        {filters.period !== 'DATE_RANGE' && (
          <ToolBarItem>
            <InputDate
              label={getText('generic.date')}
              name='date'
              value={filters.date}
              onChange={handleFilterChange}
              disabled={gssPriorityReportLoading}
              dataEl='inputDate'
              errorMsg={getText('generic.dateErrorText')}
            />
          </ToolBarItem>
        )}
        {filters.period === 'DATE_RANGE' && (
          <Fragment>
            <ToolBarItem>
              <InputDate
                label={getText('generic.startDate')}
                name='startDate'
                value={filters.startDate}
                onChange={handleFilterChange}
                disabled={gssPriorityReportLoading}
                dataEl='inputDateStartDate'
                errorMsg={getText('generic.dateErrorText')}
              />
            </ToolBarItem>
            <ToolBarItem>
              <InputDate
                label={getText('generic.endDate')}
                name='endDate'
                minDate={filters.startDate}
                value={filters.endDate}
                onChange={handleFilterChange}
                disabled={gssPriorityReportLoading}
                dataEl='inputDateEndDate'
                errorMsg={getText('generic.dateErrorText')}
              />
            </ToolBarItem>
          </Fragment>
        )}
        <ToolBarItem>
          <GenericSelector
            width='50px'
            label='# of priorities'
            items={priorities}
            value={filters?.priorityQty}
            onChange={handleFilterChange}
            name='priorityQty'
            disabled={gssPriorityReportLoading}
          />
        </ToolBarItem>
        <ToolBarItem>
          <Button
            iconName={reportRequested ? 'Refresh' : ''}
            text={reportRequested ? '' : getText('generic.go')}
            title={getText(`generic.${reportRequested ? 'refresh' : 'go'}`)}
            variant='secondary'
            onClick={() => requestReport(filters)}
            disabled={gssPriorityReportLoading || validateDisabledButton()}
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
            disabled={gssPriorityReportLoading}
            dataEl='searchInput'
          />
        </ToolBarItem>
        {!isEdit ? (
          <>
            <ToolBarItem toTheRight>
              <IfPermitted page='gss-priority' permissionType='toggle-status'>
                <Switch
                  name='showDescription'
                  label='Show Description'
                  labelPlacement={'start'}
                  value={filters.showDescription}
                  onChange={handleFilterChange}
                  dataEl='switchShowDescription'
                  disabled={gssPriorityReportLoading}
                />
              </IfPermitted>
            </ToolBarItem>
            <ToolBarItem>
              <IfPermitted page='gss-priority' permissionType='toggle-status'>
                <Switch
                  name='compareView'
                  labelPlacement={'start'}
                  label={'Variance View'}
                  value={filters.compareView}
                  onChange={handleFilterChange}
                  dataEl='compareView'
                  disabled={gssPriorityReportLoading}
                />
              </IfPermitted>
            </ToolBarItem>
            <ToolBarItem>
              <IfPermitted page='gss-priority' permissionType='edit-column'>
                <Button
                  variant='tertiary'
                  text=''
                  iconName='Edit'
                  title={getText('generic.editDescriptions')}
                  onClick={handleClickEditDescriptions}
                  disabled={gssPriorityReportLoading}
                  dataEl='buttonEditDescription'
                />
              </IfPermitted>
            </ToolBarItem>
            <ToolBarItem>
              <IfPermitted page='gss-priority' permissionType='download'>
                <ButtonDownloadAs
                  iconName='CloudDownloadSharp'
                  text=''
                  variant='tertiary'
                  title={getText('generic.download')}
                  onClick={handleDownloadAs}
                  exclude={['pdf']}
                  disabled={gssPriorityReportLoading || gssPriorityReport.data.length === 0}
                  dataEl={'buttonDownloadAs'}
                />
              </IfPermitted>
            </ToolBarItem>
          </>
        ) : (
          <>
            <ToolBarItem toTheRight>
              <Button text={'save'} title={'save'} variant='primary' onClick={() => saveEdit()} />
            </ToolBarItem>
            <ToolBarItem>
              <Button
                text={'cancel'}
                title={'cancel'}
                variant='secondary'
                onClick={() => handleClickEditDescriptions()}
              />
            </ToolBarItem>
          </>
        )}
      </ToolBar>
      <Fragment>
        {gssPriorityReportLoading && <DataLoading />}
        {!gssPriorityReportLoading && gssPriorityReport.errors.length > 0 && (
          <DisplayApiErrors errors={gssPriorityReport.errors} />
        )}
        {!gssPriorityReportLoading && gssPriorityReport.data.length === 0 && gssPriorityReport.errors.length === 0 && (
          <DisplayNoData message={reportRequested ? getText('generic.emptyData') : getText('generic.selectFilters')} />
        )}
        {!gssPriorityReportLoading && gssPriorityReport.data.length > 0 && items?.length > 0 && (
          <PaginatedDataTable
            obsoleteData={!reportRequested}
            expandCollapePlacement={-1}
            subHeaders={columns}
            items={items}
            dataRowsCount={gssPriorityReport.data.length}
            titleWithoutBorder={[]}
            freezeColumns={0}
            stickyHeaders={true}
            onRequestTableData={onRequestTableData}
            columnNamesMapping={columnNamesMappingGssPriority(columns, filters)}
            filtersActive={!!filters?.keyword}
            search={filters?.keyword ?? ''}
          />
        )}
      </Fragment>
    </Fragment>
  );
});

GssPiority.displayName = 'GssPiority';

export { GssPiority };
