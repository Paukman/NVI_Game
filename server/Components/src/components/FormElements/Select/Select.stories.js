import React, { useState } from 'react';
import { Select } from './Select';
import { action } from '@storybook/addon-actions';
import { items, selectedItems } from './data';

export const SelectSingleSelectionComponent = (args) => {
  const [value, setValue] = useState(1);

  return (
    <Select
      items={items}
      value={value}
      onChange={(name, value) => {
        action('Option selected: ')({ name, value });
        setValue(value);
      }}
      {...args}
    />
  );
};

export const SelectMultipleSelectionComponent = (args) => {
  const [value, setValue] = useState(selectedItems);

  return (
    <Select
      items={items}
      value={value}
      onChange={(name, value) => {
        action('Option selected: ')({ name, value });
        setValue(value);
      }}
      multiple
      {...args}
    />
  );
};

export default {
  title: 'Components/FormElements/Select',
  component: Select,
  argTypes: {
    canSelectAll: {
      control: {
        type: 'boolean',
      },
      defaultValue: true,
    },
    disabled: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    errorMsg: {
      control: {
        type: 'text',
      },
      defaultValue: '',
    },
    itemLabelName: {
      control: {
        type: 'text',
      },
      defaultValue: 'label',
    },
    itemValueName: {
      control: {
        type: 'text',
      },
      defaultValue: 'value',
    },
    name: {
      control: {
        type: 'text',
      },
      defaultValue: 'toHotelIds',
    },
    id: {
      control: {
        type: 'text',
      },
      defaultValue: 'toHotelIds',
    },
    labelText: {
      control: {
        type: 'text',
      },
      defaultValue: 'Select Properties',
    },
    selectAllLabel: {
      control: {
        type: 'text',
      },
      defaultValue: 'Select All',
    },
    variant: {
      options: Select.variants,
      control: {
        type: 'select',
      },
      defaultValue: Select.variants[0],
    },
    native: {
      control: {
        type: 'boolean',
      },
      defaultValue: true,
    },
    height: {
      control: {
        type: 'text',
      },
      defaultValue: 'auto',
    },
  },
};
