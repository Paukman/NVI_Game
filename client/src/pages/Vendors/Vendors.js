import React, { memo } from 'react';
import { DisplayNoData } from '../../components/DisplayNoData';

const Vendors = memo(() => {
  return <DisplayNoData message='The page is in development' />;
});

Vendors.displayName = 'Vendors';

export { Vendors };
