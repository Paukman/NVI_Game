import React from 'react';
import PropTypes from 'prop-types';

import { ToolBarItem } from './styled';

ToolBarItem.displayName = 'ToolBarItem';

ToolBarItem.propTypes = {
  toTheRight: PropTypes.bool,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  marginRight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  marginTop: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

ToolBarItem.defaultProps = {
  toTheRight: false,
};

export default ToolBarItem;
