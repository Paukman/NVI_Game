import { isEqual } from 'lodash';
import { logger } from 'utils';

export const prepareData = (items, page, pageSize) => {
  let data = [];
  if (Array.isArray(items)) {
    const start = (page - 1) * pageSize;
    const end = Math.min(items?.length, start + pageSize);

    for (let idx = start; idx < end; idx++) {
      data.push(items[idx]);
    }
  }
  return data;
};

export const getPageToUpdate = ({ filtersActive, state, maintainPageOnUpdate = true, search, filters }) => {
  const searchIsSame = isEqual(search, state.search);
  const filterIsSame = isEqual(filters, state.filters);

  let page = 1;
  let previousPage = 1;

  const curentFilters = state.filtersActive ?? false;
  const filtersAreActive = filtersActive !== curentFilters;

  // 1. if we don't have any search (inc. filtersActive) or we don't change the search (inc. filtersActive),
  // also no changes in search or filtersActive...
  // then this is 90 % of cases.
  if (!filtersAreActive && searchIsSame && filterIsSame && maintainPageOnUpdate === true) {
    logger.debug('case 1', filtersActive, curentFilters, searchIsSame, filterIsSame);
    page = state.page;
  }
  // 2. we just finished search (inc. filtersActive)
  // jsut go back to page, 1, too complext to maintain state
  else if (!filtersActive && filtersAreActive) {
    logger.debug('case 2', filtersActive, curentFilters, searchIsSame, filterIsSame);
    page = 1;
  }
  return { page, previousPage };
};
