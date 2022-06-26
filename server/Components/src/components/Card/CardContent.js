import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { StyledCardContent } from './styled';

const CardContent = memo((props) => {
  const { children } = props;
  return <StyledCardContent>{children}</StyledCardContent>;
});

CardContent.displayName = 'CardContent';

CardContent.propTypes = {
  children: PropTypes.node,
};

export default CardContent;
