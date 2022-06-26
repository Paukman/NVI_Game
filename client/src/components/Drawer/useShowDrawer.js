import React, { useCallback, useState } from 'react';
import { Button } from 'mdo-react-components';
import useIsMounted from '../../hooks/useIsMounted';

const useShowDrawer = () => {
  const [drawerState, setDrawerState] = useState({
    anchor: 'right',
    elevation: 16,
    variant: 'temporary',
    // add your callback here if you need additional action when closing
    onHideDrawer: () => null,
    open: false,
    content: null,
  });

  const isMounted = useIsMounted();

  const showDrawer = useCallback(
    ({ onHideDrawer = () => null, anchor = 'right', elevation = 16, variant = 'temporary', content = null }) => {
      if (isMounted()) {
        setDrawerState({
          open: true,
          onHideDrawer,
          anchor,
          elevation,
          variant,
          content,
        });
      }
    },
    [isMounted],
  );

  const hideDrawer = (_, reason) => {
    if (isMounted()) {
      drawerState.onHideDrawer();
      setDrawerState((state) => {
        return {
          ...state,
          open: false,
        };
      });
    }
  };

  return {
    showDrawer,
    hideDrawer,
    drawerState,
  };
};

export default useShowDrawer;
