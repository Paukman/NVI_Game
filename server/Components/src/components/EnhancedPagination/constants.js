export const leftButtons = (color) => {
  return [
    {
      clickId: 'first',
      text: '',
      variant: 'tertiary',
      iconName: 'FirstPage',
      iconColor: color,
      iconSize: 24,
      dataEl: 'firstPageIcon',
      marginRight: -10,
      marginLeft: 32,
    },
    {
      clickId: 'left',
      text: '',
      variant: 'tertiary',
      iconName: 'ChevronLeft',
      iconColor: color,
      iconSize: 24,
      dataEl: 'chevronLeftIcon',
      marginRight: 12,
    },
  ];
};

export const rightButtons = (color) => {
  return [
    {
      clickId: 'right',
      text: '',
      variant: 'tertiary',
      iconName: 'ChevronRight',
      iconColor: color,
      iconSize: 24,
      dataEl: 'chevronRightIcon',
      marginRight: -10,
    },
    {
      clickId: 'last',
      text: '',
      variant: 'tertiary',
      iconColor: color,
      iconName: 'LastPage',
      iconSize: 24,
      dataEl: 'lastPageIcon',
    },
  ];
};

export const buttonSearchPage = (color) => {
  return {
    clickId: 'search',
    text: '',
    variant: 'tertiary',
    iconName: 'FindInPage',
    iconColor: color,
    iconSize: 24,
    dataEl: 'searchPageIcon',
  };
};
