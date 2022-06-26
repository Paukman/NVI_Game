import React, { memo, Fragment, useContext } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { ToolBar, ToolBarItem } from 'mdo-react-components';

import { AppContext } from '../../contexts';

const SalesManagersImport = memo(() => {
  const history = useHistory();
  const params = useParams();
  const { appPages } = useContext(AppContext);

  return (
    <Fragment>
      <ToolBar>
        <ToolBarItem></ToolBarItem>
      </ToolBar>
      <Fragment>SALES MANAGER IMPORT</Fragment>
    </Fragment>
  );
});

SalesManagersImport.displayName = 'SalesManagersImport';

export { SalesManagersImport };
