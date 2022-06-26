import React, { memo, useContext } from 'react';

import { PurchaseOrderContext } from '../../providers/PurchaseOrderProvider';
import { Button, ToolBarItem, Content, ToolBar } from 'mdo-react-components';
import { ViewButtonContainer } from './styled';
import { getText } from '../../utils/localesHelpers';
import { PurchaseOrderPrint } from './components';
import { IfPermitted } from 'components';

const PurchaseOrderViewPage = memo(() => {
  // use provider, not directly from the hook
  const { view } = useContext(PurchaseOrderContext);
  const { viewState, onEdit, onMarkReceived, goBack, onCreateDuplicate } = view;
  const { data: state } = viewState;

  return (
    <>
      <Content mb={-50}>
        <ToolBar>
          <ToolBarItem toTheRight>
            <Button dataEl='buttonClose' iconName='Close' variant='tertiary' onClick={goBack} />
          </ToolBarItem>
        </ToolBar>
      </Content>
      <ViewButtonContainer>
        <ToolBar>
          <Content mt={16} />
          <ToolBarItem toTheRight>
            <IfPermitted page='purchase-orders-view' permissionType='view'>
              <Button
                text={state?.poReceivedAt ? getText('po.markActive') : getText('po.markReceived')}
                onClick={onMarkReceived}
                dataEl='buttonActiveReceived'
              />
            </IfPermitted>
          </ToolBarItem>
          <ToolBarItem>
            <IfPermitted page='purchase-orders-view' permissionType='view'>
              <Button dataEl='buttonDuplicate' text={getText('generic.duplicate')} onClick={onCreateDuplicate} />
            </IfPermitted>
          </ToolBarItem>
          <ToolBarItem>
            <IfPermitted page='purchase-orders-print' permissionType='view'>
              <Button dataEl='buttonPrint' text={getText('generic.print')} />
            </IfPermitted>
          </ToolBarItem>
          <ToolBarItem>
            <IfPermitted page='purchase-orders-edit' permissionType='view'>
              <Button
                dataEl='buttonEdit'
                text=''
                iconName='Edit'
                variant='tertiary'
                onClick={onEdit}
                disabled={state?.poReceivedAt}
              />
            </IfPermitted>
          </ToolBarItem>
        </ToolBar>
      </ViewButtonContainer>
      <PurchaseOrderPrint />
    </>
  );
});

PurchaseOrderViewPage.displayName = 'PurchaseOrderView';

export { PurchaseOrderViewPage };
