import React, { memo } from 'react';
import { DisplayNoData } from '../../components/DisplayNoData';

const LaborDefault = memo(() => {
  return <DisplayNoData message='The page is in development' />;
});

LaborDefault.displayName = 'LaborDefault';

export { LaborDefault };
