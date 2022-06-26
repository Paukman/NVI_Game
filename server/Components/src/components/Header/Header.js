import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Container } from './styled';

const Header = memo((props) => {
  const { bgColor, color, children, dataEl } = props;

  return (
    <Container bgColor={bgColor} color={color} data-el={dataEl}>
      {children}
    </Container>
  );
});

Header.displayName = 'Header';

Header.propTypes = {
  bgColor: PropTypes.string,
  color: PropTypes.string,
  children: PropTypes.node,
  dataEl: PropTypes.string,
};

Header.defaultProps = {
  dataEl: 'appHeader',
};

export default Header;
