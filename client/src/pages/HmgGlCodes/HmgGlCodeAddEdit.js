import React, { memo } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { ToolBarItem, Button, ToolBar } from 'mdo-react-components';
import { GenericForm } from 'components';
import { addEditGenericFormConfig } from './constants';

import { useHgmGlCodesAddEdit } from './hooks';
import { getText } from 'utils';

const HmgGlCodeAddEdit = memo(() => {
  const location = useLocation();
  const params = useParams();

  const pageKey = location?.state?.key ?? null; // just in case its undefined
  const disabledItems = location?.state?.disabledItems ?? null;
  const hmgGlCodeId = params?.id ?? null;

  const { state, onHandleSave, onHandleCancel, onChange } = useHgmGlCodesAddEdit(hmgGlCodeId, pageKey, disabledItems);
  const { formConfig } = addEditGenericFormConfig(onHandleCancel, onHandleSave, onChange, state);

  return (
    <div>
      <ToolBar>
        <ToolBarItem toTheRight>
          <Button
            iconName='Close'
            text=''
            variant='tertiary'
            title={getText('generic.close')}
            onClick={onHandleCancel}
            dataEl='buttonXCancel'
          />
        </ToolBarItem>
      </ToolBar>
      <GenericForm formConfig={formConfig} data={state?.editData || {}} errors={state?.errors} />
    </div>
  );
});

HmgGlCodeAddEdit.displayName = 'HmgGlCodeAddEdit';

export { HmgGlCodeAddEdit };
