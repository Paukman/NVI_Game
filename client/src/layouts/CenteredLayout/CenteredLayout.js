import React from 'react';
import PropTypes from 'prop-types';

import { StyledCenteredLayout } from './styled';

const CenteredLayout = (props) => {
  const { children } = props;

  return <StyledCenteredLayout>{children}</StyledCenteredLayout>;
};

CenteredLayout.displayName = 'CenteredLayout';

CenteredLayout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

export { CenteredLayout };
