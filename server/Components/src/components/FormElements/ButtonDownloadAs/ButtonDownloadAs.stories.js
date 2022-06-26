import React from 'react';
import { ButtonDownloadAs } from './ButtonDownloadAs';

export const DowndloadAsButtonComponent = (args) => {
  return <ButtonDownloadAs {...args} />;
};

export default {
  title: 'Components/FormElements/ButtonDownloadAs',
  component: ButtonDownloadAs,
  argTypes: {
    text: {
      control: {
        type: 'text',
      },
    },
    iconName: {
      control: {
        type: 'text',
        disable: true,
      },
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
    width: {
      control: {
        type: 'text',
      },
      defaultValue: 'auto',
    },
    disabled: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    exclude: {
      options: ButtonDownloadAs.options,
      control: {
        type: 'check',
      },
    },
    include: {
      control: {
        type: 'object',
      },
      defaultValue: [{ label: 'Missing Dates', value: 'missingDates', icon: '' }],
    },
  },
};
