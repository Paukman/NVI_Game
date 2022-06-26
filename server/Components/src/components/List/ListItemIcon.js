import React from 'react';
import PropTypes from 'prop-types';
import { ListItemIcon as MaterialUiListItemIcon } from '@material-ui/core';

import { useListItemIconStyles } from './styled';

const ListItemIcon = (props) => {
  const { children } = props;
  const classes = useListItemIconStyles();

  return <MaterialUiListItemIcon classes={classes}>{children}</MaterialUiListItemIcon>;
};

ListItemIcon.displayName = 'ListItemIcon';

ListItemIcon.propTypes = {
  children: PropTypes.node,
};

export { ListItemIcon };
