import React from 'react';
import { SectionHeader } from './styled';
import { getText } from 'utils/localesHelpers';

export const mapStrDefaultReportColumns = (subHeaderDates, borderIndexes = []) => {
  const mapping = [
    {
      field: 'title',
      headerName: '',
      align: 'left',
      width: '200px',
      minWidth: '200px',
      onRender: ({ dataRow }) => {
        const { title, hasHorizontalTopBorder } = dataRow;
        if (hasHorizontalTopBorder) {
          return <SectionHeader>{title}</SectionHeader>;
        }
        return title;
      },
      hasBorder: true,
    },
  ];
  subHeaderDates?.forEach((date, index) => {
    mapping.push({
      field: date,
      headerName: date,
      align: 'right',
      width: '100px',
      minWidth: '100px',
      headerAlign: 'center',
      bgColor: index % 2 ? false : true,
      hasBorder: borderIndexes && borderIndexes.length && borderIndexes.includes(index + 1) && true,
    });
  });
  return mapping;
};

export const mode = {
  fourWeeks: 0,
  fiftyTwoWeeks: 1,
};

export const pageState = {
  ERROR: { state: 'ERROR' },
  MESSAGE: { state: 'MESSAGE', message: getText('strReports.noStrReport') },
  LOADING: { state: 'LOADING' },
  DEFAULT: { state: 'MESSAGE', message: getText('generic.selectFilters') },
};
