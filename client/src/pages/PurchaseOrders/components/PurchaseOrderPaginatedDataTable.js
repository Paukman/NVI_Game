import React, { memo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { RecursiveDataTable, EnhancedPagination, ToolBar, ToolBarItem, Icon } from 'mdo-react-components';

import { DataContainer } from '../../../components';
import { getText } from '../../../utils/localesHelpers';
import { ReceiveDescription } from '../styled';
import { usePaginatedDataTable } from '../../../components/PaginatedDataTable/usePaginatedDataTable';

export const PurchaseOrderPaginatedDataTable = memo((props) => {
  const { items, filtersApplied, dataRowsCount, obsoleteData, maintainPageOnUpdate, filtersActive, search, ...rest } =
    props;
  const { pageState, preparePage } = usePaginatedDataTable({
    items: items,
    maintainPageOnUpdate,
    filtersActive,
    search,
  });

  return (
    <>
      <DataContainer obsoleteData={obsoleteData}>
        <RecursiveDataTable {...rest} data={[{ children: pageState.data }]} allData={[{ children: items }]} />
      </DataContainer>
      <ToolBar>
        <ToolBarItem>
          <ReceiveDescription>
            <Icon name='CheckCircle' size={20} color='#338E4D' />
            <p>{` = ${getText('po.received')}`}</p>
          </ReceiveDescription>
        </ToolBarItem>
        <ToolBarItem toTheRight>
          <EnhancedPagination
            count={pageState.pagesCount}
            page={pageState.page}
            onChange={(page) => preparePage(page)}
          />
        </ToolBarItem>
      </ToolBar>
    </>
  );
});

PurchaseOrderPaginatedDataTable.displayName = 'PurchaseOrderPaginatedDataTable';

PurchaseOrderPaginatedDataTable.propTypes = {
  items: PropTypes.array,
  filtersApplied: PropTypes.number,
  dataRowsCount: PropTypes.number,
  addRecievedDescription: PropTypes.bool,
  obsoleteData: PropTypes.bool,

  ...RecursiveDataTable.propTypes,
};
