import { getText } from '../../utils/localesHelpers';

export const columnsConfig = () => {
  return [
    {
      field: 'id',
      headerName: getText('generic.id'),
      align: 'left',
      width: 60,
      sortable: true,
    },
    {
      field: 'groupName',
      headerName: getText('hotelGroup.groupName'),
      align: 'left',
      width: 'auto',
      sortable: true,
    },
  ];
};
