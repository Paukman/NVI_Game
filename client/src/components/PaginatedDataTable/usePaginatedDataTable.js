import { useEffect, useState } from 'react';
import { appSettings } from 'config/appSettings';
import { getPageToUpdate, prepareData } from './utils';

export const usePaginatedDataTable = ({
  items,
  maintainPageOnUpdate = true,
  // filters will include any search or any filtersActive on the page...
  filtersActive = false,
  pageSize = appSettings.pageSize,
  maintainPageOnClearFilters = false, // future use
  search,
  filters,
}) => {
  const [pageState, setState] = useState({
    page: 1,
    pagesCount: items ? Math.ceil(items.length / pageSize) : 1,
    data: [],
    previousPage: 1, // future use for filtersActive
    maintainPageOnUpdate: maintainPageOnUpdate,
    search: search,
    filters: filters,
    filtersActive: filtersActive,
  });

  useEffect(() => {
    //create first page immediattely
    setState((state) => ({
      ...state,
      page: 1,
      data: prepareData(items, 1, pageSize),
    }));
  }, []);

  useEffect(() => {
    if (pageState.data.length === 0) {
      // skip initial call...
      return;
    } else {
      // future use
      const { page, previousPage } = getPageToUpdate({
        filtersActive,
        state: pageState,
        maintainPageOnUpdate,
        maintainPageOnClearFilters,
        search,
        filters,
      });
      //const page = maintainPageOnUpdate === true && !filtersActive ? pageState.page : 1;

      setState((state) => ({
        ...state,
        page: page,
        data: prepareData(items, page, pageSize),
        pagesCount: items ? Math.ceil(items.length / pageSize) : 1,
        filtersActive: filtersActive,
        previousPage: previousPage,
        search,
        filters,
      }));
    }
  }, [items]);

  const preparePage = (page) => {
    setState((state) => ({
      ...state,
      page: page,
      data: prepareData(items, page, pageSize),
    }));
  };

  return { pageState, preparePage };
};
