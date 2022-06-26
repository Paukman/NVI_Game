import React, { memo, Fragment, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import { Button, ToolBar, ToolBarItem, Search, RemoveConfirmationDialog, InputAlert } from 'mdo-react-components';
import { DataLoading, DisplayApiErrors, DisplayNoData, PaginatedDataTable } from '../../components';
import { getText, search } from '../../utils/localesHelpers';
import { organizationsColumnsConfig } from './columnsConfig';
import { AppContext } from '../../contexts';
import { useOrganization } from '../../graphql';
import logger from '../../utils/logger';
import { strReplace } from '../../utils/formatHelpers';
import { ToastContext } from '../../components/Toast';
import { getComparator, stableSort, switchDirection, direction } from '../../utils/pageHelpers';
import { omit } from 'lodash';

const Organizations = memo(() => {
  const { organizationList, organizations, organizationsLoading } = useOrganization();

  const history = useHistory();
  const { appPages } = useContext(AppContext);

  const [filters, setFilters] = useState({
    keyword: '',
  });

  const [sortData, setSortData] = useState({
    orderBy: '',
    order: '',
    items: [],
  });

  const [filteredItems, setFilteredItems] = useState([]);

  const handleFilterChange = useCallback(
    (name, value) => {
      const newFilters = {
        ...filters,
        [name]: value,
      };
      logger.log('handleFilterChange', { name, value });
      setFilters(newFilters);
    },
    [setFilters, filters],
  );

  useEffect(() => {
    logger.log('organizationList', filters);
    organizationList({
      params: filters,
      pagination: {
        pageSize: 200,
        page: 1,
      },
    });
  }, [organizationList, filters]);

  useMemo(() => {
    const { data } = organizations;
    const { keyword } = filters;
    logger.log('useMemo', filters);
    const items = data.filter((item) => {
      let found = true;

      // if (keyword.length == 0) {
      //   return true;
      // }

      // if (search(item.companyName, keyword) !== -1) {
      //   found = true;
      // } else if (search(item.firstName, keyword) !== -1) {
      //   found = true;
      // } else if (search(item.lastName, keyword) !== -1 && doesCategoryMatch) {
      //   found = true;
      // }

      return found;
    });

    setFilteredItems(items);
  }, [filters, organizations]);

  const onRequestSort = (column, dir) => {
    // const { order, orderBy, items } = sortData;
    // let newDirection = dir;
    // let columnToSortBy = column;
    // if (column === orderBy && dir === order) {
    //   newDirection = switchDirection(dir);
    // }
    // if (column !== orderBy) {
    //   newDirection = direction.DESC; // start descending as default for new columns
    // }
    // const newListData = stableSort(items, getComparator(newDirection, columnToSortBy));
    // setSortData({
    //   order: newDirection,
    //   orderBy: column,
    //   items: newListData,
    // });
  };

  return (
    <Fragment>
      <ToolBar>
        <ToolBarItem>
          <Search
            label={getText('generic.search')}
            value={filters.keyword}
            name='keyword'
            onChange={handleFilterChange}
            timeoutMs={1000}
            dataEl='searchInput'
          />
        </ToolBarItem>
      </ToolBar>
      <Fragment>
        {organizationsLoading && <DataLoading />}
        {!organizationsLoading && organizations.errors.length > 0 && <DisplayApiErrors errors={organizations.errors} />}
        {!organizationsLoading && organizations.data.length === 0 && organizations.errors.length === 0 && (
          <DisplayNoData message={getText('generic.emptyData')} />
        )}
        {!organizationsLoading && organizations.data.length > 0 && (
          <PaginatedDataTable
            expandCollapePlacement={-1}
            subHeaders={organizationsColumnsConfig()}
            {...sortData}
            items={filteredItems}
            filtersApplied={0}
            dataRowsCount={organizations.data.length}
            onRequestSort={onRequestSort}
            stickyHeaders={true}
            filtersActive={!!filters?.keyword}
            search={filters?.keyword ?? ''}
          />
        )}
      </Fragment>
    </Fragment>
  );
});

Organizations.displayName = 'Organizations';

export { Organizations };
