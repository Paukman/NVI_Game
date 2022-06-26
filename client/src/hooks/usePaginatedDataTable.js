import { useCallback, useEffect, useState } from 'react';
import { appSettings } from 'config/appSettings';
import { stubFalse } from 'lodash';

/**
 * If search is present in the report both keyword and maintainPageOnUpdate
 * are mandatory if we want full functionality.
 */
export const usePaginatedDataTable = ({ items, maintainPageOnUpdate, keyword, pageSize = appSettings.pageSize }) => {
  const [pageState, setState] = useState({
    page: 1,
    pagesCount: items ? Math.ceil(items.length / pageSize) : 1,
    allData: [],
    data: [],
    previousPage: 1,
    maintainPageOnUpdate: keyword === undefined && maintainPageOnUpdate === undefined ? false : maintainPageOnUpdate,
    keyword: keyword,
  });

  const keywordIsNotEmpty = (value) => {
    if (value === null || value === undefined || value === '') {
      return false;
    }
    return true;
  };

  const preparePage = useCallback(
    (page) => {
      if (Array.isArray(items)) {
        const start = (page - 1) * pageSize;
        const end = Math.min(items?.length, start + pageSize);
        const data = [];

        for (let idx = start; idx < end; idx++) {
          data.push(items[idx]);
        }
        setState((state) => ({
          ...state,
          page: page,
          data: data,
          pagesCount: items ? Math.ceil(items.length / pageSize) : 1,
        }));
      }
    },
    [items],
  );

  const prepareAllData = useCallback(() => {
    const allData = [];
    for (let page = 1; page <= pageState.pagesCount; page++) {
      if (Array.isArray(items)) {
        const start = (page - 1) * pageSize;
        const end = Math.min(items?.length, start + pageSize);
        const data = [];

        for (let idx = start; idx < end; idx++) {
          data.push(items[idx]);
        }
        allData.push(data);
      }
    }
    setState((state) => ({
      ...state,
      allData: allData,
      pagesCount: items ? Math.ceil(items.length / pageSize) : 1,
    }));
  }, [items]);

  const getPage = (page) => {
    setState((state) => ({
      ...state,
      page: page,
      data: pageState.allData[page - 1],
    }));
  };

  useEffect(() => {
    // if condition is there and we're not on first page, remember this
    if (keyword && keyword !== pageState.keyword) {
      setState((state) => ({
        ...state,
        previousPage: pageState.page,
        keyword: keyword,
        page: 1,
      }));
      preparePage(1);
    } else if (!keyword && pageState.keyword) {
      setState((state) => ({
        ...state,
        page: pageState.previousPage,
        keyword: keyword,
      }));
      preparePage(pageState.previousPage);
    } else if ((!keyword && !pageState.keyword) || (keyword && pageState.keyword && keyword === pageState.keyword)) {
      const shouldMainteinPage =
        keyword === undefined && maintainPageOnUpdate === undefined ? false : maintainPageOnUpdate;
      setState((state) => ({
        ...state,
        maintainPageOnUpdate: shouldMainteinPage,
      }));
      preparePage(shouldMainteinPage ? pageState.page : 1);
    }
  }, [preparePage, keyword]);

  useEffect(() => {
    prepareAllData();
  }, [prepareAllData]);

  // getPage might work faster with huge amount of data that needs to be
  // processed every time when we switch from page to page
  return { pageState, preparePage, getPage };
};
