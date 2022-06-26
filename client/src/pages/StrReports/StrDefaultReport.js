import React from 'react';

import { StrProvider } from 'providers';
import { StrDefaultReportPage } from './StrDefaultReportPage';

const StrDefaultReport = () => {
  return (
    <StrProvider>
      <StrDefaultReportPage />
    </StrProvider>
  );
};

StrDefaultReport.displayName = 'StrDefaultReport';

export { StrDefaultReport };
