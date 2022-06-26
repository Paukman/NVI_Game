import React, { memo } from 'react';
import { DisplayNoData } from '../../components/DisplayNoData';

const VendorsImport = memo(() => {
  return <DisplayNoData message='The page is in development' />;
});

VendorsImport.displayName = 'VendorsImport';

export { VendorsImport };
