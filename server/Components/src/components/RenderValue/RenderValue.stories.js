import React from 'react';
import { RenderValue } from './index';
import theme from '../../theme/theme';

const { palette } = theme || {};
const colors = palette.common || {};

export const RenderValueComponent = (args) => {
  return <RenderValue {...args} />;
};

export default {
  title: 'Components/RenderValue',
  component: RenderValue,
  argTypes: {
    value: {
      control: {
        type: 'text',
      },
      defaultValue: '100',
    },
    displaySize: {
      control: {
        type: 'select',
        options: ['as-is', 'auto', 'k', 'm'],
      },
      defaultValue: 'auto',
    },
    valueDecimals: {
      control: {
        type: 'range',
        min: 0,
        max: 4,
        step: 1,
      },
      defaultValue: 2,
    },
    valueTypeId: {
      control: {
        type: 'select',
        options: [1, 2, 3],
      },
      defaultValue: 1,
    },
    valueFormat: {
      control: {
        type: 'text',
      },
      defaultValue: '',
    },
    noValueStr: {
      control: {
        type: 'text',
      },
      defaultValue: 'This value is not a number',
    },
    colorOnZero: {
      control: {
        type: 'color',
      },
      defaultValue: '',
    },
    colorOnNegative: {
      control: {
        type: 'color',
      },
      defaultValue: '',
    },
    colorOnPositive: {
      control: {
        type: 'color',
      },
      defaultValue: '',
    },
    colorOnNoValue: {
      control: {
        type: 'color',
      },
      defaultValue: '',
    },
    ignoreFormatSign: {
      control: {
        type: 'boolean',
      },
      defaultValue: null,
    },
  },
};
