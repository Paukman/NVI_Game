import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';
import { InputDate } from './InputDate';
import { colors } from '../../../theme/colors';

export const InputDateComponent = (args) => {
  return <InputDate {...args} onChange={action('InputDate changed')} />;
};

export default {
  title: 'Components/FormElements/InputDate',
  component: InputDate,
  argTypes: {
    width: {
      control: {
        type: 'number',
      },
      defaultValue: 0,
    },
    iconPadding: {
      control: {
        type: 'number',
      },
      defaultValue: 12,
    },
    height: {
      control: {
        type: 'number',
      },
      defaultValue: 0,
    },
    fontSize: {
      control: {
        type: 'number',
      },
      defaultValue: 0,
    },
    fontWeight: {
      control: {
        type: 'text',
      },
      defaultValue: 'normal',
    },
    fontColor: {
      control: {
        type: 'color',
      },
      defaultValue: colors.black,
    },
    labelSize: {
      control: {
        type: 'number',
      },
      defaultValue: 0,
    },

    labelWeight: {
      control: {
        type: 'text',
      },
      defaultValue: 'normal',
    },

    labelColor: {
      control: {
        type: 'color',
      },
      defaultValue: colors.grey,
    },

    iconSize: {
      control: {
        type: 'number',
      },
      defaultValue: 0,
    },
    id: {
      control: {
        type: 'text',
      },
      defaultValue: 'date',
    },
    label: {
      control: {
        type: 'text',
      },
      defaultValue: 'Select date',
    },
    value: {
      control: {
        type: 'date',
      },
      defaultValue: new Date(),
    },
    variant: {
      options: InputDate.variants,
      control: {
        type: 'select',
      },
      defaultValue: InputDate.variants[0],
    },
    minDate: {
      control: {
        type: 'date',
      },
      defaultValue: null,
    },
    maxDate: {
      control: {
        type: 'date',
      },
      defaultValue: null,
    },
    disabled: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    autoClose: {
      control: {
        type: 'boolean',
      },
      defaultValue: true,
    },
  },
};
