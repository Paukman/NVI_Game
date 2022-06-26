import React, { useEffect, useState } from 'react';
import { action } from '@storybook/addon-actions';
import { SearchableDropdown } from './SearchableDropdown';
import { range, capitalize } from 'lodash';

const items = {
  1: [
    {
      label: 'The Shawshank Redemption',
      name: 'The Shawshank Redemption (Name)',
      value: '1',
    },
    {
      label: 'The Godfather',
      name: 'The Godfather (Name)',
      value: '2',
    },
    {
      label: 'Apple Godfather',
      name: 'Apple Godfather (Name)',
      value: '3',
    },
    {
      label: 'The Dark Knight',
      name: 'The Dark Knight (Name)',
      value: '4',
    },
    ...range(0, 46).map((item, index) => ({
      label: `The Dark Knight ${index + 5}`,
      name: 'The Dark Knight (Name)',
      value: (index + 5).toString(),
    })),
  ],
  2: [
    ...range(0, 50).map((item, index) => ({
      label: `The Knight ${index + 5}`,
      name: 'The Knight (Name)',
      value: (index + 5).toString(),
    })),
  ],
  3: [
    ...range(0, 50).map((item, index) => ({
      label: `The night ${index + 5}`,
      name: 'The night (Name)',
      value: (index + 5).toString(),
    })),
  ],
  4: [],
};

const appSettings = { pageSize: 50 };
const allItems = Object.keys(items).reduce((acc, value) => {
  return [...acc, ...items[value]];
}, []);

export const SearchableDropdownComponent = (args) => {
  const [value, setValue] = useState('');
  let tableDropDownFontSize =
    args.tableDropDownFontSize > 0 ? args.tableDropDownFontSize : args.tableDropDownFontSizeBool;
  const props = { ...args, tableDropDownFontSize };
  return (
    <SearchableDropdown
      {...props}
      value={value}
      items={allItems}
      onChange={(name, value) => {
        setValue(value);
        action('User made change')({ name, value });
      }}
    />
  );
};

export const SearchableDropdownWithPaginationComponent = (args) => {
  const [value, setValue] = useState('');
  const [page, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [itemsMore, setItemsMore] = useState([]);
  const [searchedItems, setSearchedItems] = useState([]);
  const [hasPageValue, setHasPageValue] = useState(false);
  /**Calculate range of count of values wich will be added */
  /** Add coming values to existing values */
  /** Fetch searched values. it will be come by query in FE */
  useEffect(() => {
    if (searchValue) {
      let searchedValues = itemsMore.filter((item) => {
        const capitalItem = capitalize(item?.label);
        const capitalSearchValue = capitalize(searchValue);
        return capitalItem.search(capitalSearchValue) > -1;
      });
      if (searchedValues.length === 0) {
        searchedValues = allItems.filter((item) => {
          const capitalItem = capitalize(item?.label);
          const capitalSearchValue = capitalize(searchValue);
          return capitalItem.search(capitalSearchValue) > -1;
        });
      }
      setSearchedItems(searchedValues);
    } else {
      setSearchedItems([]);
      setHasPageValue(items[page].length !== 0);
      setItemsMore([...itemsMore, ...items[page]]);
    }
  }, [searchValue, setItemsMore, page, setHasPageValue, setSearchedItems, allItems]);

  let tableDropDownFontSize =
    args.tableDropDownFontSize > 0 ? args.tableDropDownFontSize : args.tableDropDownFontSizeBool;
  const props = { ...args, tableDropDownFontSize };

  return (
    <SearchableDropdown
      {...props}
      value={value}
      onSearch={setSearchValue}
      items={searchValue ? searchedItems : itemsMore}
      canLoadMore={hasPageValue}
      onChange={(name, value) => {
        setValue(value);
        action('User made change')({ name, value });
      }}
      pageSize={appSettings.pageSize}
      page={page}
      onLoadMore={(a) => {
        setPage(a);
      }}
    />
  );
};

export default {
  title: 'Components/FormElements/SearchableDropdown',
  component: SearchableDropdown,
  argTypes: {
    tableDropDownFontSize: {
      control: {
        type: 'number',
      },
      defaultValue: null,
    },
    tableDropDownFontSizeBool: {
      control: {
        type: 'boolean',
      },
      defaultValue: null,
    },
    id: {
      control: {
        type: 'text',
      },
      defaultValue: 'dropdownId',
    },
    name: {
      control: {
        type: 'text',
      },
      defaultValue: 'dropdownName',
    },
    label: {
      control: {
        type: 'text',
      },
      defaultValue: 'Searchable Dropdown',
    },
    required: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    error: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    inProgress: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    disabled: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    disableClearable: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    itemName: {
      control: {
        type: 'text',
      },
      defaultValue: 'label',
    },
    useSimpleValue: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    error: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    helperText: {
      control: {
        type: 'text',
      },
      defaultValue: 'Helper Text',
    },
    onChange: {
      control: {
        disabled: true,
      },
    },
    timeOfTyping: {
      control: {
        type: 'number',
      },
      defaultValue: 5000,
    },
    setSearchIcon: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
  },
};
