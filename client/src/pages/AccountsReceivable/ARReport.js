import dayjs from 'dayjs';
import {
  Button,
  ButtonDownloadAs,
  ChartCard,
  colors,
  InputDate,
  RecursiveDataTable,
  Switch,
  ToolBar,
  ToolBarItem,
  ColumnChart,
  PieChart,
} from 'mdo-react-components';
import PropTypes from 'prop-types';
import React, { Fragment, memo, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { CSVLink } from 'react-csv';
import { useHistory } from 'react-router-dom';
import {
  AccountSelector,
  DataContainer,
  DataLoading,
  DisplayNoData,
  DownloadAsExcel,
  GroupSelector,
  HotelSelector,
  IfPermitted,
} from '../../components';
import { localColors } from '../../config/colors';
import { AppContext, GlobalFilterContext, HotelContext, AccountContext } from '../../contexts';
import { useARReport } from '../../graphql/useARReport';
import { footer, maxAndMediumValues, newPositionOfElement, valueOfFields } from '../../utils/dataManipulation';
import { strReplace } from '../../utils/formatHelpers';
import { getText } from '../../utils/localesHelpers';
import { getComparator, stableSort } from '../../utils/pageHelpers';
import { isDateValid } from '../../utils/validators';
import { ARComments } from './ARComments';
import { columnsConfig, values } from './columnsConfig';
import { ARAccountHook } from './Hooks/ARAccountHook';
import { Container, StyledBox, StyledError, StyledInputDate, StyledItem, StyledSquare } from './styled';
import { buildDownloadableFilename, exportToXLSX } from '../../utils/downloadHelpers';
import { colorsOfColumnChart } from './boundries';
import { DownloadableReportNames } from 'config/downlodableReportNames';
import { padStart, round } from 'lodash';
import numeral from 'numeral';

const ARReport = memo((props) => {
  const {
    data,
    reportType: typeOfReport,
    filters,
    setFilters,
    loading,
    requestReport,
    reportRequested,
    setReportRequested,
    param,
  } = props;
  const { hotelsGroups, hotelsGroupsMap, hotels, hotelsMap, loadingList, getPortfolioHotelIds } =
    useContext(HotelContext);
  const { getAccountId, MappedTo } = ARAccountHook();
  const { portfolio, selectPortfolio } = useContext(GlobalFilterContext);
  const [reportType, setReportType] = useState(typeOfReport);
  const history = useHistory();
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [hotelId, selectHotelId] = useState(portfolio.hotelId);
  const [dataHotelId, setDataHotelId] = useState({
    hotelId: 0,
    hotelName: '',
  });
  const [state, setState] = useState([]);
  const [hasCellColor, setHasCellColor] = useState(false);
  const [isChartOpen, setIsChartOpen] = useState(false);
  const [openLink, setLink] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const { hotelARAgingCommentsList, listARAgingComments } = useARReport();
  const { appPages } = useContext(AppContext);
  const [order, setOrder] = useState('');
  const [orderBy, setOrderBy] = useState('');
  const [chart, setChart] = useState([]);
  const [goClick, setGoClick] = useState(false);

  useEffect(() => {
    if (data && data?.data?.length > 0) {
      const arr = [...data?.data];
      const result = footer(arr, reportType).map((q) =>
        q?.hotel && q?.hotel?.hotelName
          ? q
          : {
              ...q,
              hotel: {
                hotelName: q?.hotelClientAccount?.accountName || '',
              },
            },
      );

      result.sort((a, b) =>
        (a?.hotel?.hotelName || a?.sourceAccountName) > (b?.hotel?.hotelName || b?.sourceAccountName)
          ? 1
          : (b?.hotel?.hotelName || b?.sourceAccountName) > (a?.hotel?.hotelName || a?.sourceAccountName)
          ? -1
          : 0,
      );
      setState([...result]);
      setChart([...result]);
    }
  }, [data]);

  const handleFilterChange = useCallback(
    (name, value) => {
      const newFilters = {
        ...filters,
        [name]: value,
      };
      setFilters(newFilters);

      setReportRequested(true);
    },

    [filters],
  );

  const paramArr = param && param.id.split(':');
  const accountNameURI = decodeURIComponent(param && paramArr[0]);

  useEffect(() => {
    if (openLink) {
      if (Object.keys(dataHotelId).includes('hotelId')) {
        setReportType('Property');
        history.push(strReplace(appPages.keys['ar-property'].url, { id: `${dataHotelId.hotelId}:${filters.date}` }));
      } else {
        setReportType('Account');
        history.push(
          strReplace(appPages.keys['ar-account'].url, {
            id: `${encodeURIComponent(dataHotelId.accountName)}:${filters.date}`,
            hotelClientAccountId: dataHotelId.hotelClientAccountId,
          }),
        );
      }
    }
  }, [openLink, dataHotelId, reportType, appPages]);

  useEffect(() => {
    if (param && accountNameURI) {
      if (reportType === ARReport.reportTypes.PROPERTY && Number(accountNameURI) !== hotelId) {
        selectHotelId(Number(isNaN(accountNameURI) ? 0 : accountNameURI));
        setFilters({
          ...filters,
          date: new Date(paramArr[1]),
          hotelClientAccountId: param && param?.hotelClientAccountId,
        });
        requestReport({
          ...filters,
          date: new Date(paramArr[1]),
          hotelIds: Number(isNaN(accountNameURI) ? 0 : accountNameURI),
        });
        setReportRequested(false);
      } else if (reportType === ARReport.reportTypes.ACCOUNT && accountNameURI !== hotelId) {
        selectHotelId(accountNameURI);
        setFilters({
          ...filters,
          date: new Date(paramArr[1]),
          hotelClientAccountId: param && param?.hotelClientAccountId,
        });
        requestReport({
          ...filters,
          date: new Date(paramArr[1]),
          hotelClientAccountId: param && param?.hotelClientAccountId,
        });
        setReportRequested(false);
      }
    }
  }, []);

  useEffect(() => {
    listARAgingComments({
      params: {
        hotelId:
          reportType === ARReport.reportTypes.DASHBOARD || reportType === ARReport.reportTypes.ACCOUNT
            ? dataHotelId.hotelId
            : hotelId,
      },
      pagination: {
        page: 1,
        pageSize: 1000,
      },
    });
  }, [listARAgingComments, dataHotelId, reportType]);

  const downloadFileName = () => {
    if (reportType === ARReport.reportTypes.PROPERTY) {
      return buildDownloadableFilename({
        hotelName: hotelsMap[filters.hotelIds]?.hotelName,
        date: filters.date,
        reportName: DownloadableReportNames.ar,
      });
    } else if (reportType === ARReport.reportTypes.DASHBOARD) {
      let hotelGroupName =
        hotelsGroupsMap && hotelsGroupsMap[portfolio?.hotelGroupId]
          ? hotelsGroupsMap[portfolio?.hotelGroupId]?.groupName
          : 'unknown-hotel-group-name';
      if (portfolio?.hotelGroupId == 0) {
        hotelGroupName = getText('selectors.portfolio.allGroups');
      }
      return buildDownloadableFilename({
        hotelGroupName: hotelsGroupsMap[portfolio?.hotelGroupId]?.groupName,
        date: filters.date,
        reportName: DownloadableReportNames.arDashboard,
      });
    } else {
      let accountName =
        MappedTo.data.find((account) => account.id === filters.hotelClientAccountId)?.accountName ||
        'unknown-account-name';
      if (!filters.hotelClientAccountId) {
        accountName = getText('account.allGroups');
      }

      return buildDownloadableFilename({
        accountName: MappedTo.data.find((account) => account.id === filters.hotelClientAccountId)?.accountName,
        date: filters.date,
        reportName: DownloadableReportNames.ar,
      });
    }
  };
  const chartValues = useMemo(() => {
    return valueOfFields(chart, colorsOfColumnChart);
  }, [chart, colorsOfColumnChart]);

  const requestSort = (a, b) => {
    if (orderBy === a) {
      setOrder(order === 'desc' ? 'asc' : 'desc');
    } else {
      setOrder(b);
    }
    setOrderBy(a);
    setState(
      stableSort(
        state.map((a) => ({
          ...a,
          property: a?.hotel?.hotelName || 0,
          due030: a?.due030 || 0,
          due3160: a?.due3160 || 0,
          due6190: a?.due6190 || 0,
          due91120: a?.due91120 || 0,
          dueOver120: a?.dueOver120 || 0,
          total: a?.total || 0,
        })),
        getComparator(
          b,
          a === 'property'
            ? 'property'
            : a === 'due030'
            ? 'due030'
            : a === 'due3160'
            ? 'due3160'
            : a === 'due6190'
            ? 'due6190'
            : a === 'due91120'
            ? 'due91120'
            : a === 'dueOver120'
            ? 'dueOver120'
            : a === 'total'
            ? 'total'
            : a,
        ),
      ),
    );
  };

  const sortData = (state) => {
    const condition = state[state.length - 1]?.hotel?.hotelName
      ? state[state.length - 1]?.hotel?.hotelName
      : state[state.length - 1]?.hotelClientAccount?.accountName;

    if (state.length > 0 && condition !== getText('arAging.totals')) {
      const arr = newPositionOfElement(state, getText('arAging.totals'));
      setState([...arr]);
      return arr;
    }
    return state;
  };

  const addExcelandCsv = chart.map((item, index) => {
    const { due030, due3160, due6190, due91120, dueOver120, total } = item;
    let name;
    let mappedTo;
    if (reportType === ARReport.reportTypes.PROPERTY) {
      const { hotelClientAccount, sourceAccountName } = item;
      name = sourceAccountName || hotelClientAccount?.accountName;

      mappedTo = chart.length - 1 !== index ? hotelClientAccount?.accountName : null;
    } else {
      const { hotel } = item;
      name = hotel.hotelName;
    }

    return {
      [reportType === ARReport.reportTypes.PROPERTY ? getText('arAging.accountName') : getText('arAging.property')]:
        name,
      ...(reportType === ARReport.reportTypes.PROPERTY && { [getText('arAging.mappedTo')]: mappedTo }),
      [getText('arAging.thirtyDays')]: numeral(Math.abs(due030) < 1e-6 ? 0 : due030).format(
        `($0,0.${padStart('', 2, '0')})`,
      ),
      [getText('arAging.sixtyDays')]: numeral(Math.abs(due3160) < 1e-6 ? 0 : due3160).format(
        `($0,0.${padStart('', 2, '0')})`,
      ),
      [getText('arAging.ninetyDays')]: numeral(Math.abs(due6190) < 1e-6 ? 0 : due6190).format(
        `($0,0.${padStart('', 2, '0')})`,
      ),
      [getText('arAging.hundredDays')]: numeral(Math.abs(due91120) < 1e-6 ? 0 : due91120).format(
        `($0,0.${padStart('', 2, '0')})`,
      ),
      [getText('arAging.hundredPlusDays')]: numeral(Math.abs(dueOver120) < 1e-6 ? 0 : dueOver120).format(
        `($0,0.${padStart('', 2, '0')})`,
      ),
      [getText('arAging.totalAR')]: numeral(Math.abs(total) < 1e-6 ? 0 : total).format(
        `($0,0.${padStart('', 2, '0')})`,
      ),
    };
  });

  const maxAndMediumArrays = maxAndMediumValues(state, values);

  const onDownload = ({ value }) => {
    const vq = addExcelandCsv.findIndex(
      (q) =>
        q[
          reportType === ARReport.reportTypes.PROPERTY ? getText('arAging.accountName') : getText('arAging.property')
        ] === 'Totals',
    );
    const qw = addExcelandCsv[vq];
    addExcelandCsv.splice(vq, 1);
    addExcelandCsv.push(qw);

    exportToXLSX(addExcelandCsv, downloadFileName(), value == 'excel' ? 'xlsx' : value, '', {
      isHeader: false,
      style: true,
      ...(hasCellColor && {
        maxValues: maxAndMediumArrays?.maxValues.map((item) => {
          const value = round(item, 2);
          if (value < 0) return `($${new Intl.NumberFormat().format(value)})`;
          else return `$${new Intl.NumberFormat().format(value)}`;
        }),
        mediumValues: maxAndMediumArrays?.mediumValues.map((item) => {
          const value = round(item, 2);
          if (value < 0) return `($${new Intl.NumberFormat().format(value)})`;
          else return `$${new Intl.NumberFormat().format(value)}`;
        }),
      }),
      // subHeader: ['', '', 'Actual', 'Budget', 'Variance'],
      // span: [
      //   [1, 1],
      //   [2, 2],
      //   [3, 4],
      //   [5, 6],
      //   [7, 8],
      // ],
    });
  };

  const argsColumnConfigs = useMemo(
    () => ({
      colors: colorsOfColumnChart,
      tooltipText: '{categoryX}: [bold]{valueY}[/]',
      showLegend: false,
      showTitle: false,
      showBulletAsTotalPercentage: true,
      bulletTooltipAsTotalPercentage: "[bold]{valueY.percent.formatNumber('#.00')}%",
      valueTypeId: 2,
      applyXAxisFormat: {
        valueFormat: '0,000',
        displaySize: 'auto',
        valueTypeId: 2,
      },
    }),
    [],
  );

  const argsPieConfigs = useMemo(
    () => ({
      colors: colorsOfColumnChart,
      width: '100%',
      height: '100%',
      innerRadius: 50,
      legendPosition: 'right',
      removeLegendValue: false,
      removePieLables: true,
      /**
       * This is template format in https://www.amcharts.com/docs/v4/concepts/formatters/formatting-strings/
       * */
      seriesLabelsTemplateText: "{value.percent.formatNumber('#.00')}%",
      tooltipText: "{category}: {value.percent.formatNumber('#.00')}% ({value.value.formatNumber('#.00')})",
      legendText: "{value.percent.formatNumber('#.00')}%",
      applyTooltipFormat: {
        valueFormat: '0,000.00',
        displaySize: 'as-is',
        valueTypeId: 2,
        addNumberFormatting: 'bold',
      },
    }),
    [],
  );

  return (
    <Fragment>
      <ToolBar>
        <ToolBarItem>
          {reportType === ARReport.reportTypes.PROPERTY ? (
            <HotelSelector
              name={'hotelIds'}
              label={'Property'}
              disableClearable
              value={hotelId}
              onChange={(name, value) => {
                selectHotelId(value);
                selectPortfolio(value);
                setFilters({
                  ...filters,
                  [name]:
                    value === -1
                      ? [...hotels.map((hotel) => hotel.id)]
                      : value === 0
                      ? getPortfolioHotelIds(portfolio)
                      : value,
                });
                setReportRequested(true);
              }}
            />
          ) : reportType === ARReport.reportTypes.DASHBOARD ? (
            <GroupSelector
              name={'portfolio'}
              label={getText('generic.group')}
              value={portfolio?.hotelGroupId === 0 ? { hotelGroupId: 0 || 0, hotelId: 0 } : portfolio}
              onChange={(name, value) => {
                const groupHotels = value.hotelGroupId ? hotelsGroupsMap[value?.hotelGroupId]?.hotels || [] : hotels;
                selectPortfolio(value);
                setFilters({
                  ...filters,
                  hotelIds:
                    value?.hotelGroupId === 0 ? hotels.map((hotel) => hotel.id) : groupHotels.map((hotel) => hotel.id),
                });
                setReportRequested(true);
              }}
              disableClearable
              allowAllGroups
              allowAllHotels
            />
          ) : (
            <AccountSelector
              name={'hotelClientAccountId'}
              label={MappedTo?.data?.length !== 0 ? getText('arAging.account') : getText('arAging.noAccount')}
              value={hotelId === 0 ? getAccountId : hotelId}
              disableClearable
              onChange={(name, value) => {
                setFilters({
                  ...filters,
                  [name]: value === -1 ? null : value,
                });
                setReportRequested(true);
                selectHotelId(value);
              }}
              allowAddAll
              disabled={MappedTo?.data?.length === 0}
            />
          )}
        </ToolBarItem>
        <ToolBarItem>
          <StyledInputDate>
            <InputDate
              name='date'
              label='Date'
              value={filters.date}
              onChange={handleFilterChange}
              errorMsg={getText('generic.dateErrorText')}
              dataEl='inputDate'
            />
          </StyledInputDate>
        </ToolBarItem>
        <ToolBarItem>
          <Button
            text='Go'
            variant='secondary'
            onClick={() => {
              setLoadingData(false);
              setState([]);
              requestReport();
              setGoClick(true);
            }}
            disabled={
              !isDateValid(filters.date) ||
              (reportType === ARReport.reportTypes.ACCOUNT && MappedTo?.data?.length === 0)
            }
            dateEl='buttonGo'
          />
        </ToolBarItem>
      </ToolBar>
      <ToolBar>
        <ToolBarItem toTheRight>
          <IfPermitted page='ar-dashboard' permissionType='toggle-status'>
            <StyledItem color='#697177'>Show Charts</StyledItem>
            <Switch dataEl={'switchShowCharts'} onChange={(name, value) => setIsChartOpen(value)} />
          </IfPermitted>
        </ToolBarItem>
        <ToolBarItem>
          <IfPermitted page='ar-dashboard' permissionType='toggle-status'>
            <StyledItem color='#697177'>Show At Risk</StyledItem>
            <Switch dataEl={'switchShowAtRisk'} onChange={(name, value) => setHasCellColor(value)} />
          </IfPermitted>
        </ToolBarItem>

        <ToolBarItem>
          <IfPermitted page='ar-dashboard' permissionType='download'>
            <ButtonDownloadAs
              iconName='CloudDownloadSharp'
              variant='tertiary'
              text=''
              title={getText('generic.download')}
              exclude={['pdf']}
              onClick={onDownload}
              disabled={loading}
              dataEl={'buttonDownloadAs'}
            />
          </IfPermitted>
        </ToolBarItem>
      </ToolBar>
      <IfPermitted page='ar-dashboard' permissionType='comment'>
        <ARComments
          commentData={hotelARAgingCommentsList}
          open={commentsOpen}
          hotel={dataHotelId}
          reportType={reportType}
          setCommentsOpen={setCommentsOpen}
          onClose={() => setCommentsOpen(false)}
        />
      </IfPermitted>
      {loading && <DataLoading />}
      {!loading && data.errors.length === 0 && state.length !== 0 && (
        <Fragment>
          {isChartOpen && (
            <Container>
              <ChartCard title={`AR ${reportType}`}>
                <ColumnChart id={'chartdiv1'} data={chartValues} config={argsColumnConfigs} />
              </ChartCard>
              <ChartCard title='AR Distribution By Time'>
                <PieChart id={'chartdiv0'} data={chartValues} config={argsPieConfigs} />
              </ChartCard>
            </Container>
          )}
          <DataContainer obsoleteData={reportRequested}>
            <RecursiveDataTable
              hasStripes={false}
              expandCollapePlacement={-1}
              subHeaders={columnsConfig({
                setCommentsOpen,
                setLink,
                setDataHotelId,
                reportType,
                hotelId,
              })}
              maxValues={hasCellColor ? maxAndMediumArrays?.maxValues : []}
              mediumValues={hasCellColor ? maxAndMediumArrays?.mediumValues : []}
              data={[{ children: sortData(state) }]}
              hasCellColor={hasCellColor}
              footer
              order={order}
              orderBy={orderBy}
              onRequestSort={requestSort}
              freezeColumns={0}
              stickyHeaders={true}
            />
          </DataContainer>
        </Fragment>
      )}
      {!loading && state.length == 0 && (
        <DisplayNoData
          message={goClick ? getText('generic.noReportDataForTheDate') : getText('generic.selectFilters')}
        />
      )}
      {state.length === 0 && data.errors.length !== 0 && <StyledError>{data.errors[0].messages[0]}</StyledError>}
      {hasCellColor && (
        <StyledBox>
          <StyledSquare color={localColors.LIGHT_YELLOW} />
          <StyledItem color={colors.black}>50-74% outstanding</StyledItem>
          <StyledSquare color={localColors.LIGHT_RED} />
          <StyledItem column>75% outstanding and up</StyledItem>
        </StyledBox>
      )}
    </Fragment>
  );
});

ARReport.displayName = 'ARReport';

ARReport.reportTypes = {
  DASHBOARD: 'Dashboard',
  PROPERTY: 'Property',
  ACCOUNT: 'Account',
};

ARReport.propTypes = {
  data: PropTypes.array,
  reportType: PropTypes.oneOf(Object.values(ARReport.reportTypes)),
  filters: PropTypes.object,
  setFilters: PropTypes.func,
  loading: PropTypes.bool,
  requestReport: PropTypes.func,
  param: PropTypes.any,
  reportRequested: PropTypes.bool,
  setReportRequested: PropTypes.func,
};

export { ARReport };
