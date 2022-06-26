import React, { useContext } from 'react';
import { getText } from '../../utils/localesHelpers';
import { DictionaryValue, KpiActions } from '../../components';
import { LinkActions } from 'mdo-react-components';

export const usersColumnsConfig = (props) => {
  const { handleAction } = props;

  return [
    {
      field: 'id',
      headerName: getText('generic.id'),
      align: 'left',
      width: 60,
      sortable: true,
    },
    {
      field: 'username',
      headerName: getText('users.username'),
      align: 'left',
      width: 250,
      sortable: true,
    },
    {
      field: 'firstName',
      headerName: getText('users.firstName'),
      width: 200,
      sortable: false,
      align: 'left',
    },
    {
      field: 'lastName',
      headerName: getText('users.lastName'),
      width: 200,
      sortable: false,
      align: 'left',
    },
    {
      field: 'businessPhoneNumber',
      headerName: getText('address.businessPhoneNumber'),
      width: 200,
      sortable: false,
      align: 'left',
    },
    {
      field: 'homePhoneNumber',
      headerName: getText('address.homePhoneNumber'),
      width: 200,
      sortable: false,
      align: 'left',
    },
    {
      field: 'cellPhoneNumber',
      headerName: getText('address.cellPhoneNumber'),
      width: 200,
      sortable: false,
      align: 'left',
    },
    {
      field: 'isMapp',
      headerName: getText('users.isMapp'),
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
      field: 'state',
      headerName: getText('address.state'),
      width: 200,
      sortable: false,
      align: 'left',
    },
    {
      field: '',
      headerName: '',
      width: 120,
      // eslint-disable-next-line
      onRender: (args) => {
        // eslint-disable-next-line
        const { dataRow } = args;
        return (
          <LinkActions
            items={[
              {
                clickId: 'edit',
                text: getText('generic.edit'),
                variant: 'tertiary',
              },
              // {
              //   clickId: 'remove',
              //   text: getText('generic.remove'),
              //   variant: 'tertiary',
              // },
            ]}
            onClick={(button) => handleAction(button, dataRow)}
          />
        );
      },
    },
  ];
};
