import React, { Fragment, memo, useContext, useEffect, useState, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Drawer,
  ToolBar,
  ToolBarItem,
  Toggle,
  Button,
  RecursiveDataTable,
  ButtonDownloadAs,
  Checkbox,
  LinkActions,
  Search,
  ButtonFilter,
} from 'mdo-react-components';
import { PortfolioSelector, DisplayNoData, DataLoading, DisplayApiErrors, PaginatedDataTable } from 'components';
import { useARMapping } from '../../graphql/useARMapping';
import { useAccountMapping } from '../../graphql/useAccountMapping';
import { GlobalFilterContext, HotelContext, AppContext, DictionaryContext } from '../../contexts';
import { TextCellRenderer } from '../ProfitAndLoss/TextCellRenderer';
import { HotelClientAccountDropdown } from './HotelClientAccountDropdown';
import { MappedTo } from './mappedTo';
import { ColumnFilters } from './ColumnFilters';
import { search, getText } from '../../utils/localesHelpers';
import { useHotelClientAccount } from '../../graphql';
import { getComparator, stableSort, switchDirection, direction } from '../../utils/pageHelpers';
import { HotelClientAccountProvider } from '../../providers';
import { pageState } from './constants';
import { isDateValid } from 'utils/validators';
import { CheckboxFilters } from './checkboxFilters';
import { SalesManagerDropdown } from '../../components/SalesManagerDropdown';
import { ARManagementStatusDropdown } from '../../components/AR/ARManagementStatusDropdown';
import { exportToXLSX, buildDownloadableFilename } from '../../utils/downloadHelpers';
import { DownloadableReportNames } from 'config/downlodableReportNames';
import { AccountBulkMapping } from './AccountBulkMapping';

import { ARMappingPaginatedDataTable } from './components/ARMappingPaginatedDataTable';

let aId, cId, qId;
let baseData = [];
let checkedData = [];

const AccountMappingSales = memo(() => {
  const history = useHistory();
  const { appPages } = useContext(AppContext);
  const { portfolio, selectPortfolio } = useContext(GlobalFilterContext);
  const { getPortfolioHotelIds, hotels, getHotel, hotelsMap, hotelsGroups } = useContext(HotelContext);
  const { listDictionary, dictionaryLoading, dictionaryTypesNames, dictionaryTypes, errors } =
    useContext(DictionaryContext);
  const {
    hotelClientAccountMappingGet,
    hotelClientAccountMappings,
    ARMappingLoading,
    ARMappingAccount,
    hotelClientAccountMapping,
    hotelClientAccountMappingsSet,
    sethotelClientAccountMappings,
  } = useARMapping();
  const [mappingData, setMappingData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [filters, setFilters] = useState({
    keyword: '',
  });
  const [isAllChecked, setIsAllChecked] = useState(false);

  const [dFilters, setDFilter] = useState({
    ms: 0,
  });
  const [page, setPage] = useState(1);

  const [showBM, setShowBM] = useState(true);

  const [sortData, setSortData] = useState({
    orderBy: '',
    order: '',
    items: [],
  });
  const [reportRequested, setReportRequested] = useState(false);
  const { updateAccount } = useAccountMapping();

  const isMatchWithExtraSpaces = (source) => search(String(source.replace(/ +(?= )/g, '')), filters.keyword) !== -1;
  const { hotelClientAccountList, MappedTo: mappedList } = useHotelClientAccount();
  const items = useMemo(() => {
    let { data } = hotelClientAccountMappings;
    if (mappingData) {
      data = mappingData.map((q) => ({
        ...q,
        isChecked: q.isChecked,
        managed:
          dictionaryTypes['hotel-client-account-management-status']?.find((item) => item.value == q.managementStatusId)
            ?.displayName || '',
        mtValue: mappedList?.data?.find((w) => w.id === q.hotelClientAccountId)?.accountName || '',
        smName: q?.hotelSalesManager?.displayName || '',
        hotelName: hotels.find((h) => h.id === q.hotelId)?.hotelName || 'abc',
      }));
    }

    const { keyword } = filters;
    const newItems = data.filter((item) => {
      if (keyword.length > 0) {
        let found = false;

        if (isMatchWithExtraSpaces(item.sourceAccountName)) {
          found = true;
        }

        if (item.hotelName && search(String(item.hotelName), keyword) !== -1) {
          found = true;
        }

        if (item.smName && search(String(item.smName), keyword) !== -1) {
          found = true;
        }

        if (item.managed && search(String(item.managed), keyword) !== -1) {
          found = true;
        }

        if (item.mtValue && search(String(item.mtValue), keyword) !== -1) {
          found = true;
        }

        if (!found) {
          return false;
        }
      }

      return true;
    });
    baseData = newItems;
    setSortData({ ...sortData, items: newItems.map((item) => ({ ...item, subLevelHeaders: true })) });

    // Set page number to 1 if search keyword is entered, to avoid another page is being opened even after search result is fetched
    if (filters.keyword !== '') setPage(1);
    return newItems;
  }, [filters, hotelClientAccountMappings, mappingData, dictionaryTypes]);

  useEffect(() => {
    if (baseData) {
      checkedData = baseData.filter((a) => a.isChecked === true).map((q) => q.id);
      setShowBM(!baseData.some((a) => a.isChecked === true));
    }
  }, [items]);

  const handleApplyFitlers = (newFilters) => {
    setFilters(newFilters);
  };

  const handleAccount = (e, type = null) => {
    aId = e?.dataRow?.id;
    cId = e?.value;

    sethotelClientAccountMappings({
      params: {
        id: e?.dataRow?.id,
        hotelClientAccountId: e?.value === 'null' || type === 'remove' ? null : e?.value,
      },
    });
  };

  const handleSalesManagerOnChange = (dataRow, value) => {
    if (dataRow) {
      sethotelClientAccountMappings({
        params: {
          id: dataRow.id,
          hotelSalesManagerId: value,
        },
      });
    }
  };

  const handleManagedStatusOnChange = (dataRow, value) => {
    if (dataRow) {
      sethotelClientAccountMappings({
        params: {
          id: dataRow.id,
          managementStatusId: Number(value),
        },
      });
    }
  };

  const handleChangePortfolio = (name, value) => {
    selectPortfolio(value);
    if (reportRequested) {
      setReportRequested(false);
    }
  };

  const handleReport = () => {
    hotelClientAccountMappingGet({
      params: {
        hotelId: getPortfolioHotelIds(portfolio),
        sourceAccountName: '',
        hotelClientAccountId: null,
      },
      pagination: {
        page: 1,
        pageSize: 1000,
      },
    });
    if (!reportRequested) {
      setReportRequested(true);
    }
  };

  useEffect(() => {
    hotelClientAccountList({
      params: {
        keyword: '',
        accountName: '',
        managementStatusId: null,
      },
      pagination: {
        page: 1,
        pageSize: 1000,
      },
    });
  }, [hotelClientAccountList]);

  useEffect(() => {
    if (hotelClientAccountMapping === 'done') {
      setMappingData(
        mappingData.map((q) => ({
          ...q,
          ...(q.id === aId && { hotelClientAccountId: cId }),
        })),
      );
    }
  }, [hotelClientAccountMapping]);

  useEffect(() => {
    if (mappingData) {
      setIsAllChecked(baseData.every((q) => q.isChecked === true));
    }
  }, [items]);

  const onRequestSort = (column, dir) => {
    const { order, orderBy, items } = sortData;
    let newDirection = dir;
    let columnToSortBy = column;
    if (column === orderBy && dir === order) {
      newDirection = switchDirection(dir);
    }
    if (column !== orderBy) {
      newDirection = direction.DESC; // start descending as default for new columns
    }

    let newListData = [];

    if (column === 'smName') {
      newListData = [...items];
      if (newDirection === direction.DESC) {
        newListData.sort((a, b) => (a?.smName > b?.smName ? -1 : b?.smName > a?.smName ? 1 : 0));
      } else {
        newListData.sort((a, b) => (a?.smName > b?.smName ? 1 : b?.smName > a?.smName ? -1 : 0));
      }
    } else {
      newListData = stableSort(items, getComparator(newDirection, columnToSortBy));
    }

    setSortData({
      order: newDirection,
      orderBy: column,
      items: newListData,
    });
  };

  useEffect(() => {
    setHeaders([
      {
        headerName: <Checkbox name='all' onChange={handleCheckbox} />,
        field: '',
        width: '50px',
        minWidth: '50px',
        // eslint-disable-next-line
        onRender: (e) => {
          return (
            <Checkbox
              checked={!!e?.dataRow?.isChecked}
              name={e?.dataRow?.id}
              id={e?.dataRow?.id}
              onChange={handleCheckbox}
            />
          );
        },
        color: '#3b6cb4',
      },
      {
        headerName: getText('generic.sourceAccount'),
        field: 'sourceAccountName',
        width: '150px',
        minWidth: '150px',
        onRender: TextCellRenderer,
        color: '#3b6cb4',
        sortable: true,
      },
      {
        headerName: getText('generic.property'),
        field: 'hotelName',
        width: '120px',
        // minWidth: '120px',
        headerAlign: 'left',
        align: 'left',
        onRender: TextCellRenderer,
        // colors.white or colors.blue does not work here as theme is unavailable
        color: '#3b6cb4',
        sortable: true,
      },
      {
        headerName: getText('generic.mappedTo'),
        field: 'mtValue',
        width: '120px',
        // minWidth: '120px',
        headerAlign: 'left',
        align: 'left',
        onRender: (e) => HotelClientAccountDropdown({ ...e, onAccountId: handleAccount }),
        color: '#3b6cb4',
        sortable: true,
        disableFlex: true,
      },
      {
        headerName: getText('generic.hotelSalesManagerId'),
        field: 'smName',
        width: '120px',
        headerAlign: 'left',
        align: 'left',
        onRender: (data) => (
          <SalesManagerDropdown
            name='smName'
            onChange={(_, value) => handleSalesManagerOnChange(data.dataRow, value)}
            showMapSales={true}
            {...data}
            value={data.dataRow.hotelSalesManagerId ? data.dataRow.hotelSalesManagerId : 'Map Sales Manager'}
          />
        ),
        color: '#3b6cb4',
        sortable: true,
      },
      {
        headerName: getText('generic.managed'),
        field: 'managed',
        width: '140px',
        headerAlign: 'left',
        align: 'left',
        onRender: (data) => (
          <ARManagementStatusDropdown
            name='managed'
            onChange={(_, value) => handleManagedStatusOnChange(data.dataRow, value)}
            {...data}
            value={data.dataRow.managementStatusId ? data.dataRow.managementStatusId : 'Map Management Status'}
          />
        ),
        color: '#3b6cb4',
        sortable: true,
      },
      {
        headerName: getText('generic.actions'),
        field: 'hotelClientAccountId',
        width: '120px',
        // minWidth: '120px',
        headerAlign: 'center',
        align: 'center',
        onRender: (args) => {
          // eslint-disable-next-line
          const { dataRow } = args;
          return (
            <LinkActions
              items={[
                {
                  clickId: 'remove',
                  text: getText('arAging.remove'),
                  variant: 'tertiary',
                },
              ]}
              onClick={() => {
                if (!!dataRow?.hotelClientAccountId) {
                  handleAccount({ dataRow, value: null }, 'remove');
                }
              }}
              disabled={!!!dataRow?.hotelClientAccountId}
            />
          );
        },
        color: '#3b6cb4',
      },
    ]);
  }, [mappingData]);

  useEffect(() => {
    if (hotelClientAccountMappings) {
      if (hotelClientAccountMappings.errors.length > 0) {
        return;
      }

      const rawReport = hotelClientAccountMappings.data;

      if (!rawReport?.length) {
        setMappingData([]);
        return;
      }

      setMappingData(hotelClientAccountMappings.data);
    }
  }, [hotelClientAccountMappings]);

  const [filterOpen, setFilterOpen] = useState(false);
  const [checkboxFilterOpen, setChcekboxFilterOpen] = useState(false);
  const [openBulkActionModal, setOpenBulkActionModal] = useState(false);

  const handleCheckbox = (name, value) => {
    if (name === 'all') {
      setIsAllChecked(value);
      setMappingData(baseData.map((item) => ({ ...item, isChecked: value })));
    } else {
      setMappingData(baseData.map((item) => (item.id === name ? { ...item, isChecked: value } : item)));
    }
  };

  const handleDFilters = (e) => {
    setDFilter(e);
    if (e.ms === 0) {
      setMappingData(hotelClientAccountMappings.data);
    } else if (e.ms === 1) {
      setMappingData(hotelClientAccountMappings.data.filter((a) => !!a.hotelClientAccountId));
    } else {
      setMappingData(hotelClientAccountMappings.data.filter((a) => a.hotelClientAccountId === null));
    }
    setFilterOpen(false);
  };

  const handleBulkMapping = (name) => {
    qId = name;
    sethotelClientAccountMappings({
      params: {
        id: checkedData,
        hotelClientAccountId: name,
      },
    });
  };

  const handleCheckboxFilters = (name) => {
    qId = name;
    sethotelClientAccountMappings({
      params: {
        id: checkedData,
        hotelClientAccountId: name,
      },
    });
  };

  useEffect(() => {
    if (hotelClientAccountMappingsSet === 'done') {
      handleReport();
      setMappingData(
        mappingData.map((w) => {
          if (checkedData.includes(w.id)) {
            return {
              ...w,
              hotelClientAccountId: qId,
            };
          } else {
            return w;
          }
        }),
      );
      qId = '';
      setOpenBulkActionModal(false);
      checkedData = [];
    }
  }, [hotelClientAccountMappingsSet]);

  const handleDownloadAs = ({ value }) => {
    if (baseData && Array.isArray(sortData?.items) && sortData?.items?.length) {
      const dataSet = sortData.items.map((item, index) => {
        const { sourceAccountName, hotelName, mtValue, smName, managed } = item;
        return {
          [getText('generic.sourceAccount')]: sourceAccountName,
          [getText('generic.property')]: hotelName,
          [getText('generic.mappedTo')]: mtValue,
          [getText('generic.hotelSalesManagerId')]: smName,
          [getText('generic.managed')]: managed,
        };
      });

      exportToXLSX(
        dataSet,
        buildDownloadableFilename({
          hotelGroupName:
            portfolio.hotelGroupId == -1 || portfolio.hotelGroupId == 0
              ? getText('generic.all')
              : hotelsGroups.find((element) => element.id == portfolio.hotelGroupId).groupName,
          hotelName:
            portfolio.hotelId == -1 || portfolio.hotelId == 0
              ? getText('generic.all')
              : hotelsMap[portfolio.hotelId]?.hotelName,
          reportName: DownloadableReportNames.aSalesMapping,
        }),
        value == 'excel' ? 'xlsx' : value,
        '',
        {
          isHeader: false,
          style: true,
          noTotalStyle: true,
          overrideLeftAlignBodyData: true,
        },
      );
    }
  };

  return (
    <HotelClientAccountProvider>
      <Fragment>
        <Drawer open={filterOpen} onClose={() => setFilterOpen(false)} anchor='right'>
          <ColumnFilters
            filters={dFilters}
            onApply={(e) => {
              handleDFilters(e);
              setPage(1);
            }}
            onCancel={() => setFilterOpen(false)}
          />
        </Drawer>
        {}
        {openBulkActionModal && (
          <AccountBulkMapping
            data={mappedList.data}
            onClose={() => setOpenBulkActionModal(false)}
            onApply={handleBulkMapping}
          />
        )}
        <ToolBar>
          <ToolBarItem>
            <PortfolioSelector
              name={'portfolio'}
              value={portfolio}
              onChange={handleChangePortfolio}
              disableClearable
              allowAllGroups
              allowAllHotels
            />
          </ToolBarItem>
          <ToolBarItem width='250px'>
            <Search
              label='Search'
              value={''}
              name='keyword'
              onChange={(name, value, event) => {
                handleApplyFitlers({
                  ...filters,
                  keyword: value,
                });
              }}
              dataEl='searchInput'
            />
          </ToolBarItem>
          <ToolBarItem>
            <Button
              iconName={reportRequested ? 'Refresh' : ''}
              text={reportRequested ? '' : getText('generic.go')}
              title={getText(`generic.${reportRequested ? 'refresh' : 'go'}`)}
              variant='secondary'
              onClick={() => {
                handleReport();
                setPage(1);
              }}
              dataEl='buttonGo'
              disabled={ARMappingLoading}
            />
          </ToolBarItem>
          <ToolBarItem>
            <ButtonFilter
              variant='tertiary'
              //     filtersSelected={calcSelectedFilters()}
              text={`${getText('generic.filters')}`}
              onClick={() => {
                setFilterOpen(true);
              }}
              disabled={ARMappingLoading}
              dataEl='buttonOpenFilters'
              resetDataEl='buttonResetFilters'
            />
          </ToolBarItem>
          <ToolBarItem toTheRight>
            <Toggle
              value={1}
              onChange={(item) => {
                if (item === 0) {
                  history.push(appPages.keys['account-mapping'].url);
                }
              }}
              dataEl='toggleAccountMapping'
            >
              <div data-el='buttonMapping'>{getText('account.mapping')}</div>
              <div data-el='buttonMapping'>{getText('account.salesMapping')}</div>
            </Toggle>
          </ToolBarItem>
        </ToolBar>
        <ToolBar>
          <ToolBarItem>
            <Button
              text={getText('generic.blukActionMap')}
              variant='tertiary'
              onClick={() => {
                setOpenBulkActionModal(true);
              }}
              disabled={showBM}
              dataEl='buttonMapTo'
            />
          </ToolBarItem>
          <ToolBarItem toTheRight>
            <ButtonDownloadAs
              iconName='CloudDownloadSharp'
              text=''
              variant='tertiary'
              title={getText('generic.download')}
              onClick={handleDownloadAs}
              exclude={['pdf']}
              disabled={ARMappingLoading}
              dataEl={'buttonDownloadAs'}
            />
          </ToolBarItem>
        </ToolBar>
        <Fragment>
          {ARMappingLoading && <DataLoading />}
          {!ARMappingLoading &&
            hotelClientAccountMappings &&
            hotelClientAccountMappings.errors &&
            hotelClientAccountMappings.errors.length !== 0 && (
              <DisplayApiErrors errors={hotelClientAccountMappings.errors} />
            )}
          {!ARMappingLoading &&
            hotelClientAccountMappings &&
            hotelClientAccountMappings.data &&
            hotelClientAccountMappings.data.length === 0 &&
            hotelClientAccountMappings.errors &&
            hotelClientAccountMappings.errors.length === 0 && (
              <DisplayNoData
                message={reportRequested ? getText('generic.emptyData') : getText('generic.selectFilters')}
              />
            )}
          {!ARMappingLoading &&
            hotelClientAccountMappings &&
            hotelClientAccountMappings.data &&
            hotelClientAccountMappings.data.length > 0 &&
            hotelClientAccountMappings.errors &&
            hotelClientAccountMappings.errors.length === 0 &&
            sortData?.items?.length > 0 && (
              <ARMappingPaginatedDataTable
                obsoleteData={!reportRequested}
                // this is temp solution, pagination should not be cotrolled here!!!
                setPageValue={page}
                onChangePage={(a) => {
                  setPage(a);
                }}
                hasStripes={false}
                expandCollapePlacement={-1}
                subHeaders={headers}
                items={sortData?.items}
                orderBy={sortData?.orderBy}
                order={sortData?.order}
                onRequestSort={onRequestSort}
                stickyHeaders={true}
                customPageSize={25}
                filtersActive={!!filters?.keyword || !!dFilters?.ms}
                search={filters?.keyword ?? ''}
                filters={dFilters?.ms}
              />
            )}
        </Fragment>
      </Fragment>
    </HotelClientAccountProvider>
  );
});

AccountMappingSales.displayName = 'AccountMappingSales';

export { AccountMappingSales };
