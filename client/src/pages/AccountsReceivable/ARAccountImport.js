import React, { memo, Fragment, useContext } from 'react';
import { useHistory } from 'react-router-dom';

import { Button, ToolBar, ToolBarItem } from 'mdo-react-components';

import { AppContext } from '../../contexts';

const ARAccountImport = memo(() => {
  const history = useHistory();
  const { appPages } = useContext(AppContext);

  return (
    <Fragment>
      <ToolBar>
        <ToolBarItem></ToolBarItem>
      </ToolBar>
      <Fragment>AR ACCOUNT IMPORT</Fragment>
    </Fragment>
  );
});

ARAccountImport.displayName = 'ARAccountImport';

export { ARAccountImport };
