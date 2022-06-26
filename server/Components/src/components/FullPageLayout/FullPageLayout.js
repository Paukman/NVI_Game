import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { StyledDiv } from './styled';

const FullPageLayout = memo((props) => {
  const { children, bgColor, bgImage } = props;
  return (
    <StyledDiv bgColor={bgColor} bgImage={bgImage}>
      {children}
    </StyledDiv>
  );
});

FullPageLayout.displayName = 'FullPageLayout';

FullPageLayout.propTypes = {
  children: PropTypes.node,
  bgColor: PropTypes.string,
  bgImage: PropTypes.string,
};

FullPageLayout.defaultProps = {
  bgColor: 'white',
};

export default FullPageLayout;
