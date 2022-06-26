import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { StyledDiv } from './styled';

const Card = memo((props) => {
  const { children, noPadding, noTopPadding, scrollableY, scrollableX } = props;
  return (
    <StyledDiv noPadding={noPadding} noTopPadding={noTopPadding} scrollableY={scrollableY} scrollableX={scrollableX}>
      {children}
    </StyledDiv>
  );
});

Card.displayName = 'Card';

Card.propTypes = {
  children: PropTypes.node,
  noPadding: PropTypes.bool,
  noTopPadding: PropTypes.bool,
  scrollableY: PropTypes.bool,
  scrollableX: PropTypes.bool,
};

Card.defaultProps = {
  noPadding: false,
  noTopPadding: false,
  scrollable: false,
  children: undefined,
};

export default Card;
