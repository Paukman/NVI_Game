import React, { memo } from 'react';
import PropTypes from 'prop-types';

import { Container } from './styled';

const ToolBar = memo((props) => {
  const { id, hidden, children, noPadding } = props;

  if (!children) {
    // We allow to pass 0 children and in this case we do not even render ToolBar.
    // This is an utility feature.
    return null;
  }

  if (hidden === true) {
    // Utility function to hide, ie, not render the ToolBar via the `hidden` prop
    return null;
  }

  return (
    <Container id={id} noPadding={noPadding}>
      {children}
    </Container>
  );
});

ToolBar.displayName = 'ToolBar';

ToolBar.propTypes = {
  id: PropTypes.string,
  hidden: PropTypes.bool,
  children: PropTypes.node,
  noPadding: PropTypes.bool,
};

ToolBar.defaultProps = {
  id: '',
  hidden: false,
  children: null,
  noPadding: false,
};

export default ToolBar;
