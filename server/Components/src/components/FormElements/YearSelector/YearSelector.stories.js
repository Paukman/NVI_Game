import React from 'react';
import { action } from '@storybook/addon-actions';
import { YearSelector } from './YearSelector';

export const YearSelectorComponent = (args) => {
  return <YearSelector {...args} onChange={action('YearSelector Changed')} />;
};

export const WithOutYears = (args) => {
  return <YearSelector {...args} />;
};

export default {
  title: 'Components/FormElements/YearSelector',
  component: YearSelector,
  argTypes: {
    label: {
      control: {
        type: 'text',
      },
      defaultValue: 'Year',
    },
    id: {
      control: {
        type: 'text',
      },
      defaultValue: 'year',
    },
    value: {
      control: {
        type: 'text',
      },
      defaultValue: `${new Date().getFullYear()}`,
    },
    disabled: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    yearsSince: {
      control: {
        type: 'number',
      },
      defaultValue: new Date().getFullYear() - 10,
    },
    yearsTo: {
      control: {
        type: 'number',
      },
      defaultValue: new Date().getFullYear(),
    },
    maxHeight: {
      control: {
        type: 'text',
      },
      defaultValue: '200px',
    },
  },
};
