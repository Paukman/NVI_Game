import React, { memo, useContext } from 'react';
import { PurchaseOrderContext } from '../../../providers/PurchaseOrderProvider';
import { PurchaseOrderAddressDrawer, PurchaseOrderAddEditAddress } from './index';

// will be used both for vendors and hotels
export const PurchaseOrderAddressMenu = memo(() => {
  const { addEdit } = useContext(PurchaseOrderContext);
  const { addEditState } = addEdit;
  const { showNewAddressForm } = addEditState;

  return showNewAddressForm ? <PurchaseOrderAddEditAddress /> : <PurchaseOrderAddressDrawer />;
});

PurchaseOrderAddressMenu.displayName = 'PurchaseOrderAddressMenu';
