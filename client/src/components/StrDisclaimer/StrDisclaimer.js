import React, { Fragment, memo } from 'react';
import { getText } from 'utils/localesHelpers';

import { StyledStrDisclaimer, StyledStrDisclaimerImg, StyledDiv } from './styled';

const StrDisclaimer = memo(() => {
  return (
    <Fragment>
      <StyledDiv>
        <StyledStrDisclaimerImg src='/str_logo_color.svg' alt='' data-el='StrDisclaimer' />
        <StyledStrDisclaimer data-el='StrDisclaimer'>{getText(`strReports.strDisclaimer`)}</StyledStrDisclaimer>
      </StyledDiv>
    </Fragment>
  );
});

StrDisclaimer.displayName = 'StrDisclaimer';

export { StrDisclaimer };
