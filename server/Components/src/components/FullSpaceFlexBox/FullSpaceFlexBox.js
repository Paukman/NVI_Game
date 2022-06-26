import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { StyledDiv } from './styled';

const FullSpaceFlexBox = memo((props) => {
  const { children } = props;
  return <StyledDiv>{children}</StyledDiv>;
});

FullSpaceFlexBox.displayName = 'FullSpaceFlexBox';

FullSpaceFlexBox.propTypes = {
  children: PropTypes.node,
};

export { FullSpaceFlexBox };
