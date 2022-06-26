import React, { memo, Fragment, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import { Button, ToolBar, ToolBarItem, Search } from 'mdo-react-components';
import { getText } from '../../utils/localesHelpers';

import { AppContext } from '../../contexts';

const Widgets = memo(() => {
  const history = useHistory();
  const { appPages } = useContext(AppContext);

  const [filters, setFilters] = useState({
    category: -1,
    keyword: '',
  });

  const handleFilterChange = useCallback(
    (name, value) => {
      const newFilters = {
        ...filters,
        [name]: value,
      };
      setFilters(newFilters);
    },
    [setFilters, filters],
  );

  return (
    <Fragment>
      <ToolBar>
        <ToolBarItem>
          <Search
            label={getText('generic.search')}
            value={filters.keyword}
            name='keyword'
            onChange={handleFilterChange}
            dataEl='searchInput'
          />
        </ToolBarItem>
        <ToolBarItem>
          {/* <KpiCategoryDropdown
            label={getText('widget.category')}
            value={filters.category}
            name='category'
            onChange={handleFilterChange}
          /> */}
        </ToolBarItem>
        <ToolBarItem toTheRight>
          <Button
            iconName='Add'
            text=''
            variant='tertiary'
            title={getText('generic.add')}
            onClick={() => {
              history.push(appPages.keys['widgets-add'].url);
            }}
            dataEl='buttonAdd'
          />
        </ToolBarItem>
      </ToolBar>
      <Fragment>WIDGETS</Fragment>
    </Fragment>
  );
});

Widgets.displayName = 'Widgets';

export { Widgets };
