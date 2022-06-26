import React from 'react';
import PropTypes from 'prop-types';
import { ListItem as MaterialUiListItem } from '@material-ui/core';

import { useListItemStyles } from './styled';

const ListItem = (props) => {
  const {
    component,
    dense,
    disableGutters,
    selected,
    divider,
    disabled,
    autoFocus,
    children,
    onClick,
    classes,
    dividerheight,
  } = props;
  const localClasses = useListItemStyles(props);

  return (
    <MaterialUiListItem
      button
      classes={{ ...localClasses, ...(classes || {}) }}
      component={component}
      dense={dense}
      disableGutters={disableGutters}
      selected={selected}
      divider={divider}
      disabled={disabled}
      autoFocus={autoFocus}
      onClick={onClick}
      dividerheight={dividerheight}
    >
      {children}
    </MaterialUiListItem>
  );
};

ListItem.displayName = 'ListItem';

ListItem.propTypes = {
  children: PropTypes.node,
  component: PropTypes.string,
  dense: PropTypes.bool,
  disableGutters: PropTypes.bool,
  selected: PropTypes.bool,
  divider: PropTypes.bool,
  disabled: PropTypes.bool,
  autoFocus: PropTypes.bool,
  onClick: PropTypes.func,
  classes: PropTypes.any,
  dividerheight: PropTypes.string,
};

ListItem.defaultProps = {
  component: 'li',
  dense: false,
  disableGutters: false,
  selected: false,
  divider: false,
  disabled: false,
  autoFocus: false,
  dividerheight: '2px',
};

export { ListItem };
