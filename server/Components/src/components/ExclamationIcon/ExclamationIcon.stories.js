import React from 'react';
import { ExclamationIcon } from './ExclamationIcon';

const data = ['6/15/2021', '5/30/2021', '5/29/2021'];

export const ExclamationIconComponent = (args) => {
  return <ExclamationIcon {...args} data={data} />;
};

export default {
  title: 'Components/ExclamationIcon',
  component: ExclamationIcon,
  argTypes: {
    title: {
      control: {
        type: 'text',
      },
      defaultValue: 'Missing Dates',
    },
  },
};
