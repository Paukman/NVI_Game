import React, { Fragment, memo, useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { RecursiveDataTable, EnhancedPagination, ToolBar, ToolBarItem } from 'mdo-react-components';

import { DataContainer, DisplayNoData } from 'components';
import { appSettings } from 'config/appSettings';
import { getText } from 'utils';
import './style.css';

// AT this is just a temporary solution so QA does not fail https://mydigitaloffice.atlassian.net/browse/MYP2-1275.
// controling pagination from outside and from compoennts is NOT the way to go.
// TBD replace this with proper pagination one page is refactored!!!

//const { pageSize } = appSettings;
const { pageSize: appSettingPageSize } = appSettings;

const ARMappingPaginatedDataTable = memo((props) => {
  const { items, filtersApplied, dataRowsCount, onChangePage, setPageValue, customPageSize, obsoleteData, ...rest } =
    props;

  const [state, setState] = useState({
    page: setPageValue || 1,
    pagesCount: 1,
    data: [],
  });
  const pageSize = customPageSize ? customPageSize : appSettingPageSize;
  const calcPagesCount = (items) => {
    return Math.ceil(items.length / pageSize);
  };
  const setPage = (page) => {
    if (Array.isArray(items)) {
      const start = (page - 1) * pageSize;
      const end = Math.min(items.length, start + pageSize);
      const data = [];

      for (let idx = start; idx < end; idx++) {
        data.push(items[idx]);
      }
      onChangePage(page);

      setState({
        page,
        pagesCount: calcPagesCount(items),
        data,
      });
    }
  };

  useEffect(() => {
    if (setPageValue) {
      setPage(setPageValue);
    }
  }, [setPageValue, items]);

  return items.length == 0 ? (
    <DisplayNoData message={getText('incomeJournal.nofilterdata')} />
  ) : (
    <Fragment>
      <DataContainer obsoleteData={obsoleteData}>
        <RecursiveDataTable {...rest} data={[{ children: state.data }]} />
      </DataContainer>
      <ToolBar>
        <ToolBarItem toTheRight>
          <EnhancedPagination count={state.pagesCount} page={state.page} onChange={(page) => onChangePage(page)} />
        </ToolBarItem>
      </ToolBar>
    </Fragment>
  );
});

ARMappingPaginatedDataTable.displayName = 'ARMappingPaginatedDataTable';

ARMappingPaginatedDataTable.propTypes = {
  items: PropTypes.array,
  filtersApplied: PropTypes.number,
  dataRowsCount: PropTypes.number,
  setPageValue: PropTypes.number,
  onChangePage: PropTypes.func,
  ...RecursiveDataTable.propTypes,
};

export { ARMappingPaginatedDataTable };
