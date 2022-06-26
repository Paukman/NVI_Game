import React, { memo } from 'react';
import PropTypes from 'prop-types';

import { Container } from './styled';

const Content = memo((props) => {
  const { children, mt, mr, mb, ml, pt, pr, pb, pl } = props;

  const margin =
    (mt ? `${mt}px ` : '0 ') + (mr ? `${mr}px ` : '0 ') + (mb ? `${mb}px ` : '0 ') + (ml ? `${ml}px ` : '0 ');
  const padding =
    (pt ? `${pt}px ` : '0 ') + (pr ? `${pr}px ` : '0 ') + (pb ? `${pb}px ` : '0 ') + (pl ? `${pl}px ` : '0 ');

  return (
    <Container margin={margin} padding={padding}>
      {children}
    </Container>
  );
});
Content.displayName = 'Content';

Content.propTypes = {
  children: PropTypes.node,
  mt: PropTypes.number,
  mr: PropTypes.number,
  mb: PropTypes.number,
  ml: PropTypes.number,
  pt: PropTypes.number,
  pr: PropTypes.number,
  pb: PropTypes.number,
  pl: PropTypes.number,
};

Content.defaultProps = {
  mt: 0,
  mr: 0,
  mb: 0,
  ml: 0,
  pt: 0,
  pr: 0,
  pb: 0,
  pl: 0,
};

export default Content;
