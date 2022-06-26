import React from 'react';
import { LinkActions, Icon, InputField } from 'mdo-react-components';

import { getText } from '../../utils/localesHelpers';
import { PurchaseOrderMoreMenu } from '../../components/PurchaseOrders/PurchaseOrderMoreMenu';

export const allItemsForVendor = {
  value: 'allVendors',
  label: getText('po.allVendors'),
  name: 'allVendors',
};

export const zeroUUID = '70000000-e000-4000-b000-800000000000';

export const alternateAddress = {
  vendor: 'vendor',
  hotel: 'hotel',
};

export const addEditMode = {
  ADD: 'ADD',
  EDIT: 'EDIT',
  DUPLICATE: 'DUPLICATE',
};

export const addressEditMode = {
  ADD: 'ADD',
  EDIT: 'EDIT',
};

const actionsButtons = [
  {
    clickId: 'print',
    text: getText('generic.print'),
    variant: 'tertiary',
  },
  {
    clickId: 'poMarkReceived',
    text: getText('po.poMarkReceived'),
    variant: 'tertiary',
  },
];

export const mappingPurchaseOrderColumns = (args) => {
  const { onPurchaseOrderSelect, onHandleMoreOptions } = args;
  return [
    {
      field: 'poId',
      headerName: getText('po.id'),
      align: 'left',
      width: 70,
      sortable: true,
      // eslint-disable-next-line
      onRender: ({ dataRow }) => {
        const { poId } = dataRow || {};
        return (
          <LinkActions
            hasFont
            noPadding
            items={[
              {
                clickId: 'comments',
                text: poId,
                textDecoration: 'underline',
              },
            ]}
            onClick={() => {
              onPurchaseOrderSelect(poId);
            }}
          />
        );
      },
    },
    {
      field: 'received',
      headerName: '',
      align: 'center',
      width: 30,
      // eslint-disable-next-line
      onRender: ({ dataRow }) => {
        const { poReceivedAt } = dataRow || {};
        return poReceivedAt && <Icon name='CheckCircle' size={20} color='#338E4D' />;
      },
    },
    {
      field: 'propertyName',
      headerName: getText('po.property'),
      width: 'auto',
      align: 'left',
      sortable: true,
    },
    {
      field: 'poType',
      headerName: getText('po.type'),
      width: 'auto',
      sortable: true,
      align: 'left',
      bgColor: true,
    },
    {
      field: 'date',
      headerName: getText('po.date'),
      width: 90,
      sortable: true,
      align: 'center',
    },
    {
      field: 'vendorId',
      headerName: getText('po.vendor'),
      width: 300,
      align: 'left',
      sortable: true,
      bgColor: true,
    },
    {
      field: 'total',
      headerName: getText('po.total'),
      width: 'auto',
      align: 'right',
      sortable: true,
    },
    {
      field: 'createdBy',
      headerName: getText('po.createdBy'),
      width: 'auto',
      align: 'left',
      sortable: true,
      bgColor: true,
    },
    {
      field: 'action',
      headerName: '',
      width: 60,
      // eslint-disable-next-line
      onRender: (args) => {
        // eslint-disable-next-line
        const { dataRow } = args;
        return (
          <PurchaseOrderMoreMenu
            onClick={(action) => onHandleMoreOptions({ action, dataRow })}
            poReceivedAt={dataRow?.poReceivedAt}
          />
        );
      },
    },
  ];
};

export const alternateAddressFormConfig = (handleCancel, handleSubmit) => {
  const buttonCfg = [
    {
      clickId: 'cancel',
      text: 'Cancel',
      variant: 'default',
      onHandleClick: handleCancel,
    },
    {
      clickId: 'submit',
      text: 'Save',
      variant: 'success',
      onHandleClick: handleSubmit,
    },
  ];

  const displayCfg = {
    placement: 'center',
    buttonPlacement: 'right',
    buttonSize: 'default',
    width: '100%',
    formTitle: getText('po.alternateAddress'),
    xCancel: handleCancel,
  };

  const items = [
    {
      name: 'addressName',
      attrs: { label: getText('po.deliveryLocationName') },
      component: <InputField />,
      visible: true,
      helperText: getText('po.required'),
    },
    {
      name: 'address1',
      attrs: { label: getText('po.address1') },
      component: <InputField />,
      visible: true,
      helperText: getText('po.required'),
    },
    {
      name: 'address2',
      attrs: { label: getText('po.address1') },
      component: <InputField />,
      visible: true,
    },
    {
      name: 'city',
      attrs: { label: getText('po.city') },
      component: <InputField />,
      visible: true,
      helperText: getText('po.required'),
    },
    {
      name: 'stateProvince',
      attrs: { label: getText('po.stateProvince') },
      component: <InputField />,
      visible: true,
      helperText: getText('po.required'),
    },
    {
      name: 'postalCode',
      attrs: { label: getText('po.zipCodePostalCode') },
      component: <InputField />,
      visible: true,
      helperText: getText('po.required'),
    },
    {
      name: 'country',
      attrs: { label: getText('po.country') },
      component: <InputField />,
      visible: true,
      helperText: getText('po.required'),
    },
  ];
  return {
    formCfg: {
      buttonCfg,
      displayCfg,
      items,
    },
  };
};

export const pageState = {
  ERROR: { state: 'ERROR' },
  MESSAGE: { state: 'MESSAGE', message: getText('po.noPurchaseOrdersFound') },
  LOADING: { state: 'LOADING' },
  DEFAULT: { state: 'MESSAGE', message: getText('generic.selectFilters') },
};
