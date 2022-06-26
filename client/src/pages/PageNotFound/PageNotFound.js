import React, { memo } from 'react';
import { PageNotFound as PageNotFoundComponent } from 'mdo-react-components';

import { Container } from './styled';

const PageNotFound = memo(() => {
  return (
    <Container>
      <PageNotFoundComponent />
    </Container>
  );
});

PageNotFound.displayName = 'PageNotFound';

export { PageNotFound };
