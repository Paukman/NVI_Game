import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { RecursiveDataTable, ToolBar, ToolBarItem, EnhancedPagination } from 'mdo-react-components';

import { DataContainer } from 'components';
import { usePaginatedDataTable } from './usePaginatedDataTable';
import { logger } from 'utils';

export const PaginatedDataTable = memo((props) => {
  const {
    items,
    filtersApplied,
    dataRowsCount,
    obsoleteData,
    maintainPageOnUpdate,
    filtersActive,
    search, // actual value from page
    filters, // actual value from page
    //fetchOnPageChange,
    ...rest
  } = props;
  const { pageState, preparePage } = usePaginatedDataTable({
    items: items,
    maintainPageOnUpdate,
    filtersActive,
    search,
    filters,
  });

  //logger.debug('pag:', items, items?.length, pageState.data);

  return (
    <>
      <DataContainer obsoleteData={obsoleteData}>
        <RecursiveDataTable {...rest} data={[{ children: pageState.data }]} allData={[{ children: items }]} />
      </DataContainer>
      <ToolBar>
        <ToolBarItem toTheRight marginRight={'20px'} marginTop={'8px'}>
          <EnhancedPagination
            count={pageState.pagesCount}
            page={pageState.page}
            onChange={(page) => {
              preparePage(page, true);
              // future use if we want to fetch only given page
              // fetchOnPageChange(page);
            }}
          />
        </ToolBarItem>
      </ToolBar>
    </>
  );
});

PaginatedDataTable.displayName = 'PaginatedDataTable';

PaginatedDataTable.propTypes = {
  items: PropTypes.array,
  filtersApplied: PropTypes.number,
  dataRowsCount: PropTypes.number,
  addRecievedDescription: PropTypes.bool,
  obsoleteData: PropTypes.bool,

  ...RecursiveDataTable.propTypes,
};
