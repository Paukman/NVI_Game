import React, { memo, useEffect, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { BaseList } from './BaseList';
import { Search } from '../FormElements/Search';
import { Pagination } from '../Pagination';

import { buildAttributes } from '../../utils/formHelpers';

import { search } from '../../utils/misc';

import { ListTextSearchContainer, ListTextSearchInput, ListTextSearchItems, ListTextSearchPagination } from './styled';

const calcPagesCount = (items, pageSize) => {
  return Math.ceil(items.length / pageSize);
};

/**
 * This is a smart list item that can render children if and and has its own state
 */
const ListTextSearch = memo((props) => {
  const { value, items, label, selectedId, dataEl, keyword, timeoutMs, pageSize, ...rest } = props;
  const [state, setState] = useState({
    page: 1,
    pagesCount: 1,
    data: [],
  });

  const [inKeyword, setInKeyword] = useState(keyword);
  const [filteredItems, setFilteredItems] = useState([]);

  const setPage = useCallback(
    (page) => {
      if (Array.isArray(filteredItems)) {
        const start = (page - 1) * pageSize;
        const end = Math.min(filteredItems.length, start + pageSize);
        const data = [];

        for (let idx = start; idx < end; idx++) {
          data.push(filteredItems[idx]);
        }

        setState({
          page,
          pagesCount: calcPagesCount(filteredItems, pageSize),
          data,
        });
      }
    },
    [filteredItems, pageSize],
  );

  useEffect(() => {
    setPage(1);
  }, [setPage]);

  useEffect(() => {
    const newItems = items.filter((item) => {
      if (!inKeyword) {
        return true;
      }

      if (item.primary && search(item.primary, inKeyword) !== -1) {
        return true;
      }

      if (item.secondary && search(item.secondary, inKeyword) !== -1) {
        return true;
      }

      if (item.label && search(item.label, inKeyword) !== -1) {
        return true;
      }

      return false;
    });
    setFilteredItems(newItems);
  }, [items, inKeyword]);

  useEffect(() => {
    // we need to update the inner keyword in case we have updated keyword coming from props
    if (inKeyword !== keyword) {
      setInKeyword(keyword);
    }
  }, [keyword]); // eslint-disable-line

  return (
    <ListTextSearchContainer {...buildAttributes(props, ['id', 'dataEl', 'height', 'flex'])}>
      <ListTextSearchInput>
        <Search
          label={label}
          value={keyword}
          dataEl={`${dataEl}-search`}
          timeoutMs={timeoutMs}
          onChange={(name, value) => {
            setInKeyword(value);
          }}
        />
      </ListTextSearchInput>
      <ListTextSearchItems>
        <BaseList dataEl={`${dataEl}-list`} items={state.data} selectedId={selectedId} {...rest} />
      </ListTextSearchItems>
      <ListTextSearchPagination>
        <Pagination count={state.pagesCount} page={state.page} onChange={(page) => setPage(page)} />
      </ListTextSearchPagination>
    </ListTextSearchContainer>
  );
});

ListTextSearch.displayName = 'ListTextSearch';

ListTextSearch.propTypes = {
  ...BaseList.prototype,
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  flex: PropTypes.string,
  value: PropTypes.string,
  label: PropTypes.string,
  dataEl: PropTypes.string,
  selectedId: PropTypes.any,
  keyword: PropTypes.string,
  timeoutMs: PropTypes.number,
  pageSize: PropTypes.number,
};

ListTextSearch.defaultProps = {
  value: '',
  pageSize: 50,
};

export { ListTextSearch };
