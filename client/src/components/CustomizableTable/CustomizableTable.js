import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { RecursiveDataTable, ToolBar, ToolBarItem, EnhancedPagination } from 'mdo-react-components';
import { DataContainer } from 'components';
import { usePaginatedDataTable } from '../../components/PaginatedDataTable/usePaginatedDataTable';
import { CreateHeaders } from './utils';
//  { isEqual } from 'lodash';

// const arePropsEqual = (prevProps, nextProps) => {
//   const equalComparisson =
//     isEqual(prevProps.expandCollapePlacement, nextProps.expandCollapePlacement) &&
//     isEqual(prevProps.editable, nextProps.editable) &&
//     isEqual(prevProps.tableHeight, nextProps.tableHeight);

//   const items = isEqual(prevProps.items, nextProps.items);
//   const subHeaders = isEqual(prevProps.subHeaders, nextProps.subHeaders);
//   return equalComparisson && items && subHeaders;
// };

export const CustomizableTable = memo((props) => {
  const { items, isPaginated = false, editable = false, tableHeight, maintainPageOnUpdate, filters, ...rest } = props;
  const { pageState, preparePage } = usePaginatedDataTable({
    items: items,
    maintainPageOnUpdate,
    filters,
  });

  return (
    <>
      <DataContainer tableHeight={tableHeight}>
        <RecursiveDataTable
          {...rest}
          headers={editable && [CreateHeaders(props)]}
          data={[{ children: isPaginated ? pageState.data : items }]}
          allData={[{ children: items }]}
        />
      </DataContainer>
      {isPaginated && (
        <ToolBar>
          <ToolBarItem toTheRight>
            <EnhancedPagination
              count={pageState.pagesCount}
              page={pageState.page}
              onChange={(page) => preparePage(page)}
            />
          </ToolBarItem>
        </ToolBar>
      )}
    </>
  );
});

CustomizableTable.displayName = 'CustomizableTable';

CustomizableTable.propTypes = {
  items: PropTypes.array,
  isPaginated: PropTypes.bool,
  editable: PropTypes.bool,
  tableHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  ...RecursiveDataTable.propTypes,
};
