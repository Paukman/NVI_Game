import React, { useContext } from 'react';
import { getText } from '../../utils/localesHelpers';
import { DictionaryValue, KpiActions } from '../../components';

export const organizationsColumnsConfig = () => {
  return [
    {
      field: 'id',
      headerName: getText('generic.id'),
      align: 'left',
      width: 60,
      sortable: true,
    },
    {
      field: 'companyName',
      headerName: getText('company.companyName'),
      align: 'left',
      width: 250,
      sortable: true,
    },
    {
      field: 'country',
      headerName: getText('address.country'),
      width: 200,
      sortable: false,
      align: 'left',
    },
    {
      field: 'state',
      headerName: getText('address.state'),
      width: 200,
      sortable: false,
      align: 'left',
    },
    {
      field: 'city',
      headerName: getText('address.city'),
      width: 200,
      sortable: false,
      align: 'left',
    },
    {
      field: 'address1',
      headerName: getText('address.address1'),
      width: 200,
      sortable: false,
      align: 'left',
    },
    {
      field: 'address2',
      headerName: getText('address.address2'),
      width: 200,
      sortable: false,
      align: 'left',
    },
    {
      field: 'email',
      headerName: getText('address.email'),
      width: 200,
      sortable: false,
      align: 'left',
    },
    {
      field: 'phoneNumber',
      headerName: getText('address.phoneNumber'),
      width: 200,
      sortable: false,
      align: 'left',
    },
  ];
};
