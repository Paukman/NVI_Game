import React from 'react';
import PropTypes from 'prop-types';
import { Collapse as MaterialUiCollapse } from '@material-ui/core';

const Collapse = (props) => {
  const { children, open, collapsedHeight } = props;

  return (
    <MaterialUiCollapse in={open} collapsedHeight={collapsedHeight}>
      {children}
    </MaterialUiCollapse>
  );
};

Collapse.propTypes = {
  children: PropTypes.node,
  open: PropTypes.bool,
  collapsedHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

Collapse.defaultProps = {
  open: false,
  collapsedHeight: '0px',
};

export { Collapse };
