import React from 'react';
import PropTypes from 'prop-types';
import { List as MaterialUiList } from '@material-ui/core';

import { useListStyles } from './styled';

const List = (props) => {
  const { children, component, dense, disablePadding, subheader, level } = props;
  const classes = useListStyles({ level });

  return (
    <MaterialUiList
      classes={classes}
      component={component}
      dense={dense}
      disablePadding={disablePadding}
      subheader={subheader}
      data-level={level}
    >
      {children}
    </MaterialUiList>
  );
};

List.displayName = 'List';

List.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
  component: PropTypes.string,
  dense: PropTypes.bool,
  disablePadding: PropTypes.bool,
  subheader: PropTypes.node,
  level: PropTypes.number,
};

List.defaultProps = {
  component: 'ul',
  dense: false,
  disablePadding: false,
  level: 1,
};

export { List };
