import React, { createContext, memo } from 'react';
import PropTypes from 'prop-types';
import { Drawer } from 'mdo-react-components';

import useShowDrawer from './useShowDrawer';

export const DrawerContext = createContext();

export const DrawerProvider = ({ children }) => {
  DrawerProvider.propTypes = {
    children: PropTypes.node,
  };
  const { showDrawer, hideDrawer, drawerState } = useShowDrawer();

  return (
    <DrawerContext.Provider value={{ showDrawer, hideDrawer }}>
      {children}
      <Drawer
        anchor={drawerState.anchor}
        elevation={drawerState.elevation}
        variant={drawerState.variant}
        open={drawerState.open}
        onClose={hideDrawer}
      >
        {drawerState.content}
      </Drawer>
    </DrawerContext.Provider>
  );
};
