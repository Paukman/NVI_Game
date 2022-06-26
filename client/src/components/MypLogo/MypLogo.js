import React, { memo } from 'react';

import { StyledMypLogo } from './styled';

const MypLogo = memo(() => {
  return <StyledMypLogo data-el='appName'>myPerspective 2.0</StyledMypLogo>;
});

MypLogo.displayName = 'MypLogo';

export { MypLogo };
