import { useState, useEffect, useCallback, useContext, useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import { usePurchaseOrder } from '../../../graphql';
import { AppContext, GlobalFilterContext } from 'contexts';
import { getComparator, stableSort, switchDirection, direction, findInObject } from 'utils/pageHelpers';
import {
  prepareParamsForPurchseOrderListQuery,
  formatResultData,
  updateDataForReceivedPO,
  downloadExcelFile,
} from '../utils';
import { strReplace } from 'utils/formatHelpers';
import { allItemsForVendor, pageState } from '../constants';
import { actions } from 'components/PurchaseOrders/PurchaseOrderMoreMenu.js';
import { globals, usePageState } from 'hooks';
import { isDateValid } from 'utils/validators';

export const usePurchaseOrderListing = () => {
  const { portfolio, assignGlobalValue } = useContext(GlobalFilterContext);
  const myGlobals = [globals.hotelId, globals.fromDate, globals.toDate, globals.vendorId];
  const { appPages } = useContext(AppContext);
  const history = useHistory();
  const { purchaseOrders, purchaseOrderList, purchaseOrderReceived, purchaseOrderReceivedMarkSet } = usePurchaseOrder();
  const { updatePageState } = usePageState(pageState);

  const [listingState, updateListingState] = useState({
    fromDate: portfolio.fromDate,
    toDate: portfolio.toDate,
    vendors: [],
    vendorsMapped: [],
    hotels: [],
    hotelId: portfolio.hotelId,
    vendorId: null,
    data: [],
    errors: [],
    listData: [],
    listDataSorting: [],
    dictionaryItems: [],
    order: direction.DESC, // default
    orderBy: 'date',
    keyword: '',
    appPages: [],
    markReceiveActiveErrors: [],
    noDataMessage: null, // null with no search ever, empty with first search
    loadingData: false,
    pageState: { ...updatePageState(pageState.DEFAULT) },
    requestReport: true,
  });

  useEffect(() => {
    if (purchaseOrders?.data || purchaseOrders?.errors?.length) {
      // no errors
      if (purchaseOrders?.data && !purchaseOrders?.errors?.length) {
        if (!purchaseOrders.data?.length) {
          // no data
          updateListingState((state) => ({
            ...state,
            listData: [],
            pageState: updatePageState(pageState.MESSAGE),
          }));
        } else {
          const formattedPurchaseOrders = formatResultData(purchaseOrders.data, listingState);
          updateListingState((state) => ({
            ...state,
            data: [...purchaseOrders.data],
            listData: [...formattedPurchaseOrders],
            listDataSorting: [...formattedPurchaseOrders], // have to keep one more copy for sorting
            pageState: updatePageState(pageState.DEFAULT),
          }));
        }
      } // errors...
      else if (purchaseOrders?.errors?.length) {
        updateListingState((state) => ({
          ...state,
          errors: purchaseOrders?.errors,
          pageState: updatePageState(pageState.ERROR),
        }));
      }
    }
  }, [purchaseOrders]);

  // for marking received/active
  useMemo(() => {
    if (purchaseOrderReceived?.data || purchaseOrderReceived?.errors) {
      const { data, listData } = updateDataForReceivedPO(purchaseOrderReceived.data, listingState);
      updateListingState((state) => ({
        ...state,
        listData: listData,
        data: data,
        markReceiveActiveErrors: [...purchaseOrderReceived?.errors],
      }));
    }
  }, [purchaseOrderReceived]);

  const onChange = (name, value) => {
    if (myGlobals.includes(name)) {
      assignGlobalValue(name, value);
    }
    updateListingState((state) => ({
      ...state,
      [name]: value,
      // reset message whenever we start changing any filters
      pageState: updatePageState(pageState.DEFAULT),
      requestReport: true,
    }));
  };

  const listPurchaseOrders = () => {
    if (listingState?.hotelId === null || !listingState?.vendorId) {
      updateListingState((state) => ({
        ...state,
        pageState: updatePageState(pageState.MESSAGE),
        listData: [],
      }));
      return;
    }

    updateListingState((state) => ({
      ...state,
      pageState: updatePageState(pageState.LOADING),
      listData: [],
      requestReport: false,
    }));

    const params = prepareParamsForPurchseOrderListQuery(listingState);
    purchaseOrderList(params);
  };

  // issue here is that vendor id is eg. available globally, but vendor mapping
  // is still not loaded.
  useEffect(() => {
    if (listingState?.vendorsMapped.length > 0 && listingState?.vendorId === null) {
      updateListingState((state) => ({
        ...state,
        vendorId: portfolio.vendorId,
      }));
    }
  }, [listingState.vendorsMapped, listingState.vendorId]);

  const updateVendors = (companies) => {
    const vendorsMapped = companies.map((item) => {
      return {
        value: item.id,
        label: item.companyName,
        name: item.companyName,
      };
    });

    const vandorsMappedAndAll = [allItemsForVendor, ...vendorsMapped];
    updateListingState((state) => ({
      ...state,
      vendors: [...companies],
      vendorsMapped: vandorsMappedAndAll,
      vendorsId: portfolio.vendorId,
    }));
  };

  const onRequestSort = (column, dir) => {
    let newDirection = dir;
    if (column === listingState.orderBy && dir === listingState.order) {
      newDirection = switchDirection(dir);
    }
    if (column !== listingState.orderBy) {
      newDirection = direction.DESC; // start descending as default for new columns
    }

    let columnToSortBy = column;
    if (column === 'total') {
      columnToSortBy = 'totalForSorting';
    }
    const newListData = stableSort(listingState.listData, getComparator(newDirection, columnToSortBy));

    updateListingState((state) => ({
      ...state,
      listData: newListData,
      order: newDirection,
      orderBy: column,
    }));
  };

  const filterOutResults = (name, keyWord) => {
    let matchingList = listingState.listDataSorting;

    if (keyWord) {
      matchingList = listingState.listDataSorting.filter((item) => {
        return findInObject({
          predicate: (val) => {
            return val.toLowerCase().includes(keyWord.toLowerCase());
          },
          object: item,
          exclude: ['id'], // don't look here...
        });
      });
    }

    updateListingState((state) => ({
      ...state,
      [name]: keyWord,
      listData: [...matchingList],
    }));
  };

  const updateLoadedData = useCallback((name, value) => {
    onChange(name, value);
  }, []);

  const onPurchaseOrderSelect = (poNumber) => {
    const po = listingState.data.find((item) => item?.poNumber === poNumber);
    if (listingState?.appPages) {
      history.push(strReplace(`${listingState.appPages.keys['purchase-orders-view'].url}`, { id: po?.id }));
    }
  };

  const onHandleDownload = ({ value }) => {
    downloadExcelFile(
      value,
      appPages,
      listingState?.hotelId,
      listingState?.listData,
      listingState?.fromDate,
      listingState?.toDate,
    );
  };

  const onHandleMoreOptions = ({ action, dataRow }) => {
    const poItem = listingState.data.find((item) => item?.poNumber === dataRow?.poId);
    switch (action?.id) {
      case actions.MARK_RECEIVED: {
        if (poItem && !poItem.poReceivedAt) {
          purchaseOrderReceivedMarkSet({
            id: poItem.id,
            poReceived: true,
          });
          // this was my first option to just reload after marking active or received,
          // but this refreshes the page and not really good user experience.
          // second option wait for the result and update data and view data, perfectly legit on valid return.
          // listPurchaseOrders();
        }
        break;
      }
      case actions.MARK_ACTIVE: {
        if (poItem && poItem.poReceivedAt !== null) {
          purchaseOrderReceivedMarkSet({
            id: poItem.id,
            poReceived: false,
          });
        }
        break;
      }
      case actions.PRINT: {
        // load print component
        break;
      }
      default:
        break;
    }
  };

  const allDataIsValid = () => {
    if (
      !isDateValid(listingState?.fromDate) ||
      !isDateValid(listingState?.toDate) ||
      listingState?.hotelId === null ||
      !listingState?.vendorId
    ) {
      return false;
    }
    return true;
  };

  return {
    allDataIsValid,
    listingState,
    onChange,
    listPurchaseOrders,
    updateVendors,
    onRequestSort,
    filterOutResults,
    updateLoadedData,
    onPurchaseOrderSelect,
    onHandleDownload,
    onHandleMoreOptions,
  };
};
