import React, { memo } from 'react';
import { DisplayNoData } from '../../components/DisplayNoData';

const LaborPeriod = memo(() => {
  return <DisplayNoData message='The page is in development' />;
});

LaborPeriod.displayName = 'LaborPeriod';

export { LaborPeriod };
