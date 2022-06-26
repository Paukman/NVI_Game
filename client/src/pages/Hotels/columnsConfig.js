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
      field: 'hotelCode',
      headerName: getText('hotel.hotelCode'),
      align: 'left',
      width: 100,
      sortable: true,
    },
    {
      field: 'hotelName',
      headerName: getText('hotel.hotelName'),
      align: 'left',
      width: 'auto',
      sortable: true,
    },
    {
      field: 'country',
      headerName: getText('address.country'),
      align: 'left',
      width: 80,
      sortable: true,
    },
    {
      field: 'city',
      headerName: getText('address.city'),
      align: 'left',
      width: 120,
      sortable: true,
    },
    {
      field: 'postalCode',
      headerName: getText('address.postalCode'),
      align: 'left',
      width: 120,
      sortable: true,
    },
    {
      field: 'availableRoomQty',
      headerName: getText('hotel.availableRoomQty'),
      align: 'left',
      width: 120,
      sortable: true,
    },
  ];
};
