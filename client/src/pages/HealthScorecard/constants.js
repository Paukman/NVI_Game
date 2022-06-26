import { getText } from 'utils/localesHelpers';

export const mapHealthScorecardColumns = (columnCfg, borderIndexes = []) => {
  const mapping = [
    {
      field: 'name',
      headerName: 'Property',
      align: 'left',
      width: '200px',
      minWidth: '200px',
      hasBorder: true,
      sortable: true,
    },
  ];
  columnCfg?.forEach((item, index) => {
    mapping.push({
      field: item.title,
      headerName: item.title?.split(':')?.[1],
      align: 'right',
      width: '100px',
      minWidth: '100px',
      headerAlign: 'center',
      hasBorder: borderIndexes?.length && borderIndexes?.includes(index + 1) && true,
      bgColor: index % 2 ? false : true,
      sortable: true,
    });
  });
  return mapping;
};

export const pageState = {
  ERROR: { state: 'ERROR' },
  // change this message for no data
  NO_DATA: { state: 'MESSAGE', message: getText('healthScroreCard.noHealthScoreCard') },
  LOADING: { state: 'LOADING' },
  DEFAULT: { state: 'MESSAGE', message: getText('generic.selectFilters') },
  SORTING: { state: 'SORTING' },
};

// replace with your items
export const PERIOD_ITEMS = {
  MTD: {
    label: 'MTD',
    value: getText('selectors.periods.MTD'),
  },
  YTD: {
    label: 'YTD',
    value: getText('selectors.periods.YTD'),
  },
  MONTH: {
    label: 'MONTH',
    value: getText('selectors.periods.MONTH'),
  },
  YEAR: {
    label: 'YEAR',
    value: getText('selectors.periods.YEAR'),
  },
};
