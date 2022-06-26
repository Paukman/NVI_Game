import React from 'react';
import { useParams, useLocation } from 'react-router-dom';

import { PurchaseOrderProvider } from '../../providers/PurchaseOrderProvider';
import { PurchaseOrderAddEditPage } from './PurchaseOrderAddEditPage';

const PurchaseOrderAddEdit = () => {
  const params = useParams();
  const location = useLocation();
  const purchaseOrderId = params.id;
  const addEditMode = location?.state?.addEditMode;

  return (
    <PurchaseOrderProvider purchaseOrderId={purchaseOrderId} addEditMode={addEditMode}>
      <PurchaseOrderAddEditPage />
    </PurchaseOrderProvider>
  );
};

PurchaseOrderAddEdit.displayName = 'PurchaseOrderAddEdit';

export { PurchaseOrderAddEdit };
