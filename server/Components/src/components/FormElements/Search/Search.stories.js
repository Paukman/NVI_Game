import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';
import { Search } from './Search';

export const SearchComponent = (args) => {
  const [value, setValue] = useState('');
  return (
    <Search
      {...args}
      name='search'
      value={value}
      onChange={(name, value) => {
        action('Search changed')({ name, value });
        setValue(value);
      }}
    />
  );
};

export default {
  title: 'Components/FormElements/Search',
  component: Search,
  argTypes: {
    label: {
      control: {
        type: 'text',
      },
      defaultValue: 'Search',
    },
    title: {
      control: {
        type: 'text',
      },
      defaultValue: 'Button',
    },
    dataEl: {
      control: {
        type: 'text',
      },
      defaultValue: 'Button',
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
      defaultValue: 'HelperText/Hint',
    },
  },
};
