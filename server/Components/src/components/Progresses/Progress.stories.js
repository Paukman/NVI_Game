import React from 'react';
import { Progress } from './index';

export const ProgressComponent = (args) => {
  return <Progress {...args} />;
};

export default {
  title: 'Components/Progresses',
  component: Progress,
  argTypes: {
    size: {
      control: {
        type: 'number',
      },
    },
    value: {
      control: {
        type: 'number',
      },
      defaultValue: 20,
    },
    maxValue: {
      control: {
        type: 'number',
      },
      defaultValue: 200,
    },
    type: {
      control: {
        type: 'select',
        options: Progress.types,
      },
      defaultValue: Progress.types[0],
    },
    showValue: {
      control: {
        type: 'boolean',
      },
      defaultValue: true,
    },
    doFit: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    colorBar: {
      control: {
        type: 'text',
      },
      defaultValue: 'red',
    },
  },
};
