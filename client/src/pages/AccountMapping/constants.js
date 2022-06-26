import React from 'react';
import { getText } from 'utils/localesHelpers';

export const mapAccountMappingSalesColumns = (items) => {
  const mapping = [
    {
      field: 'title',
      headerName: '',
      align: 'left',
      width: '200px',
      minWidth: '200px',
      onRender: ({ dataRow }) => {
        const { title, hasHorizontalTopBorder } = dataRow;
        // only some titles are bold
        if (hasHorizontalTopBorder) {
          // return <SectionHeader>{title}</SectionHeader>;
        }
        return title;
      },
      hasBorder: true,
    },
  ];
  items?.forEach((item, index) => {
    mapping.push({
      field: item,
      headerName: item,
      align: 'right',
      width: '100px',
      minWidth: '100px',
      headerAlign: 'center',
      bgColor: index % 2 ? false : true, // ignore this if recursive table has set hasStripes
      hasBorder: false, // calculate this if needed
    });
  });
  return mapping;
};

export const pageState = {
  ERROR: { state: 'ERROR' },
  // change this message for no data
  MESSAGE: { state: 'MESSAGE', message: getText('pnl.noPnLUnmappedFound') },
  LOADING: { state: 'LOADING' },
  DEFAULT: { state: 'MESSAGE', message: getText('generic.selectFilters') },
};

export const pageSize = 15;
