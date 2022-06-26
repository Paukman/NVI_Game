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
  const { onEdit, onRemove } = args;

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
      field: 'firstName',
      headerName: getText('salesmanager.firstName'),
      align: 'left',
      width: 150,
      color: '#3b6cb4',
      background: '#fffff',
    },
    {
      field: 'lastName',
      headerName: getText('salesmanager.lastName'),
      align: 'left',
      width: 150,
      color: '#3b6cb4',
      background: '#fffff',
    },
    {
      field: '',
      headerName: getText('salesmanager.address'),
      align: 'left',
      width: 150,
      color: '#3b6cb4',
      background: '#fffff',
      onRender: ({ dataRow }) => {
        return `${dataRow.address1}, ${dataRow.address2}, ${dataRow.city}, ${dataRow.state} `;
      },
    },
    {
      field: 'phone',
      headerName: getText('salesmanager.phone'),
      align: 'left',
      width: 150,
      color: '#3b6cb4',
      background: '#fffff',
    },
    {
      field: 'email',
      headerName: getText('salesmanager.email'),
      align: 'left',
      width: 150,
      color: '#3b6cb4',
      background: '#fffff',
    },
    {
      field: '',
      width: 200,
      sortable: false,
      background: '#fffff',
      // eslint-disable-next-line
      onRender: ({ dataRow }) => {
        return (
          <IfPermitted page='sales-managers' permissionType='edit'>
            <LinkActions items={actionsButtons} onClick={(button) => handleAction(button, dataRow)} />
          </IfPermitted>
        );
      },
    },
  ];
};
