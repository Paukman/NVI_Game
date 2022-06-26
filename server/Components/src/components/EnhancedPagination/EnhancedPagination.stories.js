import React, { useEffect, useState } from 'react';
import { action } from '@storybook/addon-actions';

import EnhancedPagination from './EnhancedPagination';

export const actionsData = {
  onChange: action('onChange'),
};

export const PaginationComponent = (args) => {
  const [pageNo, updatePageNo] = useState(args.initialPage);
  const onChange = (page) => {
    updatePageNo(page);
  };

  useEffect(() => {
    updatePageNo(args.initialPage);
  }, [args.initialPage]);

  return <EnhancedPagination {...args} page={pageNo} onChange={onChange} />;
};

export default {
  title: 'Components/EnhancedPagination',
  component: EnhancedPagination,
  argTypes: {
    onChange: { action: 'onChange' },
    count: {
      control: {
        type: 'number',
      },
      defaultValue: 10,
    },
    initialPage: {
      control: {
        type: 'number',
      },
      defaultValue: 1,
    },
    fontSize: {
      control: {
        type: 'text',
      },
      defaultValue: '14px',
    },
    fontWeight: {
      control: {
        type: 'text',
      },
      defaultValue: 'normal',
    },
    color: {
      control: {
        type: 'text',
      },
      defaultValue: 'black',
    },
  },
};
