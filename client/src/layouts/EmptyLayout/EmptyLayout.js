import React from 'react';
import PropTypes from 'prop-types';

import { StyledEmptyLayout } from './styled';

const EmptyLayout = (props) => {
  const { children } = props;

  return <StyledEmptyLayout>{children}</StyledEmptyLayout>;
};

EmptyLayout.displayName = 'EmptyLayout';

EmptyLayout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

export { EmptyLayout };
