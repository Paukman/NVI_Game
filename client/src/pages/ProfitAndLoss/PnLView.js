import React, { memo } from 'react';
import { useLocation } from 'react-router-dom';
import { ToolBar, ToolBarItem, Button } from 'mdo-react-components';

import { DisplayNoData, DataLoading, DisplayApiErrors, DataContainer, IfPermitted } from 'components';
import { getText } from 'utils/localesHelpers';
import { usePnLView } from './hooks';
import { FormContainer } from './styled';
import { PnLViewTable } from './componentns/PnLViewTable';

const PnLView = memo(() => {
  const location = useLocation();
  const pageKey = location?.state?.key;

  const { state, onHandleActions, onHandleAddNew, onHandleCloseView } = usePnLView(pageKey);

  return (
    <>
      <ToolBar>
        <ToolBarItem toTheRight>
          <IfPermitted page='pnl-view' permissionType='create'>
            <Button
              style={{ padding: '10px 10px' }}
              iconName='Add'
              text={getText('pnl.createCustomView')}
              variant='tertiary'
              title={getText('generic.add')}
              onClick={onHandleAddNew}
              disabled={false} // add you condition
              dataEl='buttonAdd'
            />
          </IfPermitted>
        </ToolBarItem>
        {pageKey && (
          <ToolBarItem>
            <Button
              iconName='Close'
              text=''
              variant='tertiary'
              title={getText('generic.close')}
              onClick={onHandleCloseView}
              dataEl='buttonXCancel'
            />
          </ToolBarItem>
        )}
      </ToolBar>
      {state?.listData?.length ? (
        <DataContainer obsoleteData={state?.requestReport}>
          <FormContainer width={355} formPlacement={'center'}>
            <PnLViewTable data={state?.listData} onHandleActions={onHandleActions} />
          </FormContainer>
        </DataContainer>
      ) : (
        <>
          {state?.pageState.LOADING && <DataLoading />}
          {state?.pageState.ERROR && <DisplayApiErrors errors={state?.errors} />}
          {state?.pageState.NO_DATA_VIEW && <DisplayNoData message={state?.pageState.NO_DATA_VIEW} />}
        </>
      )}
    </>
  );
});

PnLView.displayName = 'PnLView';

export { PnLView };
