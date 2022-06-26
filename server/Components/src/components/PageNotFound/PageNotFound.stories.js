import React from 'react';
import PageNotFound from './PageNotFound';

export const PageNotFoundComponent = (args) => {
  return <PageNotFound {...args}></PageNotFound>;
};

export default {
  title: 'Components/PageNotFound',
  component: PageNotFound,
  argTypes: {
    bgColor: {
      control: {
        type: 'text',
      },
      defaultValue: 'white',
    },
    bgImage: {
      control: {
        type: 'text',
      },
      defaultValue: '',
    },
    children: {
      control: {
        type: 'text',
      },
      defaultValue: '',
    },
  },
};
