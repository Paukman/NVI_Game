import React from 'react';
import { useParams } from 'react-router-dom';

import { PurchaseOrderProvider } from '../../providers/PurchaseOrderProvider';
import { PurchaseOrderViewPage } from './PurchaseOrderViewPage';

const PurchaseOrderView = () => {
  const params = useParams();
  const purchaseOrderId = params.id;

  return (
    <PurchaseOrderProvider purchaseOrderId={purchaseOrderId}>
      <PurchaseOrderViewPage />
    </PurchaseOrderProvider>
  );
};

PurchaseOrderView.displayName = 'PurchaseOrderView';

export { PurchaseOrderView };
