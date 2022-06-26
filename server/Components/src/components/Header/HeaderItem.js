import React from 'react';
import PropTypes from 'prop-types';
import { HeaderItem } from './styled';

HeaderItem.displayName = 'HeaderItem';

HeaderItem.propTypes = {
  toTheRight: PropTypes.bool,
};

HeaderItem.defaultProps = {
  toTheRight: false,
};

export default HeaderItem;
