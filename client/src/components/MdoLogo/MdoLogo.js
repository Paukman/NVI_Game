import React, { memo } from 'react';

import { StyledMdoLogo } from './styled';

const MdoLogo = memo(() => {
  return <StyledMdoLogo src='/mdo_logo_color.svg' alt='' data-el='appLogo' />;
});

MdoLogo.displayName = 'MdoLogo';

export { MdoLogo };
