import React, { useState } from 'react';
import { RadioGroup } from './RadioGroup';
import { action } from '@storybook/addon-actions';

const data = [
  { value: 'amountType', label: 'Amount Type' },
  { value: 'kpi', label: 'KPI' },
];

export const RadioGroupComponent = (args) => {
  const [selected, setSelected] = useState();
  return (
    <RadioGroup
      {...args}
      value={selected}
      onChange={(name, value) => {
        action('Radio Button Selected')({ name, value });
        setSelected(value);
      }}
    />
  );
};

export default {
  title: 'Components/FormElements/RadioGroup',
  component: RadioGroup,
  argTypes: {
    id: {
      control: {
        type: 'text',
      },
      defaultValue: 'radiogroup',
    },
    formLabel: {
      control: {
        type: 'text',
      },
      defaultValue: '',
    },
    disableRipple: {
      control: {
        type: 'boolean',
      },
      defaultValue: true,
    },
    name: {
      control: {
        type: 'text',
      },
      defaultValue: 'radioGroup',
    },
    dataEl: {
      control: {
        type: 'text',
      },
      defaultValue: '',
    },
    isVertical: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    buttonsCfg: {
      control: {
        type: 'object',
      },
      defaultValue: [...data],
    },
    defaultValue: {
      control: {
        type: 'text',
      },
      defaultValue: 'amountType',
    },
  },
};
