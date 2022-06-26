import React from 'react';
import { action } from '@storybook/addon-actions';
import { Switch } from './Switch';
import { colors } from '../../../theme/colors';

export const SwitchComponent = (args) => {
  return <Switch {...args} onChange={action('Switch checked')} />;
};

export default {
  title: 'Components/FormElements/Switch',
  component: Switch,
  argTypes: {
    labelFontWeight: {
      control: {
        type: 'text',
      },
      defaultValue: 'normal',
    },
    labelFontSize: {
      control: {
        type: 'number',
      },
      defaultValue: 16,
    },
    labelColor: {
      control: {
        type: 'color',
      },
      defaultValue: null,
    },
    value: {
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
    name: {
      control: {
        type: 'text',
      },
      defaultValue: 'switch',
    },
    backgroundColor: {
      control: {
        type: 'color',
      },
      defaultValue: null,
    },
    opacity: {
      control: {
        type: 'range',
        min: 0,
        max: 1,
        step: 0.01,
      },
      defaultValue: 0.38,
    },
    size: {
      control: {
        type: 'select',
        options: ['small', 'medium'],
      },
      defaultValue: 'small',
    },
    label: {
      control: {
        type: 'text',
      },
      defaultValue: 'switch',
    },
    labelPlacement: {
      options: Switch.labelPlacements,
      control: {
        type: 'select',
      },
      defaultValue: Switch.labelPlacements[2],
    },
    dataEl: {
      control: {
        type: 'text',
      },
      defaultValue: 'switch',
    },
    leftMarginSizeSmall: {
      control: {
        type: 'number',
      },
      defaultValue: 10,
    },
    rightMarginSizeSmall: {
      control: {
        type: 'number',
      },
      defaultValue: 10,
    },
    labelMarginLeft: {
      control: {
        type: 'number',
      },
      defaultValue: 10,
    },
  },
};
