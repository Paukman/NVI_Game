import React, { memo } from 'react';
import { MenuItem as MenuItemMaterialUi } from '@material-ui/core';
import { useMenuItemStyle } from './styled';

const MenuItem = memo((props) => {
  const classes = useMenuItemStyle(props);
  return <MenuItemMaterialUi classes={classes} {...props} />;
});

MenuItem.displayName = 'MenuItem';

export { MenuItem };
