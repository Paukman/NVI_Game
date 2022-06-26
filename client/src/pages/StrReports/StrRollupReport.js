import React, { memo, Fragment, useContext, useState } from 'react';

import { ToolBar, ToolBarItem, Toggle } from 'mdo-react-components';

import { DisplayNoData } from '../../components';
import { getText } from '../../utils/localesHelpers';

const StrRollupReport = memo(() => {
  const [mode, setMode] = useState(0);

  return (
    <Fragment>
      <ToolBar>
        <ToolBarItem toTheRight>
          <Toggle
            value={mode}
            onChange={(item) => {
              setMode(item);
            }}
            dataEl='toggleSTRRollupPage'
          >
            <div>{getText('strReports.weekRollup')}</div>
            <div>{getText('strReports.monthRollup')}</div>
          </Toggle>
        </ToolBarItem>
      </ToolBar>
      <Fragment>
        <DisplayNoData message={getText('generic.emptyData')} />
      </Fragment>
    </Fragment>
  );
});

StrRollupReport.displayName = 'StrRollupReport';

export { StrRollupReport };
