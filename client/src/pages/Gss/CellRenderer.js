import React from 'react';
import PropTypes from 'prop-types';

const CellRenderer = ({ value }) => <span>{value}</span>;

CellRenderer.displayName = 'CellRenderer';

CellRenderer.propTypes = {
  value: PropTypes.any,
};

export { CellRenderer };
