import React from 'react';
import { Currency } from './Currency';

export const CurrencyComponent = (args) => {
  return <Currency {...args} />;
};

export default {
  title: 'Components/Currency',
  component: Currency,
  argTypes: {
    value: {
      control: {
        type: 'number',
      },
      defaultValue: -45.277444444444444444434,
    },
    valueOnNaN: {
      control: {
        type: 'text',
      },
      defaultValue: 'N/A',
    },
    decimals: {
      control: {
        type: 'number',
        min: 0,
      },
      defaultValue: 2,
    },
    id: {
      control: {
        type: 'text',
      },
      defaultValue: 'currency',
    },
  },
};
