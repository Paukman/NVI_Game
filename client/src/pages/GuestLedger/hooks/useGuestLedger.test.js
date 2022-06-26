import { renderHook } from '@testing-library/react-hooks';
import PropTypes from 'prop-types';

import { useGuestLedgerGet } from './useGuestLedger';
import { defaultValues } from 'hooks/useGlobalFilter';
import * as useGuestLedgerQuery from '../../../graphql/useGuestLedger';
import { RenderWithProviders, getText, direction } from 'utils';
import { DEFAULT_FILTERS } from '../constants';
import * as utils from '../utils';

import { columnsCfg, items, searchColumns } from '../testData';

const hotels = [
  { hotelName: 'Hotel1', id: 1 },
  { hotelName: 'Hotel2', id: 2 },
  { hotelName: 'Hotel3', id: 3 },
  { hotelName: 'Hotel4', id: 4 },
];

const hotelsGroupsMap = {
  1: { id: 1, groupName: 'Group1', hotels: [hotels[0], hotels[1]] },
  2: { id: 2, groupName: 'Group2', hotels: [hotels[2], hotels[3]] },
};

const wrapper = {
  portfolio: defaultValues,
  userSettingsState: { mapSettingCode: { 'app:defaultHotelGroup': '2' } },
  hotels,
  hotelsGroupsMap,
};

const Wrapper = (props = {}) => {
  const Component = ({ children }) => <RenderWithProviders {...props}>{children}</RenderWithProviders>;

  Component.propTypes = {
    children: PropTypes.node.isRequired,
  };
  return Component;
};
describe('Testing useGuestLedger', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should fetch guest ledger data on hook render', async () => {
    const guestLedgerListGetByHotelCode = jest.fn();
    const getGLFilters = jest.fn();
    jest.spyOn(useGuestLedgerQuery, 'useGuestLedger').mockReturnValue({
      guestLedgerListGetByHotelCode: guestLedgerListGetByHotelCode,
      guestLedgerListGetFiltersByHotelCode: getGLFilters,
      guestLedgerListGetFiltersByHotelCodeState: { data: [] },
    });

    let hook;
    await act(async () => {
      hook = renderHook(() => useGuestLedgerGet(), {
        wrapper: Wrapper(wrapper),
      });
    });

    const { result } = hook;
    expect(result.current.guestLedgerState.hotelGroupId).toEqual(2);
    expect(result.current.guestLedgerState.pageState).toEqual({ ERROR: false, LOADING: true, DEFAULT: false });
    expect(guestLedgerListGetByHotelCode).toBeCalledWith(
      { hotelCode: [3, 4], hotelCodeTypeId: 3, latestDate: true },
      { page: 1, pageSize: 10000 },
    );
  });

  it('should fetch guest ledger data on hook render with no group from user settings', async () => {
    const guestLedgerListGetByHotelCode = jest.fn();
    const getGLFilters = jest.fn();
    jest.spyOn(useGuestLedgerQuery, 'useGuestLedger').mockReturnValue({
      guestLedgerListGetByHotelCode: guestLedgerListGetByHotelCode,
      guestLedgerListGetFiltersByHotelCode: getGLFilters,
      guestLedgerListGetFiltersByHotelCodeState: { data: [] },
    });

    let hook;
    await act(async () => {
      hook = renderHook(() => useGuestLedgerGet(), {
        wrapper: Wrapper({ ...wrapper, userSettingsState: { mapSettingCode: {} } }),
      });
    });

    const { result } = hook;
    expect(result.current.guestLedgerState.hotelGroupId).toEqual(0);
    expect(result.current.guestLedgerState.pageState).toEqual({ ERROR: false, LOADING: true, DEFAULT: false });
    expect(guestLedgerListGetByHotelCode).toBeCalledWith(
      {
        hotelCode: [1, 2, 3, 4],
        hotelCodeTypeId: 3,
        latestDate: true,
      },
      { page: 1, pageSize: 10000 },
    );
  });

  it('should have proper response on empty data ', async () => {
    const guestLedgerListGetByHotelCode = jest.fn();
    const getGLFilters = jest.fn();
    jest.spyOn(useGuestLedgerQuery, 'useGuestLedger').mockReturnValue({
      guestLedgerListGetByHotelCode: guestLedgerListGetByHotelCode,
      guestLedgerListGetByHotelCodeState: { data: [] },
      guestLedgerListGetFiltersByHotelCode: getGLFilters,
      guestLedgerListGetFiltersByHotelCodeState: { data: [] },
    });

    let hook;
    await act(async () => {
      hook = renderHook(() => useGuestLedgerGet(), {
        wrapper: Wrapper(wrapper),
      });
    });

    const { result } = hook;
    expect(result.current.guestLedgerState.hotelGroupId).toEqual(2);
    expect(result.current.guestLedgerState.pageState).toEqual({
      ERROR: false,
      LOADING: false,
      DEFAULT: getText('guestLedger.noData'),
    });
    expect(guestLedgerListGetByHotelCode).toBeCalledWith(
      { hotelCode: [3, 4], hotelCodeTypeId: 3, latestDate: true },
      { page: 1, pageSize: 10000 },
    );
  });

  it('should have proper response on valid data ', async () => {
    const guestLedgerListGetByHotelCode = jest.fn();
    const getGLFilters = jest.fn();
    jest.spyOn(useGuestLedgerQuery, 'useGuestLedger').mockReturnValue({
      guestLedgerListGetByHotelCode: guestLedgerListGetByHotelCode,
      guestLedgerListGetByHotelCodeState: {
        data: [{ columnsCfg: columnsCfg, items: items }],
      },
      guestLedgerListGetFiltersByHotelCode: getGLFilters,
      guestLedgerListGetFiltersByHotelCodeState: { data: [] },
    });

    let hook;
    await act(async () => {
      hook = renderHook(() => useGuestLedgerGet(), {
        wrapper: Wrapper(wrapper),
      });
    });

    const { result } = hook;

    // we don't check accuracy here, only that some data is available
    expect(result.current.guestLedgerState.listData).toHaveLength(3);

    // filters should return, we don't care about the values
    expect(Object.keys(result.current.filterSelections).toString()).toBe(
      'settlementCodeItems,numberOfNightsItems,groupCodeItems,roomTypesItems,folioItems,settlementTypeItems,marshaCodeItems',
    );
    expect(result.current.searchColumns).toEqual(searchColumns);
  });

  it('should call onChange ', async () => {
    const guestLedgerListGetByHotelCode = jest.fn();
    const assignGlobalValue = jest.fn();
    const getGLFilters = jest.fn();
    jest.spyOn(useGuestLedgerQuery, 'useGuestLedger').mockReturnValue({
      guestLedgerListGetByHotelCode: guestLedgerListGetByHotelCode,
      guestLedgerListGetByHotelCodeState: { data: [] },
      guestLedgerListGetFiltersByHotelCode: getGLFilters,
      guestLedgerListGetFiltersByHotelCodeState: { data: [] },
    });

    let hook;
    await act(async () => {
      hook = renderHook(() => useGuestLedgerGet(), {
        wrapper: Wrapper({ ...wrapper, assignGlobalValue: assignGlobalValue }),
      });
    });

    const { result } = hook;

    await act(async () => {
      result.current.onChange('hotelGroupId', 0);
    });
    expect(result.current.guestLedgerState.hotelGroupId).toEqual(0);
    expect(assignGlobalValue).toBeCalledWith('hotelGroupId', 0);

    await act(async () => {
      result.current.onChange('hotelGroupId', 3);
    });
    expect(result.current.guestLedgerState.hotelGroupId).toEqual(3);
    expect(assignGlobalValue).toBeCalledWith('hotelGroupId', 3);

    await act(async () => {
      result.current.onChange('latestDate', 'someDate');
    });
    expect(result.current.guestLedgerState.latestDate).toEqual('someDate');
    expect(assignGlobalValue).toBeCalledWith('latestDate', 'someDate');

    await act(async () => {
      result.current.onChange('latestDate', '1982/09/20');
    });
    expect(result.current.guestLedgerState.latestDate).toEqual('1982/09/20');
    expect(assignGlobalValue).toBeCalledWith('latestDate', '1982/09/20');
  });

  it('should sort existing data for given column ', async () => {
    const guestLedgerListGetByHotelCode = jest.fn();
    const getGLFilters = jest.fn();
    jest.spyOn(useGuestLedgerQuery, 'useGuestLedger').mockReturnValue({
      guestLedgerListGetByHotelCode: guestLedgerListGetByHotelCode,
      guestLedgerListGetByHotelCodeState: { data: [{ columnsCfg: columnsCfg, items: items }] },
      guestLedgerListGetFiltersByHotelCode: getGLFilters,
      guestLedgerListGetFiltersByHotelCodeState: { data: [] },
    });

    let hook;
    await act(async () => {
      hook = renderHook(() => useGuestLedgerGet(), {
        wrapper: Wrapper(wrapper),
      });
    });

    const { result } = hook;

    // check for only one field
    expect(result.current.guestLedgerState.listData.map((obj) => obj.folio)).toEqual(['G3738', '44976', 'G3728']);

    await act(async () => {
      result.current.onRequestSort('folio', direction.DESC);
    });
    expect(result.current.guestLedgerState.order).toEqual(direction.DESC);
    expect(result.current.guestLedgerState.orderBy).toEqual('folio');
    expect(result.current.guestLedgerState.listData.map((obj) => obj.folio)).toEqual(['G3738', 'G3728', '44976']);

    await act(async () => {
      result.current.onRequestSort('folio', direction.ASC);
    });
    expect(result.current.guestLedgerState.order).toEqual(direction.ASC);
    expect(result.current.guestLedgerState.orderBy).toEqual('folio');
    expect(result.current.guestLedgerState.listData.map((obj) => obj.folio)).toEqual(['44976', 'G3728', 'G3738']);

    // same, nothing is changes
    await act(async () => {
      result.current.onRequestSort('folio', direction.ASC);
    });
    expect(result.current.guestLedgerState.order).toEqual(direction.DESC);
    expect(result.current.guestLedgerState.orderBy).toEqual('folio');
    expect(result.current.guestLedgerState.listData.map((obj) => obj.folio)).toEqual(['G3738', 'G3728', '44976']);
  });

  it('should call onHandleDownload ', async () => {
    const guestLedgerListGetByHotelCode = jest.fn();
    const getGLFilters = jest.fn();
    jest.spyOn(useGuestLedgerQuery, 'useGuestLedger').mockReturnValue({
      guestLedgerListGetByHotelCode: guestLedgerListGetByHotelCode,
      guestLedgerListGetByHotelCodeState: { data: [{ columnsCfg: columnsCfg, items: items }] },
      guestLedgerListGetFiltersByHotelCode: getGLFilters,
      guestLedgerListGetFiltersByHotelCodeState: { data: [] },
    });

    let hook;
    await act(async () => {
      hook = renderHook(() => useGuestLedgerGet(), {
        wrapper: Wrapper(wrapper),
      });
    });

    const { result } = hook;

    const downloadExcelFile = jest.spyOn(utils, 'downloadExcelFile');
    await act(async () => {
      result.current.onHandleDownload({ value: 'someValue' });
    });

    // if we mock result data before the call, but this is file as well...
    expect(downloadExcelFile).toBeCalledWith('someValue', [], 'Group2');
  });

  it('should call filterOutResults ', async () => {
    const guestLedgerListGetByHotelCode = jest.fn();
    const getGLFilters = jest.fn();
    jest.spyOn(useGuestLedgerQuery, 'useGuestLedger').mockReturnValue({
      guestLedgerListGetByHotelCode: guestLedgerListGetByHotelCode,
      guestLedgerListGetByHotelCodeState: { data: [{ columnsCfg: columnsCfg, items: items }] },
      guestLedgerListGetFiltersByHotelCode: getGLFilters,
      guestLedgerListGetFiltersByHotelCodeState: { data: [] },
    });

    let hook;
    await act(async () => {
      hook = renderHook(() => useGuestLedgerGet(), {
        wrapper: Wrapper(wrapper),
      });
    });

    const { result } = hook;

    const filterOutResultsInList = jest.spyOn(utils, 'filterOutResultsInList');
    await act(async () => {
      result.current.filterOutResults('filter', 'EXPEDIA');
    });

    // if we mock result data before the call, but this is file as well...
    expect(filterOutResultsInList).toBeCalledTimes(1);
    expect(result.current.guestLedgerState.keyword).toEqual('EXPEDIA');
    expect(result.current.guestLedgerState.listData).toHaveLength(1); // only one row

    await act(async () => {
      result.current.filterOutResults('filter', 'Some garbage search');
    });

    // if we mock result data before the call, but this is file as well...
    expect(filterOutResultsInList).toBeCalledTimes(2);
    expect(result.current.guestLedgerState.keyword).toEqual('Some garbage search');
    expect(result.current.guestLedgerState.listData).toHaveLength(0); // only one row
  });

  it('should call onHandleCloseDrawer ', async () => {
    const guestLedgerListGetByHotelCode = jest.fn();
    const getGLFilters = jest.fn();
    jest.spyOn(useGuestLedgerQuery, 'useGuestLedger').mockReturnValue({
      guestLedgerListGetByHotelCode: guestLedgerListGetByHotelCode,
      guestLedgerListGetByHotelCodeState: { data: [{ columnsCfg: columnsCfg, items: items }] },
      guestLedgerListGetFiltersByHotelCode: getGLFilters,
      guestLedgerListGetFiltersByHotelCodeState: { data: [] },
    });

    const hideDrawer = jest.fn();
    const showDrawer = jest.fn();

    let hook;
    await act(async () => {
      hook = renderHook(() => useGuestLedgerGet(), {
        wrapper: Wrapper({ ...wrapper, hideDrawer: hideDrawer, showDrawer: showDrawer }),
      });
    });

    const { result } = hook;

    await act(async () => {
      result.current.onHandleCloseDrawer();
    });
    expect(hideDrawer).toBeCalledTimes(1);
  });
  it('should call onHandleFilters ', async () => {
    const guestLedgerListGetByHotelCode = jest.fn();
    const getGLFilters = jest.fn();
    jest.spyOn(useGuestLedgerQuery, 'useGuestLedger').mockReturnValue({
      guestLedgerListGetByHotelCode: guestLedgerListGetByHotelCode,
      guestLedgerListGetByHotelCodeState: { data: [{ columnsCfg: columnsCfg, items: items }] },
      guestLedgerListGetFiltersByHotelCode: getGLFilters,
      guestLedgerListGetFiltersByHotelCodeState: { data: [] },
    });

    const hideDrawer = jest.fn();
    const showDrawer = jest.fn();

    let hook;
    await act(async () => {
      hook = renderHook(() => useGuestLedgerGet(), {
        wrapper: Wrapper({ ...wrapper, hideDrawer: hideDrawer, showDrawer: showDrawer }),
      });
    });

    const { result } = hook;

    await act(async () => {
      result.current.onHandleFilters();
    });
    expect(showDrawer).toBeCalledTimes(1);
  });

  it('should call onHandleResetFilters ', async () => {
    const guestLedgerListGetByHotelCode = jest.fn();
    const getGLFilters = jest.fn();
    jest.spyOn(useGuestLedgerQuery, 'useGuestLedger').mockReturnValue({
      guestLedgerListGetByHotelCode: guestLedgerListGetByHotelCode,
      guestLedgerListGetByHotelCodeState: { data: [{ columnsCfg: columnsCfg, items: items }] },
      guestLedgerListGetFiltersByHotelCode: getGLFilters,
      guestLedgerListGetFiltersByHotelCodeState: { data: [] },
    });

    const hideDrawer = jest.fn();
    const showDrawer = jest.fn();

    let hook;
    await act(async () => {
      hook = renderHook(() => useGuestLedgerGet(), {
        wrapper: Wrapper({ ...wrapper, hideDrawer: hideDrawer, showDrawer: showDrawer }),
      });
    });

    const { result } = hook;

    await act(async () => {
      result.current.onHandleResetFilters();
    });
    expect(hideDrawer).toBeCalledTimes(2);
    expect(result.current.filters).toEqual(DEFAULT_FILTERS);
  });

  it('should call onHandleApplyFilters with custom filters ', async () => {
    const guestLedgerListGetByHotelCode = jest.fn();
    const getGLFilters = jest.fn();
    jest.spyOn(useGuestLedgerQuery, 'useGuestLedger').mockReturnValue({
      guestLedgerListGetByHotelCode: guestLedgerListGetByHotelCode,
      guestLedgerListGetByHotelCodeState: { data: [{ columnsCfg: columnsCfg, items: items }] },
      guestLedgerListGetFiltersByHotelCode: getGLFilters,
      guestLedgerListGetFiltersByHotelCodeState: { data: [] },
    });

    const hideDrawer = jest.fn();

    let hook;
    await act(async () => {
      hook = renderHook(() => useGuestLedgerGet(), {
        wrapper: Wrapper({ ...wrapper, hideDrawer: hideDrawer }),
      });
    });

    const { result } = hook;

    const filterOutResultsInList = jest.spyOn(utils, 'filterOutResultsInList').mockReturnValue({
      listData: [],
    });

    await act(async () => {
      result.current.onHandleApplyFilters({ ...DEFAULT_FILTERS, folio: '44976' });
    });

    // same filter again...
    await act(async () => {
      result.current.onHandleApplyFilters({ ...DEFAULT_FILTERS, folio: '44976' });
    });

    expect(hideDrawer).toBeCalledTimes(2);
    expect(filterOutResultsInList).toBeCalledTimes(1);
  });
});
