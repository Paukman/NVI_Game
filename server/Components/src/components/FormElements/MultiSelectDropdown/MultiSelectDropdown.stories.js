import React from 'react';
import { action } from '@storybook/addon-actions';
import { MultiSelectDropdown } from './MultiSelectDropdown';
import { range } from 'lodash';

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

const allItems = Object.keys(items).reduce((acc, value) => {
  return [...acc, ...items[value]];
}, []);

export const SearchableDropdownComponent = (args) => {
  const [value, setValue] = React.useState([
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
  ]);

  return (
    <MultiSelectDropdown
      {...args}
      items={allItems}
      value={value}
      onChange={(name, value, event) => {
        setValue(value);
        action('User made change')({ name, value, event });
      }}
    />
  );
};

export default {
  title: 'Components/FormElements/MultiSelectDropdown',
  component: MultiSelectDropdown,
  argTypes: {
    tableDropDownFontSize: {
      control: {
        type: 'number',
      },
      defaultValue: 14,
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
      defaultValue: 'MultiSelect Dropdown',
    },
    placeholder: {
      control: {
        type: 'text',
      },
      defaultValue: null,
    },
    isOutlined: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
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
  },
};
