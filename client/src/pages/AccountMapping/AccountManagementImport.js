import React, { memo, Fragment, useContext } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { ToolBar, ToolBarItem } from 'mdo-react-components';

import { AppContext } from '../../contexts';

const AccountManagementImport = memo(() => {
  const history = useHistory();
  const params = useParams();
  const { appPages } = useContext(AppContext);

  return (
    <Fragment>
      <ToolBar>
        <ToolBarItem></ToolBarItem>
      </ToolBar>
      <Fragment>CUSTOM ACCOUNTS IMPORT</Fragment>
    </Fragment>
  );
});

AccountManagementImport.displayName = 'AccountManagementImport';

export { AccountManagementImport };
