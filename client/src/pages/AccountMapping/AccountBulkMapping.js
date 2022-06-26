import React, { memo, useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { DialogCard, DialogContent, Button, SearchableDropdown } from 'mdo-react-components';
import { ButtonGroup } from '../ProfitAndLoss/styled';
import { getText } from '../../utils/localesHelpers';
import { SearchDropdown, SearchDropdownButton } from './styled';
import _ from 'lodash';
import { pageSize } from './constants';

const AccountBulkMapping = memo((props) => {
  const [value, setValue] = useState('');
  const [page, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [itemsMore, setItemsMore] = useState([]);
  const [searchedItems, setSearchedItems] = useState([]);
  const [hasPageValue, setHasPageValue] = useState(false);
  const [chunk, setChunk] = useState([]);

  const { onClose, data, onApply } = props;

  // map data to match dropdown on first run
  useEffect(() => {
    const allItems = _.map(data, (val) => ({
      label: val.accountName,
      value: val.id,
    }));

    const chunk = _.chunk(allItems, pageSize);
    if (chunk.length) {
      setHasPageValue(page !== chunk.length);
      setItemsMore([...chunk[page - 1]]);
    }

    setChunk(chunk);
  }, [data]);

  // this is called when searching.
  useEffect(() => {
    if (searchValue) {
      let searchedItems = _.filter(itemsMore, (item) => {
        const capitalItem = _.capitalize(item?.label);
        const capitalSearchValue = _.capitalize(searchValue);
        const regex = new RegExp(capitalSearchValue, 'i');
        return regex.test(capitalItem);
      });
      setSearchedItems(searchedItems);
      setHasPageValue(false);
    } else {
      setHasPageValue(page !== chunk.length);
    }
  }, [searchValue]);

  // this is called on when change pagination with load more
  useEffect(() => {
    if (chunk.length) {
      setHasPageValue(page !== chunk.length);
      setItemsMore([...itemsMore, ...chunk[page - 1]]);
    }
  }, [page]);

  return (
    <DialogCard open={open} maxWidth='lg'>
      <DialogContent>
        <SearchDropdown>
          <SearchableDropdown
            canLoadMore={hasPageValue}
            onLoadMore={(page) => {
              setPage(page);
            }}
            onChange={(name, value) => {
              setValue(value);
            }}
            value={value}
            onSearch={(value) => setSearchValue(value)}
            pageSize={pageSize}
            page={page}
            label={getText('generic.search')}
            setSearchIcon
            items={searchValue ? searchedItems : itemsMore}
          />
        </SearchDropdown>
        <SearchDropdownButton>
          <ButtonGroup>
            <Button
              variant='default'
              text={getText('generic.cancel')}
              onClick={() => {
                onClose();
              }}
            />
            <Button
              variant='success'
              text={getText('generic.save')}
              onClick={() => {
                onApply(value);
              }}
              disabled={!value}
            />
          </ButtonGroup>
        </SearchDropdownButton>
      </DialogContent>
    </DialogCard>
  );
});
AccountBulkMapping.displayName = 'AccountBulkMapping';

AccountBulkMapping.propTypes = {
  filters: PropTypes.array,
  onApply: PropTypes.func,
  onCancel: PropTypes.func,
};

export { AccountBulkMapping };
