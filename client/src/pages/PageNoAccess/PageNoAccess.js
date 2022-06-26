import React, { memo } from 'react';
import { EmptyLayout } from '../../layouts';

const PageNoAccess = memo(() => {
  return (
    <EmptyLayout>
      <h1>No Access</h1>
      <p>Unfortunately, you have no access rights to access this page.</p>
      {/* TODO: Implement this page as per design */}
    </EmptyLayout>
  );
});

PageNoAccess.displayName = 'PageNoAccess';

export { PageNoAccess };
