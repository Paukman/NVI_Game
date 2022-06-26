import React, { useState, useContext, useEffect } from 'react';
import dayjs from 'dayjs';
import { isEqual } from 'lodash';

import { GlobalFilterContext, DrawerContext, HotelContext, UserSettingsContext } from 'contexts';
import { globals, usePageState, useTableData } from 'hooks';
import { pageState, DEFAULT_FILTERS, GL_PAGINATION, FILTER_TYPES } from '../constants';
import {
  prepareDataForGuestLedger,
  downloadExcelFile,
  prepareFilterParams,
  filterResultsWFiltersAndSearch,
  onErrorHandle,
  getPageState,
  filterOutResultsInList,
  prepareParamsForFiltering,
  getGroupHotels,
} from '../utils';
import logger from 'utils/logger';
import { GuestLedgerFilters } from '../components/GuestLedgerFilters';
import { useGuestLedger } from '../../../graphql/useGuestLedger';
import {
  stableSort,
  direction,
  switchDirection,
  getCustomComparator,
  lowerCaseComparator,
  numberComparator,
  formatQueryErrors,
  isValidDate,
  getText,
} from 'utils';

export const useGuestLedgerGet = () => {
  const { portfolio, assignGlobalValue } = useContext(GlobalFilterContext);
  const { showDrawer, hideDrawer } = useContext(DrawerContext);
  const { hotels, hotelsGroupsMap } = useContext(HotelContext);
  const { userSettingsState } = useContext(UserSettingsContext);

  const { updatePageState } = usePageState(pageState);
  const {
    guestLedgerListGetByHotelCode: guestLedgerList,
    guestLedgerListGetByHotelCodeState: guestLedgerListState,
    guestLedgerListGetFiltersByHotelCode: getGLFilters,
    guestLedgerListGetFiltersByHotelCodeState: glFilters,
  } = useGuestLedger();
  const { onRequestTableData, tableData: resultData } = useTableData();

  const myGlobals = [globals.hotelGroupId, globals.latestDate];

  const [guestLedgerState, updateState] = useState({
    hotelId: portfolio?.hotelId,
    hotelGroupId: portfolio?.hotelGroupId,
    listDataSorting: [], // keep a copy for sorting...
    data: null,
    errors: [], // errors for the elements
    queryErrors: [], // generic errors for the page (original errors from query)
    listData: [],
    subHeaders: [],
    pageState: { ...updatePageState(pageState.DEFAULT) },
    order: direction.DESC, // defaulT
    openFilters: false,
    filterErrors: null,
    latestDate: new Date(), // we wills tart always from today sinse landing doesn't care about the date
    requestReport: false,
    keyword: '',
  });

  const [filters, updateFilters] = useState(DEFAULT_FILTERS);
  const [filterSelections, updateFilterValues] = useState({});
  const [searchColumns, udpateSearchColumns] = useState([]);

  useEffect(() => {
    if (hotels?.length && userSettingsState) {
      const { mapSettingCode } = userSettingsState || {};
      const hotelGroupId = Number(mapSettingCode['app:defaultHotelGroup']) || portfolio?.hotelGroupId;

      updateState((state) => ({
        ...state,
        listData: [],
        listDataSorting: [],
        pageState: updatePageState(pageState.LOADING),
        hotelGroupId: hotelGroupId,
      }));

      const groupHotels = getGroupHotels(hotelGroupId, hotelsGroupsMap, hotels);
      const params = prepareFilterParams(groupHotels);

      guestLedgerList(params, GL_PAGINATION);

      const glFilterParams = {
        hotelCode: [...groupHotels],
        hotelCodeTypeId: 3,
        filterType: FILTER_TYPES,
      };
      getGLFilters(glFilterParams, GL_PAGINATION);
    }
  }, [hotels, userSettingsState]);

  // data is available
  useEffect(() => {
    if (
      (guestLedgerListState?.data || guestLedgerListState?.errors?.length) &&
      (glFilters?.data || glFilters?.errors?.length)
    ) {
      logger.debug('guestLedgerListState list: ', guestLedgerListState, glFilters);

      const { subHeaders, listData, filterSelections, searchColumns, businessDate } = prepareDataForGuestLedger(
        guestLedgerListState.data,
        glFilters.data,
      );

      updateFilterValues(filterSelections);
      udpateSearchColumns(searchColumns);

      updateState((state) => ({
        ...state,
        errors: formatQueryErrors(guestLedgerListState?.errors) || formatQueryErrors(glFilters?.errors),
        queryErrors: guestLedgerListState?.errors || glFilters?.errors,
        pageState: updatePageState(
          getPageState(guestLedgerListState?.data, guestLedgerListState?.errors || glFilters?.errors),
        ),
        subHeaders,
        // we might be filtering, so we need to check search as well
        listData: filterOutResultsInList(listData, guestLedgerState.keyword, searchColumns)?.listData || [],
        listDataSorting: listData, // keep a copy for sorting...
        latestDate: businessDate ?? guestLedgerState.latestDate,
      }));
    }
  }, [guestLedgerListState, glFilters]);

  const onChange = (name, value) => {
    if (myGlobals.includes(name)) {
      assignGlobalValue(name, value); // keep globals up to date
    }
    updateState((state) => ({
      ...state,
      [name]: value,
      requestReport: true,
    }));
  };

  const onRequestSort = (column, dir) => {
    // opaque report while sorting, this could take a bit sometimes....
    updateState((state) => ({
      ...state,
      pageState: updatePageState(pageState.SORTING),
    }));

    let newDirection = dir;
    if (column === guestLedgerState.orderBy && dir === guestLedgerState.order) {
      newDirection = switchDirection(dir);
    }
    if (column !== guestLedgerState.orderBy) {
      newDirection = direction.DESC; // start descending as default for new columns
    }

    const numberColumns = [
      'numberOfGuest',
      'numberOfNight',
      'outstandingAmount',
      'authorizedLimitAmount',
      'variance',
      'roomRate',
    ];

    const newListData = stableSort(
      guestLedgerState.listData,
      getCustomComparator({
        order: newDirection, // all properties within children sort asc
        orderBy: column,
        comparator: !numberColumns.includes(column) ? lowerCaseComparator : numberComparator,
        ignoreList: null,
      }),
    );

    updateState((state) => ({
      ...state,
      listData: newListData,
      order: newDirection,
      orderBy: column,
      pageState: updatePageState(pageState.DEFAULT),
    }));
  };

  const onHandleDownload = ({ value }) => {
    const name =
      guestLedgerState.hotelGroupId === 0
        ? getText('selectors.group.allGroups')
        : hotelsGroupsMap?.[guestLedgerState.hotelGroupId]?.groupName ?? 'uknown-group-name';
    downloadExcelFile(value, resultData, name);
  };

  const filterOutResults = (_, keyword) => {
    const { listData } = filterOutResultsInList(guestLedgerState.listDataSorting, keyword, searchColumns);

    updateState((state) => ({
      ...state,
      keyword,
      listData,
    }));
  };

  const onHandleCloseDrawer = () => {
    hideDrawer();
  };

  const onHandleFilters = () => {
    showDrawer({
      content: (
        <GuestLedgerFilters
          onHandleCancel={onHandleResetFilters}
          onHandleApplyFilters={onHandleApplyFilters}
          filters={filters}
          errors={guestLedgerState.filterErrors}
          filterSelections={filterSelections}
          onHandleCloseDrawer={onHandleCloseDrawer}
          onErrorHandle={onErrorHandle}
        />
      ),
    });
  };
  const onHandleResetFilters = () => {
    onHandleApplyFilters(DEFAULT_FILTERS);
    hideDrawer();
  };

  const onHandleApplyFilters = (values) => {
    logger.debug('Appling filters:', values);

    if (!isEqual(values, filters)) {
      let params = prepareParamsForFiltering(values, guestLedgerState, hotelsGroupsMap, hotels);
      logger.debug('list hotels for params', params);

      updateFilters(values);
      updateState((state) => ({
        ...state,
        listData: [],
        listDataSorting: [],
        pageState: updatePageState(pageState.LOADING),
        requestReport: false,
      }));
      guestLedgerList(params, GL_PAGINATION);
    }
    hideDrawer();
  };

  const fetchReport = () => {
    updateState((state) => ({
      ...state,
      listData: [],
      listDataSorting: [],
      pageState: updatePageState(pageState.LOADING),
      requestReport: false,
    }));

    updateFilters(DEFAULT_FILTERS);

    const groupHotels = getGroupHotels(guestLedgerState.hotelGroupId, hotelsGroupsMap, hotels);
    const params = prepareFilterParams(groupHotels, guestLedgerState.latestDate, guestLedgerState.latestDate);

    guestLedgerList(params, GL_PAGINATION);

    const glFilterParams = {
      hotelCode: [...groupHotels],
      hotelCodeTypeId: 3,
      startDate: dayjs(guestLedgerState.latestDate).format('YYYY-MM-DD'),
      endDate: dayjs(guestLedgerState.latestDate).format('YYYY-MM-DD'),
      filterType: FILTER_TYPES,
    };

    getGLFilters(glFilterParams, GL_PAGINATION);
  };

  return {
    guestLedgerState,
    onChange,
    onHandleDownload,
    filterOutResults,
    onHandleFilters,
    onHandleResetFilters,
    onRequestSort,
    filters,
    onRequestTableData,

    // only for testing...
    filterSelections,
    searchColumns,
    onHandleCloseDrawer,
    onHandleApplyFilters,
    fetchReport,
  };
};

// 48.24 |    24.09 |    37.5 |   48.59
//  61.4 |    33.73 |    62.5 |   59.81
