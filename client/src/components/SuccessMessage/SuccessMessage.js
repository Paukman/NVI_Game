import React, { memo } from 'react';
import PropTypes from 'prop-types';

import { Container } from './styled';

/**
 * Update with a component from mdo-react-components as soon as such is ready.
 */
const SuccessMessage = memo((props) => {
  const { children, withMargin } = props;

  return <Container withMargin={withMargin}>{children}</Container>;
});

SuccessMessage.displayName = 'SuccessMessage';

SuccessMessage.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
  withMargin: PropTypes.bool,
};

SuccessMessage.defaultProps = {
  withMargin: true,
};

export { SuccessMessage };
