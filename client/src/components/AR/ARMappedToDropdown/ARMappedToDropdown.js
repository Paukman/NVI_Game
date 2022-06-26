import React, { memo, useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { SearchableDropdown } from 'mdo-react-components';
import _ from 'lodash';
import { getText } from '../../../utils/localesHelpers';
import { pageSizes } from '../constants';
import { useHotelClientAccount } from '../../../graphql';

const ARMappedToDropdown = memo((props) => {
  const { MappedTo, loadingList, hotelClientAccountList } = useHotelClientAccount();
  const { label, placeholder, value, id, name, disabled, onChange, dataEl, disabledItems, tableDropDownFontSize } =
    props;

  const [isLoadMoreVisible, setIsLoadMoreVisible] = useState(false);
  const [chunk, setChunk] = useState([]);
  const [page, setPage] = useState(1);
  const [itemsMore, setItemsMore] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [searchedItems, setSearchedItems] = useState([]);
  const [fullDataList, setFullDataList] = useState([]);

  useEffect(() => {
    hotelClientAccountList({
      params: {
        keyword: '',
        accountName: '',
        managementStatusId: null,
      },
      pagination: {
        page: 1,
        pageSize: 1000,
      },
    });
  }, [hotelClientAccountList]);

  useEffect(() => {
    if (MappedTo?.data?.length > 0) {
      const newItems = [];
      const toExcludeMap = new Set();

      if (Array.isArray(disabledItems)) {
        disabledItems.forEach((item) => toExcludeMap.add(item));
      }
      newItems.push({
        label: 'Map this account...',
        value: 'null',
        disabled: value === null,
      });
      let valueElement;
      newItems.push(
        ...(MappedTo &&
          MappedTo.data
            .filter((mapped) => !toExcludeMap.has(mapped.id) || mapped.id === value)
            .map((mapped, index) => {
              if (mapped.id === value && index >= pageSizes.dropdownPageSize - 1) {
                valueElement = {
                  label: mapped.accountName,
                  value: mapped.id,
                  disabled: toExcludeMap.has(mapped.id),
                };
                return false;
              }
              return {
                label: mapped.accountName,
                value: mapped.id,
                disabled: toExcludeMap.has(mapped.id),
              };
            })
            .filter((b) => b !== false)),
      );

      if (valueElement?.value) {
        newItems.splice(0, 1, valueElement);
      }
      setFullDataList(newItems);
      const chunkNew = _.chunk(newItems, pageSizes.dropdownPageSize);
      if (chunkNew.length) {
        setIsLoadMoreVisible(page !== chunkNew.length);
        setItemsMore([...chunkNew[page - 1]]);
      }

      setChunk(chunkNew);
    }
  }, [MappedTo, value]);

  // this is called when searching.
  useEffect(() => {
    if (searchValue) {
      let searchedItems = _.filter(fullDataList, (item) => {
        const capitalItem = _.capitalize(item?.label);
        const capitalSearchValue = _.capitalize(searchValue);
        const regex = new RegExp(capitalSearchValue, 'i');
        return regex.test(capitalItem);
      });
      setSearchedItems(searchedItems);
      setIsLoadMoreVisible(false);
    } else {
      setIsLoadMoreVisible(page !== chunk.length);
    }
  }, [searchValue]);

  // this is called on when change pagination with load more
  useEffect(() => {
    if (chunk.length) {
      setIsLoadMoreVisible(page !== chunk.length);
      setItemsMore([...itemsMore, ...chunk[page - 1]]);
    }
  }, [page]);

  if (itemsMore?.length === 0 && searchedItems?.length === 0) {
    return <div>Loading...</div>;
  }
  return (
    <SearchableDropdown
      tableDropDownFontSize={tableDropDownFontSize}
      canLoadMore={isLoadMoreVisible}
      onLoadMore={(page) => {
        setPage(page);
      }}
      onChange={(name, value, event) => {
        onChange(name, value, event);
      }}
      value={value}
      onSearch={(value, event) => {
        // This way we can ommit updating search value on events like closing the searchable dropdown, etc.
        if (event?.type === 'change') {
          setSearchValue(value);
        } else {
          setSearchValue('');
        }
        if (event?.type === 'blur' && event?.target?.value == '') {
          onChange('blur', '', event);
        }
      }}
      pageSize={pageSizes.dropdownPageSize}
      page={page}
      items={searchValue ? searchedItems : itemsMore}
    />
  );
});

ARMappedToDropdown.displayName = 'ARMappedToDropdown';

ARMappedToDropdown.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  disabledItems: PropTypes.arrayOf(PropTypes.number),
  dataEl: PropTypes.string,
  tableDropDownFontSize: PropTypes.bool,
};

ARMappedToDropdown.defaultProps = {
  dataEl: 'ARMappedToDropdown',
};

export { ARMappedToDropdown };
