import React, { memo } from 'react';

import { Progress, Typography } from 'mdo-react-components';

import { Container, Title } from './styled';

const DataLoading = memo(() => {
  return (
    <Container>
      <Progress type='circularProgress' />
      <Title>Loading...</Title>
    </Container>
  );
});

DataLoading.displayName = 'DataLoading';

export { DataLoading };
