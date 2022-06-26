import React from 'react';
import { action } from '@storybook/addon-actions';
import { ButtonFilter } from './ButtonFilter';

export const ButtonFilterComponent = (args) => {
  const { onReset, ...rest } = args;
  return (
    <ButtonFilter
      {...rest}
      onReset={onReset ? action('Reset clicked') : null}
      onClick={action('Filters button clicked')}
    />
  );
};

export default {
  title: 'Components/FormElements/ButtonFilter',
  component: ButtonFilter,
  argTypes: {
    filtersSelected: {
      control: {
        type: 'number',
        min: 0,
      },
      defaultValue: 0,
    },
    onReset: {
      control: {
        type: 'boolean',
      },
      defaultValue: true,
    },
    resetText: {
      control: {
        type: 'text',
      },
      defaultValue: 'Reset',
    },
    disabled: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
  },
};
