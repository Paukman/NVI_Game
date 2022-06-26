import React, { useState } from 'react';

import Pagination from './Pagination';

export const PaginationComponent = (args) => {
  const [page, setPage] = useState(args.page);
  return (
    <Pagination
      {...args}
      page={page}
      onChange={(newPage) => {
        setPage(newPage);
      }}
    />
  );
};

export default {
  title: 'Components/Pagination',
  component: Pagination,
  argTypes: {
    count: {
      control: {
        type: 'number',
      },
      defaultValue: 10,
    },
    page: {
      control: {
        type: 'number',
      },
      defaultValue: 2,
    },
    onChange: {
      control: {
        disabled: true,
      },
    },
  },
};
