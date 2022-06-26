import React, { useEffect } from 'react';
import { useLocation, useRouteMatch } from 'react-router-dom';

import { PurchaseOrderProvider } from '../../providers/PurchaseOrderProvider';
import { PurchaseOrdersPage } from './PurchaseOrdersPage';
import { PurchaseOrderView } from './PurchaseOrderView';

/*
export const usePurchaseOrderPages = () => {
  const location = useLocation();
  useEffect(() => {
    console.log(location);
  }, [location]);
};


export const PurchaseOrderSubView = ({ match }) => {
  console.log(match);
  switch (match.params.page) {
    case 'view':
      return <PurchaseOrderView id={match.params.id}/>;
    default: {
      return <PurchaseOrdersPage />;
    }
  }
};

export const PurchaseOrderPageSelection = () => {
  const match = useRouteMatch(`/:page/:id`);
  console.log(match);
  if (!match) return null;
  return <PurchaseOrderSubView match={match} />;
};*/

const PurchaseOrders = () => {
  // const poPages = usePurchaseOrderPages();
  return (
    <PurchaseOrderProvider>
      <PurchaseOrdersPage />
    </PurchaseOrderProvider>
  );
};

PurchaseOrders.displayName = 'PurchaseOrders';

export { PurchaseOrders };
