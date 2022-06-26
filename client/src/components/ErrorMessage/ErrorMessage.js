import React, { memo } from 'react';
import PropTypes from 'prop-types';

import { Container } from './styled';

/**
 * Update with a component from mdo-react-components as soon as such is ready.
 */
const ErrorMessage = memo((props) => {
  const { children, withMargin } = props;

  return <Container withMargin={withMargin}>{children}</Container>;
});

ErrorMessage.displayName = 'ErrorMessage';

ErrorMessage.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
  withMargin: PropTypes.bool,
};

ErrorMessage.defaultProps = {
  withMargin: true,
};

export { ErrorMessage };
