import { IfPermitted } from 'components';
import { LinkActions } from 'mdo-react-components';
import React from 'react';
import { getText } from '../../utils/localesHelpers';
import logger from '../../utils/logger';

const actionsButtons = [
  {
    clickId: 'edit',
    text: getText('generic.edit'),
    variant: 'tertiary',
  },
  {
    clickId: 'remove',
    text: getText('generic.remove'),
    variant: 'tertiary',
  },
];

export const columnsConfig = (args) => {
  const { onEdit, onRemove, errorInfo, disabledItems } = args;

  const handleClickEdit = (item) => {
    if (typeof onEdit === 'function') {
      onEdit(item);
    }
  };

  const handleClickRemove = (item) => {
    if (typeof onRemove === 'function') {
      onRemove(item);
    }
  };

  const handleAction = (button, item) => {
    logger.debug('Action', button);

    switch (button.clickId) {
      case 'edit':
        handleClickEdit(item);
        break;

      case 'remove':
        handleClickRemove(item);
        break;
    }
  };

  return [
    {
      field: 'accountName',
      headerName: getText('generic.accountName'),
      align: 'left',
      width: '85%',
      color: '#3b6cb4',
      background: '#fffff',
      sortable: true,
    },
    // {
    //   field: 'hotelSalesManagerId',
    //   headerName: getText('generic.hotelSalesManagerId'),
    //   width: 400,
    //   color: '#3b6cb4',
    //   background: '#fffff',
    //   sortable: true,
    // },
    // {
    //   field: 'managementStatusId',
    //   headerName: getText('generic.managementStatusId'),
    //   width: 400,
    //   color: '#3b6cb4',
    //   sortable: true,
    //   background: '#fffff',
    //   onRender: ({ dataRow }) => {
    //     return dataRow.managementStatusId == 1 ? 'Not Managed' : dataRow.managementStatusId == 100 ? 'Managed' : '';
    //   },
    // },
    {
      field: '',
      width: 200,
      sortable: false,
      background: '#fffff',
      // eslint-disable-next-line
      onRender: ({ dataRow }) => {
        return (
          <IfPermitted page='account-management' permissionType='edit'>
            <LinkActions items={actionsButtons} onClick={(button) => handleAction(button, dataRow)} />
          </IfPermitted>
        );
      },
    },
  ];
};
