import React, { memo, Fragment, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import { Button, ToolBar, ToolBarItem, Search, RemoveConfirmationDialog, InputAlert } from 'mdo-react-components';
import { DataLoading, DisplayApiErrors, DisplayNoData, PaginatedDataTable } from '../../components';
import { getText, search } from '../../utils/localesHelpers';
import { usersColumnsConfig } from './columnsConfig';
import { AppContext } from '../../contexts';
import { useUser } from '../../graphql';
import logger from '../../utils/logger';
import { strReplace } from '../../utils/formatHelpers';
import { ToastContext } from '../../components/Toast';
import { getComparator, stableSort, switchDirection, direction } from '../../utils/pageHelpers';
import { omit } from 'lodash';

const Users = memo(() => {
  const { userList, users, usersLoading } = useUser();

  const history = useHistory();
  const { appPages } = useContext(AppContext);

  const [filters, setFilters] = useState({
    keyword: '',
    orgId: null,
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

  const handleAction = useCallback(
    (button, user) => {
      logger.debug('Action', button, user);

      switch (button.clickId) {
        case 'edit':
          history.push(strReplace(`${appPages.keys['user-edit'].url}`, { userId: user.id }));
          break;
      }
    },
    [history, appPages],
  );

  useEffect(() => {
    logger.log('userList', filters);
    userList({
      params: filters,
    });
  }, [userList, filters]);

  useMemo(() => {
    const { data } = users;
    const { keyword } = filters;
    logger.log('useMemo', filters);
    const items = data.filter((item) => {
      let found = false;

      if (keyword.length == 0) {
        return true;
      }

      if (search(item.username, keyword) !== -1) {
        found = true;
      } else if (search(item.firstName, keyword) !== -1) {
        found = true;
      } else if (search(item.lastName, keyword) !== -1 && doesCategoryMatch) {
        found = true;
      }

      return found;
    });

    setFilteredItems(items);
  }, [filters, users]);

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
        <ToolBarItem toTheRight>
          <Button
            iconName='Add'
            text=''
            variant='tertiary'
            title={appPages.keys['user-add']?.name}
            onClick={() => {
              history.push(appPages.keys['user-add'].url);
            }}
            dataEl='buttonAdd'
          />
        </ToolBarItem>
      </ToolBar>
      <Fragment>
        {usersLoading && <DataLoading />}
        {!usersLoading && users.errors.length > 0 && <DisplayApiErrors errors={users.errors} />}
        {!usersLoading && users.data.length === 0 && users.errors.length === 0 && (
          <DisplayNoData message={getText('generic.emptyData')} />
        )}
        {!usersLoading && users.data.length > 0 && (
          <PaginatedDataTable
            expandCollapePlacement={-1}
            subHeaders={usersColumnsConfig({ handleAction })}
            {...sortData}
            items={filteredItems}
            filtersApplied={0}
            dataRowsCount={users.data.length}
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

Users.displayName = 'Users';

export { Users };
