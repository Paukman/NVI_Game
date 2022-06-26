import React from 'react';
import PageLoading from './PageLoading';
import Progress from '../Progresses/Progress';

export const PageLoadingComponent = (args) => {
  return <PageLoading open={open} {...args} />;
};

export default {
  title: 'Components/PageLoading',
  component: PageLoading,
  argTypes: {
    open: {
      control: {
        type: 'boolean',
      },
      defaultValue: true,
    },
    type: {
      control: {
        type: 'select',
        options: Progress.types,
      },
      defaultValue: Progress.types[1],
    },
    size: {
      control: {
        type: 'text',
      },
      defaultValue: '64px',
    },
  },
};
