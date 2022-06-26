import React, { memo } from 'react';
import { Menu as MenuMaterialUi } from '@material-ui/core';
import { useMenuStyle } from './styled';

const Menu = memo((props) => {
  const classes = useMenuStyle();

  return (
    <MenuMaterialUi
      classes={classes}
      elevation={0}
      getContentAnchorEl={null}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      {...props}
    />
  );
});

Menu.displayName = 'Menu';

export { Menu };
